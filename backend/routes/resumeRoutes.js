const express = require('express');
const router = express.Router();
const { submitResume } = require('../controllers/resumeController');

router.post('/', submitResume);

module.exports = router;
