const express = require('express');
const router = express.Router();
const { submitContact, downloadContactsExcel } = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', submitContact);
router.get('/download', protect, downloadContactsExcel);

module.exports = router;
