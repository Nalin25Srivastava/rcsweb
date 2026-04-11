const express = require('express');
const router = express.Router();
const { getServices, createService } = require('../controllers/serviceController');

router.route('/')
    .get(getServices)
    .post(createService);

module.exports = router;
