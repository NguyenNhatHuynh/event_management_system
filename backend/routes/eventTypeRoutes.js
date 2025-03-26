// backend/routes/eventTypeRoutes.js
const express = require('express');
const router = express.Router();
const EventType = require('../models/EventType');

// Route công khai: Lấy danh sách loại sự kiện
router.get('/public', async (req, res) => {
    try {
        const eventTypes = await EventType.find().lean();
        console.log('Event types fetched from DB:', eventTypes); // Thêm log
        res.json(eventTypes || []);
    } catch (error) {
        console.error('Lỗi khi lấy danh sách loại sự kiện:', error);
        res.status(500).json([]);
    }
});

// Route admin: Lấy danh sách loại sự kiện với phân trang
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 6 } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const totalEventTypes = await EventType.countDocuments();

        const eventTypes = await EventType.find()
            .skip(skip)
            .limit(limitNum)
            .lean();

        res.json({
            eventTypes: eventTypes || [],
            currentPage: pageNum,
            totalPages: Math.ceil(totalEventTypes / limitNum),
            totalEventTypes,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
            eventTypes: [],
            currentPage: 1,
            totalPages: 1,
            totalEventTypes: 0,
        });
    }
});

// Route admin: Thêm loại sự kiện mới
router.post('/', async (req, res) => {
    const { name, typeCode, description } = req.body;
    try {
        const eventType = new EventType({ name, typeCode, description });
        const newEventType = await eventType.save();
        res.status(201).json(newEventType);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route admin: Cập nhật loại sự kiện
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, typeCode, description } = req.body;

    try {
        const eventType = await EventType.findById(id);
        if (!eventType) {
            return res.status(404).json({ message: 'Loại sự kiện không tồn tại' });
        }

        eventType.name = name || eventType.name;
        eventType.typeCode = typeCode || eventType.typeCode;
        eventType.description = description || eventType.description;
        const updatedEventType = await eventType.save();
        res.json(updatedEventType);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route admin: Xóa loại sự kiện
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const eventType = await EventType.findById(id);
        if (!eventType) {
            return res.status(404).json({ message: 'Loại sự kiện không tồn tại' });
        }

        await eventType.deleteOne();
        res.json({ message: 'Xóa loại sự kiện thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;