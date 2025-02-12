const express = require('express');
const router = express.Router();
const { Event } = require('../db/db');
const verifyToken = require('../middleware/verifyToken');

// Returns all events set to visible in the admin panel
// Does not require an authenticated user
router.get('/', async (req, res, next) => {
    try {
        const events = await Event.findAll({ where: { visible: true } });
        res.json(events);
    } catch (error) {
        res.json({ message: error.message });
    }
});

// Returns every event regardless of visibility for admins
router.get('/all', verifyToken, async (req, res, next) => {
    try {
        const events = await Event.findAll();
        res.json(events);
    } catch (error) {
        res.json({ message: error.message });
    }
});

module.exports = router;