// backend/controllers/eventController.js
const Event = require('../models/Event');
const EventType = require('../models/EventType');

exports.getEvents = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const typeCode = req.query.typeCode || null;
        const skip = (page - 1) * limit;

        let query = {};

        // Nếu có typeCode, tìm EventType tương ứng để lấy _id
        if (typeCode) {
            const eventType = await EventType.findOne({ typeCode });
            if (!eventType) {
                return res.json({
                    events: [],
                    currentPage: page,
                    totalPages: 0,
                    totalEvents: 0,
                });
            }
            query.eventType = eventType._id; // Sử dụng _id của EventType để lọc
        }

        const events = await Event.find(query)
            .skip(skip)
            .limit(limit)
            .populate('eventType'); // Populate để lấy thông tin loại sự kiện

        const totalEvents = await Event.countDocuments(query);

        res.json({
            events,
            currentPage: page,
            totalPages: Math.ceil(totalEvents / limit),
            totalEvents,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Các hàm khác (nếu có) giữ nguyên
exports.createEvent = async (req, res) => {
    try {
        const event = new Event(req.body);
        await event.save();
        res.status(201).json(event);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(event);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.id);
        res.json({ message: 'Event deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};