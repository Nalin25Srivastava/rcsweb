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
        const dir = isVercel ? '/tmp/uploads/images' : path.join(__dirname, '..', 'uploads', 'images');
        
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, `img-${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Only images (JPEG, JPG, PNG, WEBP, GIF) are allowed!'));
        }
    },
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// @desc    Upload an image
// @route   POST /api/upload/image
// @access  Private (Admin)
router.post('/image', protect, admin, (req, res) => {
    console.log('Incoming upload request from:', req.user.email);
    
    upload.single('image')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            console.error('Multer error:', err);
            return res.status(400).json({ message: `Multer upload error: ${err.message}` });
        } else if (err) {
            console.error('General upload error:', err);
            return res.status(500).json({ message: `Upload error: ${err.message}` });
        }

        if (!req.file) {
            console.warn('No file received in request');
            return res.status(400).json({ message: 'Please upload an image file' });
        }

        console.log('File successfully received:', req.file.filename);

        // Normalize path to use a web-relative path that matches our static serving route
        const imageUrl = `/uploads/images/${req.file.filename}`;

        res.status(200).json({
            success: true,
            message: 'Image uploaded successfully',
            url: imageUrl,
            filename: req.file.filename
        });
    });
});

module.exports = router;
