const mongoose = require('mongoose');

const placedStudentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    company: {
        type: String,
        required: [true, 'Please add a company name']
    },
    position: {
        type: String,
        required: [true, 'Please add a position']
    },
    image: {
        type: String,
        default: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&q=80&w=200'
    },
    package: {
        type: String,
        required: [true, 'Please add a package/CTC']
    },
    placedDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('PlacedStudent', placedStudentSchema);
