// backend/controllers/blogController.js
const Blog = require('../models/Blog');
const fs = require('fs');
const path = require('path');

// Lấy tất cả blog (cho admin) với phân trang
exports.getBlogs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Trang hiện tại, mặc định là 1
        const limit = parseInt(req.query.limit) || 5; // Số lượng bài viết trên mỗi trang, mặc định là 5
        const skip = (page - 1) * limit; // Số bài viết cần bỏ qua

        // Lấy tổng số bài viết
        const totalBlogs = await Blog.countDocuments();

        // Lấy danh sách bài viết với phân trang
        const blogs = await Blog.find()
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }); // Sắp xếp theo ngày tạo, mới nhất trước

        // Kiểm tra xem hình ảnh có tồn tại không
        const blogsWithImageCheck = blogs.map(blog => {
            if (blog.image) {
                const imagePath = path.join(__dirname, '..', blog.image);
                if (!fs.existsSync(imagePath)) {
                    console.log(`Hình ảnh không tồn tại: ${blog.image}`);
                    blog.image = null; // Đặt image thành null nếu file không tồn tại
                }
            }
            return blog;
        });

        res.json({
            blogs: blogsWithImageCheck,
            currentPage: page,
            totalPages: Math.ceil(totalBlogs / limit),
            totalBlogs,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy danh sách blog công khai (cho client, chỉ lấy bài đã phê duyệt) với phân trang
exports.getPublicBlogs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        const skip = (page - 1) * limit;
        const search = req.query.search || ''; // Lấy tham số tìm kiếm

        // Tạo query với tìm kiếm theo tiêu đề
        const query = {
            status: 'approved',
            ...(search && {
                title: { $regex: search, $options: 'i' } // Tìm kiếm không phân biệt hoa thường
            })
        };

        const totalBlogs = await Blog.countDocuments(query);

        const blogs = await Blog.find(query)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const blogsWithImageCheck = blogs.map(blog => {
            if (blog.image) {
                const imagePath = path.join(__dirname, '..', blog.image);
                if (!fs.existsSync(imagePath)) {
                    console.log(`Hình ảnh không tồn tại: ${blog.image}`);
                    blog.image = null;
                }
            }
            return blog;
        });

        res.json({
            blogs: blogsWithImageCheck,
            currentPage: page,
            totalPages: Math.ceil(totalBlogs / limit),
            totalBlogs,
        });
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
        if (blog.image) {
            const imagePath = path.join(__dirname, '..', blog.image);
            if (!fs.existsSync(imagePath)) {
                console.log(`Hình ảnh không tồn tại: ${blog.image}`);
                blog.image = null;
            }
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
                return res.status(500).json({ message: 'Hình ảnh không tồn tại trên server sau khi upload' });
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
                return res.status(500).json({ message: 'Hình ảnh không tồn tại trên server sau khi upload' });
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

// Upload hình ảnh (cho editor)
exports.uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Vui lòng upload hình ảnh' });
        }
        const imageUrl = `/uploads/${req.file.filename}`;
        const imagePath = path.join(__dirname, '..', imageUrl);
        if (!fs.existsSync(imagePath)) {
            return res.status(500).json({ message: 'Hình ảnh không tồn tại trên server sau khi upload' });
        }
        res.json({ url: `http://localhost:5000${imageUrl}` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};