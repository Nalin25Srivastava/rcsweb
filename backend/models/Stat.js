const mongoose = require('mongoose');

const statSchema = new mongoose.Schema({
    id: {
        type: String,
        required: false
    },
    value: {
        type: String,
        required: [true, 'Please add a value (e.g., 5000+)']
    },
    label: {
        type: String,
        required: [true, 'Please add a label (e.g., Placements)']
    },
    iconName: {
        type: String,
        required: [true, 'Please add a Lucide icon name or identifier']
    },
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Stat', statSchema);
