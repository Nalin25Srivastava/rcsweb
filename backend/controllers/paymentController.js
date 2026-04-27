const Razorpay = require('razorpay');
const crypto = require('node:crypto');
const dotenv = require('dotenv');

dotenv.config();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_your_key_id',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'your_key_secret'
});

// @desc    Create a Razorpay order
// @route   POST /api/payments/order
// @access  Public
exports.createOrder = async (req, res) => {
    const { amount, currency = 'INR' } = req.body;

    if (!amount) {
        return res.status(400).json({ message: 'Amount is required' });
    }

    try {
        const options = {
            amount: amount * 100, // Razorpay works in paise
            currency,
            receipt: `receipt_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);
        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        console.error('Razorpay Order Error:', error);
        const errorMessage = error.error?.description || error.description || error.message || 'Failed to create Razorpay order';
        res.status(500).json({ 
            success: false, 
            message: errorMessage,
            details: error 
        });
    }
};

// @desc    Verify Razorpay payment signature
// @route   POST /api/payments/verify
// @access  Public
exports.verifyPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'your_key_secret');
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest('hex');

    if (digest === razorpay_signature) {
        // Update user's isPaid status if this was a registration payment
        const User = require('../models/User');
        try {
            const user = await User.findOne({ razorpayOrderId: razorpay_order_id });
            if (user) {
                user.isPaid = true;
                await user.save();
                console.log(`User ${user.email} marked as paid.`);
            }
        } catch (dbErr) {
            console.error('Error updating user payment status:', dbErr);
        }

        res.status(200).json({
            success: true,
            message: 'Payment verified successfully'
        });
    } else {
        res.status(400).json({
            success: false,
            message: 'Invalid signature'
        });
    }
};
