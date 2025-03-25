const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');

// Đăng nhập
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Validation
        if (!email || !validator.isEmail(email)) {
            return res.status(400).json({ message: 'Email không hợp lệ' });
        }
        if (!password || password.length < 6) {
            return res.status(400).json({ message: 'Mật khẩu phải có ít nhất 6 ký tự' });
        }

        // Tìm user theo email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
        }

        // Kiểm tra mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
        }

        // Tạo token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        console.error('Lỗi khi đăng nhập:', err.message);
        res.status(500).json({ message: err.message });
    }
};

// Đăng ký (chỉ cho customer)
const register = async (req, res) => {
    const { username, email, password, fullName, phone, address } = req.body;
    try {
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

        // Kiểm tra email trùng
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ message: 'Email đã tồn tại' });
        }

        // Kiểm tra username trùng
        const usernameExists = await User.findOne({ username });
        if (usernameExists) {
            return res.status(400).json({ message: 'Tên người dùng đã tồn tại' });
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            username,
            email,
            password: hashedPassword,
            fullName,
            phone,
            address,
            role: 'customer',
        });
        await user.save();

        // Tạo token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        console.error('Lỗi khi đăng ký:', err.message);
        res.status(500).json({ message: err.message });
    }
};

// Gắn các route vào router
router.post('/login', login);
router.post('/register', register);

// Xuất router
module.exports = router;