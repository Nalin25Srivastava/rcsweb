const express = require('express');
const router = express.Router();
const { getStats, createStat, updateStat, deleteStat } = require('../controllers/statController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getStats)
    .post(protect, admin, createStat);

router.route('/:id')
    .put(protect, admin, updateStat)
    .delete(protect, admin, deleteStat);

module.exports = router;
