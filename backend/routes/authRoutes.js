const express = require('express');
const router = express.Router();
const { registerUser, loginUser, googleLogin, getUsers } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleLogin);
router.get('/users', protect, admin, getUsers);

module.exports = router;
