// backend/routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const publicRouter = express.Router();
const Event = require('../models/Event');
const EventType = require('../models/EventType');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Cấu hình multer (giữ nguyên)
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

// Route công khai: Lấy danh sách sự kiện với tìm kiếm
publicRouter.get('/', async (req, res) => {
    try {
        const { eventType, typeCode, page = 1, limit = 6, search } = req.query;
        const query = { status: 'Đã phê duyệt' };

        if (eventType) {
            query.eventType = eventType;
        }

        if (typeCode) {
            const eventType = await EventType.findOne({ typeCode }).lean();
            if (!eventType) {
                return res.status(404).json({ message: 'Loại sự kiện không tồn tại' });
            }
            query.eventType = eventType._id;
        }

        if (search) {
            query.name = { $regex: search, $options: 'i' }; // Tìm kiếm không phân biệt hoa thường
        }

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const totalEvents = await Event.countDocuments(query);
        const events = await Event.find(query)
            .populate('eventType')
            .skip(skip)
            .limit(limitNum)
            .lean();

        res.json({
            events: events || [],
            currentPage: pageNum,
            totalPages: Math.ceil(totalEvents / limitNum),
            totalEvents,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
            events: [],
            currentPage: 1,
            totalPages: 1,
            totalEvents: 0,
        });
    }
});


// Giữ nguyên các route khác
publicRouter.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate('eventType').lean();
        if (!event || event.status !== 'Đã phê duyệt') {
            return res.status(404).json({ message: 'Sự kiện không tồn tại hoặc chưa được phê duyệt' });
        }
        res.json(event);
    } catch (error) {
        console.error('Lỗi khi lấy chi tiết sự kiện:', error);
        res.status(500).json({ message: 'Lỗi server', error });
    }
});


// Route admin: Lấy danh sách tất cả sự kiện với phân trang
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 3 } = req.query; // Mặc định page=1, limit=3
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        // Lấy tổng số sự kiện
        const totalEvents = await Event.countDocuments();

        // Lấy danh sách sự kiện với phân trang
        const events = await Event.find()
            .populate('eventType')
            .skip(skip)
            .limit(limitNum)
            .lean();

        res.json({
            events: events || [], // Đảm bảo events luôn là mảng
            currentPage: pageNum,
            totalPages: Math.ceil(totalEvents / limitNum),
            totalEvents,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
            events: [], // Trả về mảng rỗng nếu có lỗi
            currentPage: 1,
            totalPages: 1,
            totalEvents: 0,
        });
    }
});

// Route admin: Thêm sự kiện mới
router.post('/', upload.single('image'), async (req, res) => {
    const { name, eventType, date, location, description, status } = req.body;
    try {
        const event = new Event({
            name,
            eventType,
            date,
            location,
            description,
            status: status || 'Đang chờ',
            image: req.file ? `/uploads/${req.file.filename}` : null,
        });

        const newEvent = await event.save();
        const populatedEvent = await Event.findById(newEvent._id).populate('eventType');
        res.status(201).json(populatedEvent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route admin: Cập nhật sự kiện
router.put('/:id', upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { name, eventType, date, location, description, status } = req.body;

    try {
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: 'Sự kiện không tồn tại' });
        }

        event.name = name || event.name;
        event.eventType = eventType || event.eventType;
        event.date = date || event.date;
        event.location = location || event.location;
        event.description = description || event.description;
        event.status = status || event.status;
        if (req.file) {
            if (event.image) {
                const oldImagePath = path.join(__dirname, '..', event.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            event.image = `/uploads/${req.file.filename}`;
        }

        const updatedEvent = await event.save();
        const populatedEvent = await Event.findById(updatedEvent._id).populate('eventType');
        res.json(populatedEvent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route admin: Xóa sự kiện
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: 'Sự kiện không tồn tại' });
        }

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

// Route admin: Cập nhật trạng thái sự kiện
router.patch('/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Đang chờ', 'Đã phê duyệt', 'Hủy'].includes(status)) {
        return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
    }

    try {
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: 'Sự kiện không tồn tại' });
        }

        event.status = status;
        const updatedEvent = await event.save();
        const populatedEvent = await Event.findById(updatedEvent._id).populate('eventType');
        res.json(populatedEvent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = { router, publicRouter };