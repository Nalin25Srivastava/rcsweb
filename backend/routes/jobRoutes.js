const express = require('express');
const router = express.Router();
const { getJobs, createJob, updateJob, deleteJob } = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(getJobs)
    .post(protect, createJob);

router.route('/:id')
    .put(protect, updateJob)
    .delete(protect, deleteJob);

module.exports = router;
