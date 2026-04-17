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
    verify: (req, res, buf) => {
        req.rawBody = buf;
    }
}));

// Routes
app.use('/api/services', require('./routes/serviceRoutes'));
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
const uploadDir = path.join(__dirname, 'uploads/images');
// Only try to create directory if NOT on Vercel (read-only filesystem)
if (!process.env.VERCEL) {
    const dirs = [
        path.join(__dirname, 'uploads/images'),
        path.join(__dirname, 'uploads/resumes')
    ];
    
    dirs.forEach(dir => {
        if (!fs.existsSync(dir)) {
            try {
                fs.mkdirSync(dir, { recursive: true });
                console.log(`Created ${path.relative(__dirname, dir)} directory`);
            } catch (err) {
                console.error(`Error creating directory ${dir}:`, err);
            }
        }
    });
}
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'API is running...',
        environment: process.env.NODE_ENV,
        dbConnected: mongoose.connection.readyState === 1
    });
});

app.get('/', (req, res) => {
    res.json({ 
        message: 'RCS Placements Backend API is active',
        healthCheck: '/api/health',
        timestamp: new Date().toISOString()
    });
});

app.get('/api/test', (req, res) => {
    res.json({ message: 'Hello from Backend!' });
});

// 404 Handler for undefined routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.originalUrl}`,
        availableRoutes: ['/', '/api/health', '/api/test']
    });
});

// Port configuration
const PORT = process.env.PORT || 5000;

// MongoDB Connection with improved error handling for serverless
const connectDB = async () => {
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

        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('MongoDB connection error:', err);
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
