const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Event = require('../models/Event');
const Blog = require('../models/Blog');
const Booking = require('../models/Booking');
const EventType = require('../models/EventType');

router.get('/stats', async (req, res) => {
    try {
        // Tổng số người dùng, sự kiện, blog, và đặt lịch
        const totalUsers = await User.countDocuments();
        const totalEvents = await Event.countDocuments();
        const totalBlogs = await Blog.countDocuments();
        const totalBookings = await Booking.countDocuments();

        // Số lượng người dùng theo vai trò
        const usersByRole = await User.aggregate([
            { $group: { _id: '$role', count: { $sum: 1 } } },
        ]);

        // Số lượng sự kiện theo loại sự kiện
        const eventTypes = await EventType.find();
        const eventStats = await Promise.all(
            eventTypes.map(async (type) => {
                const count = await Event.countDocuments({ eventType: type.name });
                return { name: type.name, count };
            })
        );

        // Số lượng yêu cầu đặt lịch theo tháng (12 tháng gần nhất)
        const bookingStats = await Booking.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)), // Lấy dữ liệu 12 tháng gần nhất
                    },
                },
            },
            {
                $group: {
                    _id: { $month: '$createdAt' },
                    count: { $sum: 1 },
                },
            },
            {
                $sort: { '_id': 1 },
            },
        ]);

        // Tạo mảng 12 tháng với số lượng đặt lịch (nếu không có dữ liệu thì là 0)
        const months = Array.from({ length: 12 }, (_, i) => i + 1); // [1, 2, ..., 12]
        const bookingStatsByMonth = months.map((month) => {
            const stat = bookingStats.find((s) => s._id === month);
            return stat ? stat.count : 0;
        });

        res.json({
            totalUsers,
            totalEvents,
            totalBlogs,
            totalBookings,
            usersByRole: usersByRole.map((role) => ({ role: role._id, count: role.count })), // Định dạng lại dữ liệu
            eventStats,
            bookingStats: {
                labels: months.map((month) => `Tháng ${month}`),
                data: bookingStatsByMonth,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy dữ liệu thống kê', error: error.message });
    }
});

module.exports = router;