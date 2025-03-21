// backend/routes/eventTypeRoutes.js
const express = require('express');
const router = express.Router();
const EventType = require('../models/EventType');

// Route công khai: Lấy danh sách loại sự kiện
router.get('/public', async (req, res) => {
    try {
        const eventTypes = await EventType.find();
        res.json(eventTypes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route admin: Lấy danh sách loại sự kiện
router.get('/', async (req, res) => {
    try {
        const eventTypes = await EventType.find();
        res.json(eventTypes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route admin: Thêm loại sự kiện
router.post('/', async (req, res) => {
    const { typeCode, name, description } = req.body;
    try {
        const eventType = new EventType({
            typeCode,
            name,
            description,
        });
        const newEventType = await eventType.save();
        res.status(201).json(newEventType);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route admin: Cập nhật loại sự kiện
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { typeCode, name, description } = req.body;
    try {
        const eventType = await EventType.findById(id);
        if (!eventType) {
            return res.status(404).json({ message: 'Loại sự kiện không tồn tại' });
        }

        eventType.typeCode = typeCode;
        eventType.name = name;
        eventType.description = description;

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