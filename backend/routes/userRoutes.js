const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { adminOnly } = require('../middleware/auth');
const userController = require('../controllers/userController');

// Lấy danh sách người dùng (chỉ admin)
router.get('/', adminOnly, userController.getUsers);

// Tạo người dùng mới (chỉ admin)
router.post('/', adminOnly, userController.createUser);

// Cập nhật thông tin người dùng (chỉ admin)
router.put('/:id', adminOnly, userController.updateUser);

// Xóa người dùng (chỉ admin)
router.delete('/:id', adminOnly, userController.deleteUser);

// Cập nhật thông tin cá nhân (người dùng tự cập nhật)
router.put('/profile/:id', async (req, res) => {
    const { id } = req.params;
    const { fullName, email, phone, address } = req.body;

    try {
        // Kiểm tra xem user có quyền cập nhật không
        if (req.user.id !== id) {
            return res.status(403).json({ message: 'Bạn không có quyền cập nhật thông tin này' });
        }

        // Kiểm tra email mới có bị trùng không
        const existingUser = await User.findOne({ email, _id: { $ne: id } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email đã tồn tại' });
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { fullName, email, phone, address },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User không tồn tại' });
        }

        res.json({
            id: updatedUser._id,
            email: updatedUser.email,
            fullName: updatedUser.fullName,
            phone: updatedUser.phone,
            address: updatedUser.address,
            role: updatedUser.role,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Đổi mật khẩu (người dùng tự đổi)
router.put('/:id/password', async (req, res) => {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    try {
        // Kiểm tra xem user có quyền đổi mật khẩu không
        if (req.user.id !== id) {
            return res.status(403).json({ message: 'Bạn không có quyền đổi mật khẩu này' });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User không tồn tại' });
        }

        // Kiểm tra mật khẩu hiện tại
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Mật khẩu hiện tại không đúng' });
        }

        // Mã hóa mật khẩu mới
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.json({ message: 'Đổi mật khẩu thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;