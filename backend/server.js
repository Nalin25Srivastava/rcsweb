const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dns = require('dns');
const net = require('net');

// Load environment variables
dotenv.config();

const app = express();

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.use(helmet());
// app.use(limiter);
app.use(cors());
app.use(express.json({
    limit: '50mb',
    verify: (req, res, buf) => {
        req.rawBody = buf;
    }
}));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Diagnostic Routes
app.get('/api/ping', (req, res) => res.json({ 
  status: 'active', 
  time: new Date().toISOString(),
  env: process.env.NODE_ENV,
  isVercel: !!process.env.VERCEL
}));

app.get('/api/debug-dns', async (req, res) => {
    const results = {
        hasUri: !!process.env.MONGO_URI,
        uriCensored: process.env.MONGO_URI ? process.env.MONGO_URI.replace(/:([^@]+)@/, ':****@') : null,
        dns: {},
        socket: {},
        shards: []
    };

    if (!process.env.MONGO_URI) return res.json(results);

    try {
        const match = process.env.MONGO_URI.match(/@([^/]+)/);
        if (!match) {
            results.error = "Could not parse hostname from MONGO_URI";
            return res.json(results);
        }
        
        const host = match[1];
        results.targetHost = host;

        // 1. Test SRV Resolution (Essential for mongodb+srv)
        try {
            const srvRecords = await new Promise((resolve, reject) => {
                dns.resolveSrv('_mongodb._tcp.' + host, (err, addresses) => {
                    if (err) reject(err);
                    else resolve(addresses);
                });
            });
            results.dns.srv = srvRecords;
            results.dns.status = 'Success';

            // 2. Test connectivity to each shard address found
            for (const srv of srvRecords) {
                const shardHost = srv.name;
                const shardPort = srv.port;
                const shardResult = { host: shardHost, port: shardPort };
                
                try {
                    await new Promise((resolve, reject) => {
                        const client = new net.Socket();
                        client.setTimeout(3000);
                        client.connect(shardPort, shardHost, () => {
                           shardResult.status = 'Success';
                           client.destroy();
                           resolve();
                        });
                        client.on('error', (e) => {
                           shardResult.status = 'Failed';
                           shardResult.error = e.message;
                           resolve(); // Continue to next shard
                        });
                        client.on('timeout', () => {
                           shardResult.status = 'Timeout';
                           client.destroy();
                           resolve();
                        });
                    });
                } catch (e) {
                    shardResult.status = 'Error';
                    shardResult.error = e.message;
                }
                results.shards.push(shardResult);
            }
        } catch (e) {
            results.dns.status = 'SRV Lookup Failed';
            results.dns.error = e.message;
        }

        // 3. Simple IP resolution check
        try {
            results.dns.lookup = await new Promise((resolve, reject) => {
                dns.lookup(host, (err, address) => {
                    if (err) reject(err);
                    else resolve(address);
                });
            });
        } catch (e) {
             results.dns.lookupError = e.message;
        }

        res.json(results);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message, stack: err.stack });
    }
});

app.get('/api/debug-collections', async (req, res) => {
    try {
        const User = require('./models/User');
        const RegisteredCandidate = require('./models/RegisteredCandidate');
        const Job = require('./models/Job');
        const PlacedStudent = require('./models/PlacedStudent');

        const counts = {
            users: await User.countDocuments(),
            candidates: await RegisteredCandidate.countDocuments(),
            jobs: await Job.countDocuments(),
            placedStudents: await PlacedStudent.countDocuments()
        };
        res.json({ success: true, counts, dbState: mongoose.connection.readyState });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// --- Database Connection Guards (Must be before routes) ---
const CURRENT_COMMIT = "3bb9123-STABILIZE-V2"; // Updated version tag

// MongoDB Connection with improved error handling for serverless
let isConnected = false;
let lastDbError = null;
let connectionPromise = null;

const connectDB = async () => {
    if (isConnected) return;
    if (connectionPromise) return connectionPromise;

    try {
        if (!process.env.MONGO_URI) {
            const err = new Error('MONGO_URI is not defined in environment variables');
            console.error(err.message);
            lastDbError = err;
            return;
        }

        // Safety check for Vercel
        if (process.env.VERCEL && process.env.MONGO_URI.includes('localhost')) {
            const err = new Error('CRITICAL: MONGO_URI is set to localhost on Vercel.');
            console.error(err.message);
            lastDbError = err;
            return;
        }

        mongoose.set('bufferCommands', false);
        
        console.log('Attempting MongoDB connection...');
        connectionPromise = mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 20000,
            heartbeatFrequencyMS: 2000,
            family: 4 // Force IPv4 to resolve DNS issues on some Vercel regions
        });

        const conn = await connectionPromise;
        
        isConnected = true;
        lastDbError = null;
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (err) {
        lastDbError = err;
        connectionPromise = null; // Allow retry on next request
        console.error('MongoDB connection error details:', {
            name: err.name,
            message: err.message,
            code: err.code
        });
        throw err;
    }
};

// Database connectivity middleware
const databaseMiddleware = async (req, res, next) => {
    // Only apply to /api routes
    if (!req.url.startsWith('/api')) return next();
    
    // Skip health check to avoid recursion or blockages if needed
    if (req.url === '/api/health' || req.url === '/api/ping' || req.url === '/api/debug-dns') return next();

    if (mongoose.connection.readyState === 1) return next();

    try {
        await connectDB();
        next();
    } catch (err) {
        res.status(503).json({
            success: false,
            message: 'Database connection is currently unavailable. Please try again.',
            error: err.message
        });
    }
};

app.use(databaseMiddleware);
// ------------------------------------------------------------

// Routes
app.use('/api/registered-candidates', require('./routes/registeredCandidateRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/contacts', require('./routes/contactRoutes'));
app.use('/api/resumes', require('./routes/resumeRoutes'));
app.use('/api/placed-students', require('./routes/placedStudentRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.get('/api/upload/ping', (req, res) => res.json({ message: 'Upload service reachable' }));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/webhooks', require('./routes/webhookRoutes'));
app.use('/api/carousel', require('./routes/carouselRoutes'));
app.use('/api/stats', require('./routes/statRoutes'));

app.get('/api/health', (req, res) => {
    const dbState = mongoose.connection.readyState;
    const dbStatus = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting'
    };

    const status = (dbState === 1) ? 'ok' : 'pending';
    
    res.status(dbState === 1 ? 200 : 503).json({ 
        status, 
        message: dbState === 1 ? 'API and Database are healthy' : 'API is running but Database is not connected',
        dbError: lastDbError ? lastDbError.message : (dbState === 1 ? null : 'Still attempting connection...'),
        environment: process.env.NODE_ENV,
        dbState: dbStatus[dbState] || 'unknown',
        hasUri: !!process.env.MONGO_URI,
        currentCommit: CURRENT_COMMIT,
        timestamp: new Date().toISOString()
    });
});

app.get('/', (req, res) => {
    res.json({ 
        message: 'RCS Placements Backend API is active',
        healthCheck: '/api/health',
        dbStatus: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
        dbError: lastDbError ? lastDbError.message : null,
        timestamp: new Date().toISOString()
    });
});

app.get('/api/test', (req, res) => {
    res.json({ 
        message: 'Hello from Backend!',
        dbStatus: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
    });
});

// 404 Handler for undefined routes
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.originalUrl}`
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('SERVER ERROR:', err);
    res.status(req.res.statusCode === 200 ? 500 : req.res.statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// Port configuration
const PORT = process.env.PORT || 5000;

// Initial connection attempt (background)
connectDB().catch(() => {});

// Handle server listener - skip if on Vercel
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log('Build Trigger: Deployment config synchronization complete.');
    });
}

// Export for Vercel
module.exports = app;

// Force nodemon restart
