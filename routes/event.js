const express = require('express');
const router = express.Router();
const { Event } = require('../db/db');

// Returns the Event model with its default values for use when creating a new event
router.get('/template', (req, res, next) => {
    try {
        const event = Event.build({});

        res.json(Object.fromEntries(Object.entries(event.toJSON()).filter(([k, _]) => k !== 'id')));
    } catch (error) {
        res.json({ message: error.message });
    }
});

// Returns the specified event
router.get('/:id', async (req, res, next) => {
    const eventID = req.params.id;

    try {
        const event = await Event.findOne({ where: { id: eventID }});

        res.json(event);
    } catch (error) {
        res.json({ message: error.message });
    }
});

// Inserts a new event in the database
router.post('/', async (req, res, next) => {
    try {
        const event = await Event.create(req.body);
        console.log(event.id)
        res.json({ result: true, event: event, error: null });
    } catch (error) {
        res.json({ result: false, event: null, error: error.message });
    }
});

// Updates the event in the databse with the new data
router.put('/:id', async (req, res, next) => {
    const eventID = req.params.id;

    try {
        const event = await Event.findOne({ where: { id: eventID }});

        const data = req.body;

        delete data['id'];
        delete data['createdAt'];
        delete data['updatedAt'];
        
        event.set(data);
        await event.save();

        res.json({ result: true, event: event, error: null });
    } catch (error) {
        res.json({ result: false, event: null, error: error.message });
    }
});

// Deletes the specified event
router.delete('/:id', async (req, res, next) => {
    const eventID = req.params.id;

    try {
        const event = await Event.findOne({ where: { id: eventID }});

        await event.destroy();

        res.json(true);
    } catch (error) {
        res.json({ message: error.message });
    }
});

module.exports = router;