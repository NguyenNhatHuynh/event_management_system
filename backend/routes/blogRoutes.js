// backend/routes/blogRoutes.js
const express = require('express');
const { getBlogs, createBlog, updateBlog, deleteBlog, toggleApproval, uploadImage } = require('../controllers/blogController');
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
const upload = multer({ storage });

const router = express.Router();
const publicRouter = express.Router();

// Routes cho admin
router.get('/', getBlogs);
router.post('/', upload.single('image'), createBlog);
router.put('/:id', upload.single('image'), updateBlog);
router.delete('/:id', deleteBlog);
router.patch('/:id/toggle-approval', toggleApproval);
router.post('/upload-image', upload.single('image'), uploadImage);

// Routes công khai cho client
publicRouter.get('/', async (req, res) => {
    try {
        const Blog = require('../models/Blog');
        const blogs = await Blog.find({ status: 'approved' });
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

publicRouter.get('/:id', async (req, res) => {
    try {
        const Blog = require('../models/Blog');
        const blog = await Blog.findOne({ _id: req.params.id, status: 'approved' });
        if (!blog) {
            return res.status(404).json({ message: 'Bài viết không tồn tại hoặc chưa được phê duyệt' });
        }
        res.json(blog);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

module.exports = { router, publicRouter };