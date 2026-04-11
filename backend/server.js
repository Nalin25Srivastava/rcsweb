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
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('Created uploads/images directory');
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

app.get('/api/test', (req, res) => {
    res.json({ message: 'Hello from Backend!' });
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
    });
}

// Export for Vercel
module.exports = app;

// Force nodemon restart
