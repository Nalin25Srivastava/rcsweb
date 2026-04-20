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
    compensation: {
        type: String,
        required: [true, 'Please add a package/compensation value']
    },
    placedDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for legacy 'package' field support
placedStudentSchema.virtual('package').get(function() {
    return this.compensation;
}).set(function(v) {
    this.compensation = v;
});

module.exports = mongoose.models.PlacedStudent || mongoose.model('PlacedStudent', placedStudentSchema);
