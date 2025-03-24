const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Event = require('../models/Event');
const Blog = require('../models/Blog');
const Booking = require('../models/Booking');
const EventType = require('../models/EventType');

router.get('/stats', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalEvents = await Event.countDocuments();
        const totalBlogs = await Blog.countDocuments();
        const totalBookings = await Booking.countDocuments();

        const eventTypes = await EventType.find();
        const eventStats = await Promise.all(
            eventTypes.map(async (type) => {
                const count = await Event.countDocuments({ eventType: type.name });
                return { name: type.name, count };
            })
        );

        res.json({
            totalUsers,
            totalEvents,
            totalBlogs,
            totalBookings,
            eventStats,
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy dữ liệu dashboard', error: error.message });
    }
});

module.exports = router;