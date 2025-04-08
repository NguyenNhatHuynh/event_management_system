const express = require('express');
const { getBlogs, createBlog, updateBlog, deleteBlog, toggleApproval, uploadImage, getPublicBlogs, getPublicBlogById } = require('../controllers/blogController');
const multer = require('multer');
const path = require('path');

// Cấu hình multer để upload hình ảnh
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Chỉ hỗ trợ các định dạng hình ảnh: jpeg, jpg, png, gif'));
        }
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn 5MB
});

const router = express.Router();
const publicRouter = express.Router();

// Routes cho admin
router.get('/', getBlogs);

// Get a single blog by ID (admin)
router.get('/:id', async (req, res) => {
    try {
        const blog = await require('../models/Blog').findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: 'Bài viết không tồn tại' });
        }
        res.json(blog);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy bài viết', error: error.message });
    }
});

router.post('/', upload.single('image'), createBlog);
router.put('/:id', upload.single('image'), updateBlog);
router.delete('/:id', deleteBlog);
router.patch('/toggle-approval/:id', toggleApproval); // Fixed the route path to match AdminBlogs.js
router.post('/upload-image', upload.single('image'), uploadImage);

// Routes công khai cho client
publicRouter.get('/', getPublicBlogs);
publicRouter.get('/:id', getPublicBlogById);

module.exports = { router, publicRouter };