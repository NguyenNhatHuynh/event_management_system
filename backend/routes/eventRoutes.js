// backend/routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const multer = require('multer');
const path = require('path');

// Cấu hình multer để lưu hình ảnh
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Thư mục lưu hình ảnh
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Đặt tên file với timestamp
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
    limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn kích thước file: 5MB
});

// Tạo thư mục uploads nếu chưa tồn tại
const fs = require('fs');
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Phục vụ file tĩnh từ thư mục uploads
router.use('/uploads', express.static('uploads'));

// Lấy danh sách sự kiện (công khai)
router.get('/public', async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Lấy danh sách sự kiện (dành cho admin)
router.get('/', async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Thêm sự kiện mới (với upload hình ảnh)
router.post('/', upload.single('image'), async (req, res) => {
    const { eventCode, name, date, location, description } = req.body;
    try {
        const existingEvent = await Event.findOne({ eventCode });
        if (existingEvent) {
            return res.status(400).json({ message: 'Mã sự kiện đã tồn tại' });
        }

        const event = new Event({
            eventCode,
            name,
            date,
            location,
            description,
            image: req.file ? `/uploads/${req.file.filename}` : null, // Lưu đường dẫn hình ảnh
        });

        const newEvent = await event.save();
        res.status(201).json(newEvent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Cập nhật sự kiện (với upload hình ảnh)
router.put('/:id', upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { eventCode, name, date, location, description } = req.body;

    try {
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: 'Sự kiện không tồn tại' });
        }

        const existingEvent = await Event.findOne({ eventCode, _id: { $ne: id } });
        if (existingEvent) {
            return res.status(400).json({ message: 'Mã sự kiện đã tồn tại' });
        }

        event.eventCode = eventCode;
        event.name = name;
        event.date = date;
        event.location = location;
        event.description = description;
        if (req.file) {
            event.image = `/uploads/${req.file.filename}`; // Cập nhật hình ảnh nếu có
        }

        const updatedEvent = await event.save();
        res.json(updatedEvent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Xóa sự kiện
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: 'Sự kiện không tồn tại' });
        }

        // Xóa hình ảnh nếu có
        if (event.image) {
            const imagePath = path.join(__dirname, '..', event.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await event.deleteOne();
        res.json({ message: 'Xóa sự kiện thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;