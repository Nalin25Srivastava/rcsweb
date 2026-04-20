const mongoose = require('mongoose');

const registeredStudentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    course: {
        type: String,
        required: true
    },
    batch: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Active', 'Completed', 'Dropped'],
        default: 'Active'
    },
    registrationDate: {
        type: Date,
        default: Date.now
    },
    image: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('RegisteredStudent', registeredStudentSchema);
