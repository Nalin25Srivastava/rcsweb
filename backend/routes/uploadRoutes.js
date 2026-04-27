const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isVercel = process.env.VERCEL === '1' || !!process.env.VERCEL;
        // Use a more general directory for all types
        const dir = isVercel ? '/tmp/uploads/media' : path.join(__dirname, '..', 'uploads', 'media');
        
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        // Clean filename and add timestamp
        const cleanName = file.originalname.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.\-]/g, '');
        cb(null, `${Date.now()}-${cleanName}`);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        // Allow images, videos, and common documents
        const filetypes = /jpeg|jpg|png|webp|gif|svg|mp4|webm|ogg|pdf|doc|docx|txt|xls|xlsx|ppt|pptx|zip|rar/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (extname || mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('File format not supported! Please upload images, videos, or documents.'));
        }
    },
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit for videos
});

// @desc    Upload an image/media
// @route   POST /api/upload/image
// @access  Private (Admin)
router.post('/image', protect, admin, (req, res) => {
    
    upload.single('image')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ message: `Multer upload error: ${err.message}` });
        } else if (err) {
            return res.status(500).json({ message: `Upload error: ${err.message}` });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a file' });
        }

        // Normalize path to use a web-relative path that matches our static serving route
        const fileUrl = `/uploads/media/${req.file.filename}`;

        res.status(200).json({
            success: true,
            message: 'File uploaded successfully',
            url: fileUrl,
            filename: req.file.filename
        });
    });
});

module.exports = router;
