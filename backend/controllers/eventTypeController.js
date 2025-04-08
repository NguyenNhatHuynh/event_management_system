const EventType = require('../models/EventType');

exports.getEventTypes = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const totalEventTypes = await EventType.countDocuments();
        const eventTypes = await EventType.find()
            .skip(skip)
            .limit(limit);

        res.json({
            eventTypes,
            currentPage: page,
            totalPages: Math.ceil(totalEventTypes / limit),
            totalEventTypes
        });
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
        if (!eventType) {
            return res.status(404).json({ message: 'Loại sự kiện không tồn tại' });
        }
        res.json(eventType);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteEventType = async (req, res) => {
    try {
        const eventType = await EventType.findByIdAndDelete(req.params.id);
        if (!eventType) {
            return res.status(404).json({ message: 'Loại sự kiện không tồn tại' });
        }
        res.json({ message: 'Xóa loại sự kiện thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = exports;