const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

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



// Serve uploads folder
const path = require('path');
const fs = require('fs');

// Vercel read-only filesystem workaround: use /tmp in production
const isVercel = process.env.VERCEL === '1' || !!process.env.VERCEL;
const UPLOAD_BASE = isVercel ? '/tmp/uploads' : path.join(__dirname, 'uploads');

const dirs = [
    path.join(UPLOAD_BASE, 'images'),
    path.join(UPLOAD_BASE, 'resumes')
];

dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        try {
            fs.mkdirSync(dir, { recursive: true });
            console.log(`Created directory: ${dir}`);
        } catch (err) {
            console.error(`Error creating directory ${dir}:`, err);
        }
    }
});

// Serve static files from the standard uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Additionally serve from /tmp on Vercel
if (isVercel) {
    app.use('/uploads', express.static('/tmp/uploads'));
}


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
        environment: process.env.NODE_ENV,
        dbState: dbStatus[dbState] || 'unknown',
        hasUri: !!process.env.MONGO_URI
    });
});

app.get('/', (req, res) => {
    res.json({ 
        message: 'RCS Placements Backend API is active',
        healthCheck: '/api/health',
        dbStatus: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
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

// MongoDB Connection with improved error handling for serverless
let isConnected = false;
const connectDB = async () => {
    if (isConnected) return;

    try {
        if (!process.env.MONGO_URI) {
            console.error('MONGO_URI is not defined in environment variables');
            return;
        }

        // Safety check for Vercel
        if (process.env.VERCEL && process.env.MONGO_URI.includes('localhost')) {
            console.error('CRITICAL: MONGO_URI is set to localhost on Vercel. Please set a remote MongoDB URI in the Vercel Dashboard.');
            return;
        }

        mongoose.set('bufferCommands', false);
        
        console.log('Attempting MongoDB connection...');
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 8000, // Timeout after 8 seconds
            heartbeatFrequencyMS: 2000
        });
        
        isConnected = true;
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error('MongoDB connection error details:', {
            name: err.name,
            message: err.message,
            code: err.code
        });
    }
};

// Initial connection
connectDB();

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
