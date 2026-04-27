const Resume = require('../models/Resume');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Razorpay = require('razorpay');

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_your_key_id',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'your_key_secret'
});

// Configure multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isVercel = process.env.VERCEL === '1' || !!process.env.VERCEL;
        const dir = isVercel ? '/tmp/uploads/resumes' : path.join(__dirname, '..', 'uploads', 'resumes');
        
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
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
    }
}).single('resume');

// @desc    Submit a resume & Create Razorpay Order
// @route   POST /api/resumes
// @access  Public
exports.submitResume = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a resume file' });
        }

        const { firstName, lastName, email, phone, functionalArea, amount } = req.body;
        const registrationFee = amount || 1000;

        try {
            // Use a web-relative path that matches our static serving route
            const normalizedPath = `/uploads/resumes/${req.file.filename}`;

            // 1. Create Pending Resume in DB
            const resume = await Resume.create({
                firstName,
                lastName,
                email,
                phone,
                functionalArea,
                resumePath: normalizedPath,
                originalName: req.file.originalname,
                fileMimetype: req.file.mimetype,
                amount: registrationFee,
                paymentStatus: 'Pending',
                user: req.user._id // Link registration to logged-in user
            });

            // Update user's registration status if they have an account
            const User = require('../models/User'); // Local require to avoid circular dependencies if any
            await User.findOneAndUpdate({ email }, { isPaid: true });

            // 2. Generate Razorpay Order
            const options = {
                amount: registrationFee * 100, // Razorpay works in paise
                currency: 'INR',
                receipt: `receipt_resume_${resume._id}`
            };

            const order = await razorpay.orders.create(options);

            // 3. Attach Order ID to Resume
            resume.razorpayOrderId = order.id;
            await resume.save();

            // 4. Return Order Details to Frontend
            res.status(201).json({
                success: true,
                message: 'Resume uploaded, pending payment.',
                data: resume,
                order
            });

        } catch (error) {
            // Rollback uploaded file if DB/Razorpay fails
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            res.status(500).json({ 
                message: error.description || error.message || 'Payment provider error',
                details: error
            });
        }
    });
};
