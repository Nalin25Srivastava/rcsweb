const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Please add a first name'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Please add a last name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    phone: {
        type: String,
        required: [true, 'Please add a phone number']
    },
    functionalArea: {
        type: String,
        required: [true, 'Please select a functional area']
    },
    resumePath: {
        type: String,
        required: [true, 'Please upload a resume']
    },
    originalName: {
        type: String,
        required: true
    },
    fileMimetype: {
        type: String,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed'],
        default: 'Pending'
    },
    amount: {
        type: Number,
        default: 1000
    },
    transactionId: {
        type: String,
        required: false
    },
    razorpayOrderId: {
        type: String,
        required: false
    },
    razorpayPaymentId: {
        type: String,
        required: false
    },
    razorpaySignature: {
        type: String,
        required: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Optional for backward compatibility, but we will enforce it in the controller
    }
}, {
    timestamps: true
});


module.exports = mongoose.model('Resume', resumeSchema);
