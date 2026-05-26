const Resume = require('../models/Resume');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
// Removed Razorpay Initialization as we use manual UPI Verification

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
        if (file.fieldname === 'resume') {
            const filetypes = /pdf|doc|docx|txt|rtf/;
            const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
            const mimetype = filetypes.test(file.mimetype);
            if (extname || mimetype) {
                return cb(null, true);
            }
            cb(new Error('Invalid file type! Please upload a valid resume document (PDF, DOC, DOCX, TXT, RTF).'));
        } else if (file.fieldname === 'paymentReceipt') {
            const filetypes = /jpeg|jpg|png|webp|pdf/;
            const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
            const mimetype = filetypes.test(file.mimetype);
            if (extname || mimetype) {
                return cb(null, true);
            }
            cb(new Error('Invalid file type! Please upload a valid payment receipt image (JPG, PNG, WEBP, PDF).'));
        } else {
            cb(new Error('Unexpected field'));
        }
    }
}).fields([
    { name: 'resume', maxCount: 1 },
    { name: 'paymentReceipt', maxCount: 1 }
]);

// @desc    Submit a resume & Create Razorpay Order
// @route   POST /api/resumes
// @access  Public
exports.submitResume = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }

        if (!req.files || !req.files['resume']) {
            return res.status(400).json({ message: 'Please upload a resume file' });
        }
        if (!req.files['paymentReceipt']) {
            return res.status(400).json({ message: 'Please upload your payment receipt' });
        }

        const { firstName, lastName, email, phone, functionalArea, amount, transactionId } = req.body;
        const registrationFee = amount || 1000;

        if (!transactionId) {
            return res.status(400).json({ message: 'Please provide the UPI Transaction ID' });
        }

        try {
            const resumeFile = req.files['resume'][0];
            const receiptFile = req.files['paymentReceipt'][0];

            const resumePath = `/uploads/resumes/${resumeFile.filename}`;
            const receiptPath = `/uploads/resumes/${receiptFile.filename}`;

            // 1. Create Pending Verification Resume in DB
            const resume = await Resume.create({
                firstName,
                lastName,
                email,
                phone,
                functionalArea,
                resumePath: resumePath,
                paymentReceiptPath: receiptPath,
                originalName: resumeFile.originalname,
                fileMimetype: resumeFile.mimetype,
                amount: registrationFee,
                paymentStatus: 'Pending Verification',
                transactionId: transactionId,
                user: req.user?._id
            });

            // 2. Return Details to Frontend
            res.status(201).json({
                success: true,
                message: 'Registration submitted successfully. Pending manual payment verification.',
                data: resume
            });

        } catch (error) {
            console.error('Submit Resume Error:', error);
            // Rollback uploaded files if DB fails
            if (req.files) {
                Object.values(req.files).forEach(fileArray => {
                    fileArray.forEach(file => {
                        try { fs.unlinkSync(file.path); } catch (e) {}
                    });
                });
            }
            res.status(500).json({ 
                message: error.message || 'Server error during submission',
                details: error
            });
        }
    });
};
