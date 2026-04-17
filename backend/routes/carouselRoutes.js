const express = require('express');
const router = express.Router();
const { getSlides, createSlide, deleteSlide } = require('../controllers/carouselController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getSlides)
    .post(protect, admin, createSlide);

router.route('/:id')
    .delete(protect, admin, deleteSlide);

module.exports = router;
