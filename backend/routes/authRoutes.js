const express = require('express');
const router = express.Router();
const { registerUser, loginUser, googleLogin, getUsers, getProfile, updateProfile, getAdminAuditLogs } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleLogin);
router.get('/users', protect, admin, getUsers);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/audit-logs', protect, admin, getAdminAuditLogs);

module.exports = router;
