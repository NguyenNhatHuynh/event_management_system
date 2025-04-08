const Blog = require('../models/Blog');
const fs = require('fs');
const path = require('path');

// Lấy tất cả blog (cho admin) với phân trang
exports.getBlogs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        const totalBlogs = await Blog.countDocuments();

        const blogs = await Blog.find()
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

// Lấy danh sách blog công khai (cho client, chỉ lấy bài đã phê duyệt) với phân trang
exports.getPublicBlogs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        const skip = (page - 1) * limit;
        const search = req.query.search || '';

        const query = {
            status: 'approved',
            ...(search && {
                title: { $regex: search, $options: 'i' }
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
        let image = req.body.image; // Keep the existing image by default

        // If a new image is uploaded, update the image path and delete the old image
        if (req.file) {
            image = `/uploads/${req.file.filename}`;
            const imagePath = path.join(__dirname, '..', image);
            if (!fs.existsSync(imagePath)) {
                return res.status(500).json({ message: 'Hình ảnh không tồn tại trên server sau khi upload' });
            }

            // Delete the old image if it exists
            const blog = await Blog.findById(req.params.id);
            if (blog.image) {
                const oldImagePath = path.join(__dirname, '..', blog.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                    console.log(`Deleted old image: ${blog.image}`);
                }
            }
        }

        const updatedBlog = await Blog.findByIdAndUpdate(
            req.params.id,
            { title, content, category, status, image },
            { new: true }
        );

        if (!updatedBlog) {
            return res.status(404).json({ message: 'Bài viết không tồn tại' });
        }
        res.json(updatedBlog);
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