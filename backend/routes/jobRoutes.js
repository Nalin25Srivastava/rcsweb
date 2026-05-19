const express = require('express');
const router = express.Router();
const { getJobs, createJob, updateJob, deleteJob, restartJobTimer, extendJobTimer, endJobTimer } = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(getJobs)
    .post(protect, createJob);

router.route('/:id')
    .put(protect, updateJob)
    .delete(protect, deleteJob);

// Timer management endpoints
router.post('/:id/timer/restart', protect, restartJobTimer);
router.post('/:id/timer/extend', protect, extendJobTimer);
router.post('/:id/timer/end', protect, endJobTimer);

module.exports = router;
