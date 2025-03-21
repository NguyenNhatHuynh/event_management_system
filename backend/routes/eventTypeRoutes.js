// backend/routes/eventTypeRoutes.js
const express = require('express');
const router = express.Router();
const EventType = require('../models/EventType');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Cấu hình multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb('Chỉ chấp nhận file ảnh (jpeg, jpg, png)!');
        }
    },
    limits: { fileSize: 5 * 1024 * 1024 },
});

router.use('/uploads', express.static('uploads'));

// Lấy danh sách loại sự kiện (công khai)
router.get('/public', async (req, res) => {
    try {
        const eventTypes = await EventType.find();
        res.json(eventTypes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Lấy danh sách loại sự kiện (dành cho admin)
router.get('/', async (req, res) => {
    try {
        const eventTypes = await EventType.find();
        res.json(eventTypes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Thêm loại sự kiện mới
router.post('/', upload.single('image'), async (req, res) => {
    const { typeCode, name, description } = req.body;
    try {
        const existingEventType = await EventType.findOne({ typeCode });
        if (existingEventType) {
            return res.status(400).json({ message: 'Mã loại sự kiện đã tồn tại' });
        }

        const eventType = new EventType({
            typeCode,
            name,
            description,
            image: req.file ? `/uploads/${req.file.filename}` : null,
        });

        const newEventType = await eventType.save();
        res.status(201).json(newEventType);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Cập nhật loại sự kiện
router.put('/:id', upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { typeCode, name, description } = req.body;

    try {
        const eventType = await EventType.findById(id);
        if (!eventType) {
            return res.status(404).json({ message: 'Loại sự kiện không tồn tại' });
        }

        const existingEventType = await EventType.findOne({ typeCode, _id: { $ne: id } });
        if (existingEventType) {
            return res.status(400).json({ message: 'Mã loại sự kiện đã tồn tại' });
        }

        eventType.typeCode = typeCode;
        eventType.name = name;
        eventType.description = description;
        if (req.file) {
            if (eventType.image) {
                const oldImagePath = path.join(__dirname, '..', eventType.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            eventType.image = `/uploads/${req.file.filename}`;
        }

        const updatedEventType = await eventType.save();
        res.json(updatedEventType);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Xóa loại sự kiện
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const eventType = await EventType.findById(id);
        if (!eventType) {
            return res.status(404).json({ message: 'Loại sự kiện không tồn tại' });
        }

        if (eventType.image) {
            const imagePath = path.join(__dirname, '..', eventType.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await eventType.deleteOne();
        res.json({ message: 'Xóa loại sự kiện thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;