// backend/controllers/userController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const validator = require('validator');

// Hàm kiểm tra email và username trùng lặp
const checkDuplicate = async (field, value, excludeId) => {
    const query = { [field]: value };
    if (excludeId) {
        query._id = { $ne: excludeId };
    }
    const existing = await User.findOne(query);
    return existing;
};

// Lấy danh sách người dùng với phân trang và lọc theo vai trò
exports.getUsers = async (req, res) => {
    try {
        const { page = 1, limit = 6, role } = req.query; // Mặc định page=1, limit=6
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        // Tạo query để lọc theo vai trò nếu có
        const query = {};
        if (role) {
            query.role = role;
        }

        // Lấy tổng số người dùng
        const totalUsers = await User.countDocuments(query);

        // Lấy danh sách người dùng với phân trang
        const users = await User.find(query)
            .select('-password')
            .skip(skip)
            .limit(limitNum)
            .lean();

        res.json({
            users: users || [], // Đảm bảo users luôn là mảng
            currentPage: pageNum,
            totalPages: Math.ceil(totalUsers / limitNum),
            totalUsers,
        });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách người dùng:', error.message);
        res.status(500).json({
            message: error.message,
            users: [],
            currentPage: 1,
            totalPages: 1,
            totalUsers: 0,
        });
    }
};

// Các hàm khác giữ nguyên
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }
        res.json(user);
    } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng hiện tại:', error.message);
        res.status(500).json({ message: error.message });
    }
};

exports.updateMe = async (req, res) => {
    try {
        const { username, email, fullName, phone, address } = req.body;

        // Validation
        if (!username || username.length < 3) {
            return res.status(400).json({ message: 'Tên người dùng phải có ít nhất 3 ký tự' });
        }
        if (!email || !validator.isEmail(email)) {
            return res.status(400).json({ message: 'Email không hợp lệ' });
        }
        if (phone && !validator.isMobilePhone(phone, 'vi-VN')) {
            return res.status(400).json({ message: 'Số điện thoại không hợp lệ' });
        }

        const updates = { username, email, fullName, phone, address };

        const emailExists = await checkDuplicate('email', email, req.user.id);
        if (emailExists) {
            return res.status(400).json({ message: 'Email đã tồn tại' });
        }

        const usernameExists = await checkDuplicate('username', username, req.user.id);
        if (usernameExists) {
            return res.status(400).json({ message: 'Tên người dùng đã tồn tại' });
        }

        const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
        res.json(user);
    } catch (error) {
        console.error('Lỗi khi cập nhật thông tin người dùng:', error.message);
        res.status(400).json({ message: error.message });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword, confirmPassword } = req.body;

        // Validation
        if (!oldPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({ message: 'Vui lòng điền đầy đủ các trường' });
        }
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'Mật khẩu xác nhận không khớp' });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Mật khẩu mới phải có ít nhất 6 ký tự' });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Mật khẩu cũ không đúng' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.json({ message: 'Mật khẩu đã được thay đổi thành công' });
    } catch (error) {
        console.error('Lỗi khi đổi mật khẩu:', error.message);
        res.status(400).json({ message: error.message });
    }
};

exports.createUser = async (req, res) => {
    try {
        const { username, email, password, fullName, phone, address, role } = req.body;

        // Validation
        if (!username || username.length < 3) {
            return res.status(400).json({ message: 'Tên người dùng phải có ít nhất 3 ký tự' });
        }
        if (!email || !validator.isEmail(email)) {
            return res.status(400).json({ message: 'Email không hợp lệ' });
        }
        if (!password || password.length < 6) {
            return res.status(400).json({ message: 'Mật khẩu phải có ít nhất 6 ký tự' });
        }
        if (phone && !validator.isMobilePhone(phone, 'vi-VN')) {
            return res.status(400).json({ message: 'Số điện thoại không hợp lệ' });
        }
        if (!['admin', 'staff', 'customer'].includes(role)) {
            return res.status(400).json({ message: 'Vai trò không hợp lệ' });
        }

        const emailExists = await checkDuplicate('email', email);
        if (emailExists) {
            return res.status(400).json({ message: 'Email đã tồn tại' });
        }

        const usernameExists = await checkDuplicate('username', username);
        if (usernameExists) {
            return res.status(400).json({ message: 'Tên người dùng đã tồn tại' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            username,
            email,
            password: hashedPassword,
            fullName,
            phone,
            address,
            role: role || 'customer',
        });
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        console.error('Lỗi khi tạo người dùng:', error.message);
        res.status(400).json({ message: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { username, email, fullName, phone, address, role } = req.body;

        // Validation
        if (!username || username.length < 3) {
            return res.status(400).json({ message: 'Tên người dùng phải có ít nhất 3 ký tự' });
        }
        if (!email || !validator.isEmail(email)) {
            return res.status(400).json({ message: 'Email không hợp lệ' });
        }
        if (phone && !validator.isMobilePhone(phone, 'vi-VN')) {
            return res.status(400).json({ message: 'Số điện thoại không hợp lệ' });
        }
        if (!['admin', 'staff', 'customer'].includes(role)) {
            return res.status(400).json({ message: 'Vai trò không hợp lệ' });
        }

        const emailExists = await checkDuplicate('email', email, req.params.id);
        if (emailExists) {
            return res.status(400).json({ message: 'Email đã tồn tại' });
        }

        const usernameExists = await checkDuplicate('username', username, req.params.id);
        if (usernameExists) {
            return res.status(400).json({ message: 'Tên người dùng đã tồn tại' });
        }

        const updateData = { username, email, fullName, phone, address, role };
        const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User không tồn tại' });
        }
        res.json(user);
    } catch (error) {
        console.error('Lỗi khi cập nhật người dùng:', error.message);
        res.status(400).json({ message: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User không tồn tại' });
        }
        res.json({ message: 'User deleted' });
    } catch (error) {
        console.error('Lỗi khi xóa người dùng:', error.message);
        res.status(500).json({ message: error.message });
    }
};