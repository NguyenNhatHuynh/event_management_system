// backend/controllers/blogController.js
const Blog = require('../models/Blog');
const fs = require('fs');
const path = require('path');

// Lấy tất cả blog (cho admin)
exports.getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy danh sách blog công khai (cho client, chỉ lấy bài đã phê duyệt)
exports.getPublicBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ status: 'approved' }).sort({ createdAt: -1 });
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy chi tiết blog công khai (cho client, chỉ lấy bài đã phê duyệt)
exports.getPublicBlogById = async (req, res) => {
    try {
        const blog = await Blog.findOne({ _id: req.params.id, status: 'approved' });
        if (!blog) {
            return res.status(404).json({ message: 'Bài viết không tồn tại hoặc chưa được phê duyệt' });
        }
        res.json(blog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Tạo blog mới (admin)
exports.createBlog = async (req, res) => {
    try {
        const { title, content, category, status } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : null;

        if (image) {
            const imagePath = path.join(__dirname, '..', image);
            if (!fs.existsSync(imagePath)) {
                return res.status(500).json({ message: 'Hình ảnh không tồn tại trên server' });
            }
        }

        const blog = new Blog({
            title,
            content,
            category,
            status: status || 'pending',
            image,
        });

        await blog.save();
        res.status(201).json(blog);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Cập nhật blog (admin)
exports.updateBlog = async (req, res) => {
    try {
        const { title, content, category, status } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : req.body.image;

        if (image && req.file) {
            const imagePath = path.join(__dirname, '..', image);
            if (!fs.existsSync(imagePath)) {
                return res.status(500).json({ message: 'Hình ảnh không tồn tại trên server' });
            }
        }

        const blog = await Blog.findByIdAndUpdate(
            req.params.id,
            { title, content, category, status, image },
            { new: true }
        );

        if (!blog) {
            return res.status(404).json({ message: 'Bài viết không tồn tại' });
        }
        res.json(blog);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Xóa blog (admin)
exports.deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: 'Bài viết không tồn tại' });
        }
        if (blog.image) {
            const imagePath = path.join(__dirname, '..', blog.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }
        res.json({ message: 'Blog deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Chuyển đổi trạng thái phê duyệt (admin)
exports.toggleApproval = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: 'Bài viết không tồn tại' });
        }

        blog.status = blog.status === 'approved' ? 'pending' : 'approved';
        await blog.save();
        res.json(blog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Vui lòng upload hình ảnh' });
        }
        const imageUrl = `/uploads/${req.file.filename}`;
        const imagePath = path.join(__dirname, '..', imageUrl);
        if (!fs.existsSync(imagePath)) {
            return res.status(500).json({ message: 'Hình ảnh không tồn tại trên server' });
        }
        res.json({ url: `http://localhost:5000${imageUrl}` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};