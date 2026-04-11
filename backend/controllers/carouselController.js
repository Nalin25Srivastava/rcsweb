const CarouselSlide = require('../models/CarouselSlide');

// @desc    Get all carousel slides
// @route   GET /api/carousel
// @access  Public
const getSlides = async (req, res) => {
    try {
        const slides = await CarouselSlide.find().sort({ order: 1 });
        res.status(200).json(slides);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a carousel slide
// @route   POST /api/carousel
// @access  Private/Admin
const createSlide = async (req, res) => {
    const { url, title, subtitle, order } = req.body;

    if (!url || !title) {
        return res.status(400).json({ message: 'Please add required fields' });
    }

    try {
        const slide = await CarouselSlide.create({ url, title, subtitle, order });
        res.status(201).json(slide);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getSlides,
    createSlide
};
