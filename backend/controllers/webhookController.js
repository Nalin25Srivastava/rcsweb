const crypto = require('node:crypto');
const Resume = require('../models/Resume');
const { sendNotification } = require('../utils/notificationService');

// @desc    Handle Razorpay Webhooks
// @route   POST /api/webhooks/razorpay
// @access  Public
exports.handleRazorpayWebhook = async (req, res) => {
    try {
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET;
        const razorpaySignature = req.headers['x-razorpay-signature'];

        if (!razorpaySignature || !req.rawBody) {
            return res.status(400).send('Missing signature or raw body');
        }

        // Validate webhook signature
        const expectedSignature = crypto
            .createHmac('sha256', webhookSecret)
            .update(req.rawBody)
            .digest('hex');

        if (expectedSignature !== razorpaySignature) {
            console.error('Webhook signature verification failed');
            return res.status(400).send('Invalid signature');
        }

        const event = req.body.event;
        const payload = req.body.payload;

        // We are typically interested in payment.captured or order.paid
        if (event === 'payment.captured' || event === 'order.paid') {
            const paymentEntity = payload.payment.entity;
            const orderId = paymentEntity.order_id;
            const paymentId = paymentEntity.id;

            if (orderId) {
                // Find corresponding Resume (Registration) by order id
                const resume = await Resume.findOne({ razorpayOrderId: orderId });
                const User = require('../models/User');
                const user = await User.findOne({ razorpayOrderId: orderId });

                if (resume && resume.paymentStatus !== 'Completed') {
                    resume.paymentStatus = 'Completed';
                    resume.razorpayPaymentId = paymentId;
                    await resume.save();
                    console.log(`[Webhook] Payment verified and Resume ${resume._id} updated to Completed.`);
                    try {
                        await sendNotification(resume);
                    } catch (notifyErr) {
                        console.error('Notification failed during webhook processing:', notifyErr.message);
                    }
                } else if (user && !user.isPaid) {
                    user.isPaid = true;
                    await user.save();
                    console.log(`[Webhook] Payment verified and User ${user.email} marked as Paid.`);
                } else if (!resume && !user) {
                    console.warn(`[Webhook] Order ID ${orderId} received but no matching Resume or User found.`);
                }
            }
        }

        // Always return 200 OK so Razorpay knows the event was successfully processed
        res.status(200).json({ status: 'ok' });

    } catch (error) {
        console.error('Webhook Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
