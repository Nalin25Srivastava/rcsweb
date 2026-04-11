const express = require('express');
const router = express.Router();
const { getStats, createStat } = require('../controllers/statController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getStats)
    .post(protect, admin, createStat);

module.exports = router;
