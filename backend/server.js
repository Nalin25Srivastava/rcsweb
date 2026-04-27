const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dns = require('dns');
const net = require('net');
const path = require('path');

// Load environment variables from the same directory as server.js
dotenv.config({ path: path.join(__dirname, '.env') });

// Fix for MongoDB SRV lookup issues in some environments
dns.setServers(['8.8.8.8', '8.8.4.4']);

const app = express();

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Middleware

app.use(helmet());
// app.use(limiter);
const corsOptions = {
    origin: (origin, callback) => {
        // More permissive check for deployment debugging
        if (!origin || 
            origin.endsWith('.vercel.app') || 
            origin.includes('google.com') ||
            origin.includes('localhost') ||
            origin.includes('127.0.0.1')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json({
    limit: '50mb',
    verify: (req, res, buf) => {
        req.rawBody = buf;
    }
}));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Static Files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Diagnostic Routes
app.get('/api/ping', (req, res) => res.json({ 
  status: 'active', 
  time: new Date().toISOString(),
  env: process.env.NODE_ENV,
  isVercel: !!process.env.VERCEL
}));


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
        dbName: mongoose.connection.name || 'pending',
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
    });
}

// Export for Vercel
module.exports = app;

// Force nodemon restart
