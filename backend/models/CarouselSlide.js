const mongoose = require('mongoose');

const carouselSlideSchema = new mongoose.Schema({
    url: {
        type: String,
        required: [true, 'Please add an image URL']
    },
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true
    },
    subtitle: {
        type: String,
        trim: true
    },
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('CarouselSlide', carouselSlideSchema);
