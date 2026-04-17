const express = require('express');
const router = express.Router();
const { getStats, createStat, deleteStat } = require('../controllers/statController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getStats)
    .post(protect, admin, createStat);

router.route('/:id')
    .delete(protect, admin, deleteStat);

module.exports = router;
