const EventType = require('../models/EventType');

exports.getAllEventTypes = async (req, res) => {
    try {
        const eventTypes = await EventType.find();
        res.json(eventTypes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createEventType = async (req, res) => {
    const eventType = new EventType({
        typeCode: req.body.typeCode,
        name: req.body.name,
        description: req.body.description,
        basePrice: req.body.basePrice,
    });

    try {
        const newEventType = await eventType.save();
        res.status(201).json(newEventType);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};