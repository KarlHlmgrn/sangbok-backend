const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../db/db');
const verifyToken = require('../middleware/verifyToken');
const express = require('express');
const router = express.Router();

// Logs a user in using http-only cookies
router.post('/login', async (req, res, next) => {
    const { username, password } = req.body;

    // Gets the user from the database
    const user = await User.findOne({ where: { username: username.toLowerCase() }});
    if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    // Checks the given password to the hashed one stored in the database
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Generates a token containing the user's ID using the JWT_SECRET in .env, expires in 1h
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    // The token is attached to a http only cookie, same site is set to strict to prevent XSS
    res.cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });

    return res.json({ success: true });
});

// Creates a new user, currently only intended for administrator use
// During testing verify token has been removed
router.post('/create', async (req, res, next) => {
    let { username, password } = req.body;

    // converts the username to lower case
    username = username.toLowerCase();

    // Checks if the username is valid and long enough
    if (!username.match(/^[a-z0-9]+(([_\.][a-z0-9]+)+)?$/) || username.length < 4) {
        return res.status(400).json({ success: false, message: 'Invalid username', invalidUsername: true });
    }

    // Checks if the password is at least 8 characters long
    if (password.length < 8) {
        return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long', shortPassword: true });
    }

    try {
        // Checks if there already is a user with the same username
        const existingUser = await User.findOne({ where: { username }});
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Username already exists' });
        }

        // Saves the user
        await User.create({ username, password });

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error creating user', error: error.message });
    }
});

// Logs the user out by clearing the access token cookie
router.post('/logout', (req, res) => {
    // Clear the cookie by setting an expired cookie value
    res.clearCookie('access_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });
    res.json({ success: true });
});

// Endpoint to check if the current access token is valid
router.get('/check', (req, res) => {
    const token = req.cookies.access_token;
    if (!token) {
        return res.json({ success: false });
    }

    // Verifies the token and send the result to the user
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.json({ success: false });
        }

        res.json({ success: true });
    });
});

module.exports = router;