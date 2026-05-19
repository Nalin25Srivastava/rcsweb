const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a job title'],
        trim: true
    },
    companyName: {
        type: String,
        trim: true
    },
    hiringFor: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        required: [true, 'Please add a contact email'],
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    location: {
        type: String,
        trim: true
    },
    salary: {
        type: String,
        trim: true
    },
    qualification: {
        type: String,
        trim: true
    },
    ageLimit: {
        type: String,
        trim: true
    },
    gender: {
        type: String,
        trim: true
    },
    dutyTime: {
        type: String,
        trim: true
    },
    profiles: [String],
    contactNumbers: [String],
    // New Structured Data Field
    job_posting: {
        type: Object,
        default: null
    },
    // Timer & Notification Fields
    timerActive: {
        type: Boolean,
        default: false
    },
    durationMinutes: {
        type: Number,
        default: 0
    },
    expiresAt: {
        type: Date,
        default: null
    },
    notificationSent: {
        type: Boolean,
        default: false
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Job', jobSchema);
