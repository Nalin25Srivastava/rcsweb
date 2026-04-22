const User = require('../models/User');
const Resume = require('../models/Resume');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_your_key_id',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'your_key_secret'
});

const VIP_EMAILS = ['hitkarikusum.ngo@gmail.com', 'khmbvs26@gmail.com', 'hitkarikusu.org@gmail.com'];
const isVIP = (email) => email && VIP_EMAILS.includes(email.trim().toLowerCase());

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    let { name, email, password, role, adminSecret } = req.body;
    if (email) email = email.trim();

    try {
        if (role === 'admin' && adminSecret !== 'rcsplacements2009' && !isVIP(email)) {
            return res.status(401).json({ message: 'Invalid admin secret code' });
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            if (role === 'admin' && userExists.role !== 'admin' && !isVIP(email)) {
                return res.status(403).json({ message: 'You are a standard user and cannot access the admin panel.' });
            }
            if (role === 'user' && userExists.role === 'admin' && !isVIP(email)) {
                return res.status(400).json({ message: 'Admins must login using the Admin account type.' });
            }
            return res.status(400).json({ message: 'User already exists' });
        }
        const resumeExists = await Resume.findOne({ email });

        const user = await User.create({
            name,
            email,
            password,
            role: (role === 'admin' || isVIP(email)) ? 'admin' : 'user',
            isPaid: isVIP(email) || (role === 'admin' ? true : (resumeExists ? true : false))
        });

        if (user) {
            return res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isPaid: user.role === 'admin' ? true : user.isPaid,
                token: generateToken(user._id)
            });
        } else {
            return res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    let { email, password, role, adminSecret } = req.body;
    if (email) email = email.trim();

    try {
        if (role === 'admin' && adminSecret !== 'rcsplacements2009' && !isVIP(email)) {
            return res.status(401).json({ message: 'Invalid admin secret code' });
        }

        const user = await User.findOne({ email }).select('+password');

        if (user && role === 'admin' && user.role !== 'admin' && !isVIP(email)) {
            return res.status(403).json({ message: 'You are a standard user and cannot access the admin panel.' });
        }

        if (user && role === 'user' && user.role === 'admin' && !isVIP(email)) {
            return res.status(403).json({ message: 'Admins must login using the Admin account type.' });
        }

        if (user && (await user.matchPassword(password))) {
            // Auto-grant isPaid status for VIP email if not set
            if (isVIP(email) && (!user.isPaid || user.role !== 'admin')) {
                user.isPaid = true;
                user.role = 'admin';
                await user.save();
            }

            // Block login for unpaid standard users
            return res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: isVIP(email) ? (role || user.role || 'admin') : user.role,
                isPaid: (user.role === 'admin' || isVIP(email)) ? true : user.isPaid,
                message: 'Login successful',
                token: generateToken(user._id)
            });
        } else {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const axios = require('axios');

// @desc    Google login
// @route   POST /api/auth/google
// @access  Public
const googleLogin = async (req, res) => {
    const { token, role, adminSecret, isAccessToken } = req.body;

    try {
        let name, email, googleId;

        if (isAccessToken) {
            // Fetch user info from Google using the access token
            const response = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`);
            const data = response.data;
            name = data.name;
            email = data.email;
            googleId = data.sub;
        } else {
            // Standard ID Token verification
            if (!process.env.GOOGLE_CLIENT_ID) {
                return res.status(500).json({ message: 'Google Client ID missing' });
            }

            const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID
            });

            const payload = ticket.getPayload();
            name = payload.name;
            email = payload.email;
            googleId = payload.sub;
        }

        if (role === 'admin' && adminSecret !== 'rcsplacements2009' && !isVIP(email)) {
            return res.status(401).json({ message: 'Invalid admin secret code' });
        }

        let user = await User.findOne({ email });

        if (user) {
            if (!user.googleId) {
                user.googleId = googleId;
                await user.save();
            }
            if (role === 'admin' && user.role !== 'admin' && !isVIP(email)) {
                return res.status(403).json({ message: 'You are a standard user and cannot access the admin panel.' });
            }

            if (role === 'user' && user.role === 'admin' && !isVIP(email)) {
                return res.status(403).json({ message: 'Admins must login using the Admin account type.' });
            }
        } else {
            const resumeExists = await Resume.findOne({ email });
            isNewUser = true;
            user = await User.create({
                name,
                email,
                googleId,
                role: (role === 'admin' || isVIP(email)) ? 'admin' : 'user',
                isPaid: isVIP(email) || (role === 'admin' ? true : (resumeExists ? true : false))
            });
        }

        return res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: isVIP(email) ? (role || user.role || 'admin') : user.role,
            isPaid: (user.role === 'admin' || isVIP(email)) ? true : user.isPaid,
            message: 'Login successful',
            token: generateToken(user._id)
        });
    } catch (error) {
        return res.status(400).json({ message: 'Google authentication failed' });
    }
};

// @desc    Get all users (candidates)
// @route   GET /api/auth/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    try {
        const users = await User.aggregate([
            { $match: { role: 'user' } },
            {
                $lookup: {
                    from: 'resumes',
                    localField: '_id',
                    foreignField: 'user',
                    as: 'resume'
                }
            },
            {
                $addFields: {
                    resume: { $arrayElemAt: ['$resume', 0] }
                }
            },
            {
                $project: {
                    password: 0
                }
            }
        ]);
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

module.exports = {
    registerUser,
    loginUser,
    googleLogin,
    getUsers
};
