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

// @desc    Update a carousel slide
// @route   PUT /api/carousel/:id
// @access  Private/Admin
const updateSlide = async (req, res) => {
    try {
        const slide = await CarouselSlide.findById(req.params.id);
        if (!slide) {
            return res.status(404).json({ message: 'Slide not found' });
        }
        
        const updatedSlide = await CarouselSlide.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        res.status(200).json(updatedSlide);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a carousel slide
// @route   DELETE /api/carousel/:id
// @access  Private/Admin
const deleteSlide = async (req, res) => {
    try {
        const slide = await CarouselSlide.findById(req.params.id);
        if (!slide) {
            return res.status(404).json({ message: 'Slide not found' });
        }
        await slide.deleteOne();
        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getSlides,
    createSlide,
    updateSlide,
    deleteSlide
};
