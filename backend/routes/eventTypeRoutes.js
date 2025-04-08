const express = require('express');
const router = express.Router();
const EventType = require('../models/EventType');

// Public route: Get all event types (no auth required)
router.get('/public', async (req, res) => {
    try {
        const eventTypes = await EventType.find().select('name typeCode description');
        res.json(eventTypes); // Trả về mảng trực tiếp
    } catch (error) {
        res.status(500).json({
            message: 'Lỗi khi lấy danh sách loại sự kiện',
            error: error.message
        });
    }
});

// Admin routes below (protected)
// Get all event types with pagination (admin only)
router.get('/', async (req, res) => {
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
        res.status(500).json({
            message: 'Lỗi khi lấy danh sách loại sự kiện',
            error: error.message
        });
    }
});

// Create a new event type
router.post('/', async (req, res) => {
    try {
        const eventType = new EventType(req.body);
        await eventType.save();
        res.status(201).json(eventType);
    } catch (error) {
        res.status(400).json({ message: 'Lỗi khi tạo loại sự kiện', error: error.message });
    }
});

// Update an event type
router.put('/:id', async (req, res) => {
    try {
        const eventType = await EventType.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!eventType) {
            return res.status(404).json({ message: 'Loại sự kiện không tồn tại' });
        }
        res.json(eventType);
    } catch (error) {
        res.status(400).json({ message: 'Lỗi khi cập nhật loại sự kiện', error: error.message });
    }
});

// Delete an event type
router.delete('/:id', async (req, res) => {
    try {
        const eventType = await EventType.findByIdAndDelete(req.params.id);
        if (!eventType) {
            return res.status(404).json({ message: 'Loại sự kiện không tồn tại' });
        }
        res.json({ message: 'Xóa loại sự kiện thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa loại sự kiện', error: error.message });
    }
});

module.exports = router;