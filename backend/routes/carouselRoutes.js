const express = require('express');
const router = express.Router();
const { getSlides, createSlide } = require('../controllers/carouselController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getSlides)
    .post(protect, admin, createSlide);

module.exports = router;
