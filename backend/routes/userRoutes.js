const express = require('express');
const router = express.Router();
const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const { protect } = require('../middleware/authMiddleware')

// @desc Register new user
// @route POST /api/users/register
// @access Public
router.post('/register', asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // Checks to see if all fields are present
    if ( !name || !email || !password ) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    // Checks to see if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // Create a new user
    const user = await User.create({
        name,
        email,
        password
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: user.getSignedJwtToken()
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
}));

// @desc Authenticate user & get token
// @route POST /api/users/login
// @access Public
router.post('/login', asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Checks to see if all fields are present
    if ( !email || !password ) {
        res.status(400);
        throw new Error('Please add email and password');
    }

    const user = await User.findOne({ email });

    // Checks to see if passwords match
    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: user.getSignedJwtToken()
        });
    } else {
        res.status(401);
        throw new Error('Invalid credentials');
    }
}));

// @desc Get user profile
// @route GET /api/users/profile
// @access Private
router.get('/profile', protect, asyncHandler(async (req, res) => {
    res.json({
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email
    });
}));

module.exports = router;