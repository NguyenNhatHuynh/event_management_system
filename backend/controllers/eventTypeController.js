// backend/controllers/eventTypeController.js
const EventType = require('../models/EventType');

exports.getEventTypes = async (req, res) => {
    try {
        const eventTypes = await EventType.find();
        res.json(eventTypes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createEventType = async (req, res) => {
    try {
        const eventType = new EventType(req.body);
        await eventType.save();
        res.status(201).json(eventType);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateEventType = async (req, res) => {
    try {
        const eventType = await EventType.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(eventType);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteEventType = async (req, res) => {
    try {
        await EventType.findByIdAndDelete(req.params.id);
        res.json({ message: 'EventType deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};