// backend/routes/blogRoutes.js
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
router.post('/', upload.single('image'), createBlog);
router.put('/:id', upload.single('image'), updateBlog);
router.delete('/:id', deleteBlog);
router.patch('/:id/toggle-approval', toggleApproval);
router.post('/upload-image', upload.single('image'), uploadImage);

// Routes công khai cho client
publicRouter.get('/', getPublicBlogs);
publicRouter.get('/:id', getPublicBlogById);

module.exports = { router, publicRouter };