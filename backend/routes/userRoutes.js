const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth, adminOnly } = require('../middleware/auth');

// Lấy danh sách người dùng (chỉ admin)
router.get('/', auth, adminOnly, userController.getUsers);

// Tạo người dùng mới (chỉ admin)
router.post('/', auth, adminOnly, userController.createUser);

// Cập nhật thông tin người dùng (chỉ admin)
router.put('/:id', auth, adminOnly, userController.updateUser);

// Xóa người dùng (chỉ admin)
router.delete('/:id', auth, adminOnly, userController.deleteUser);

// Lấy thông tin người dùng hiện tại
router.get('/me', auth, userController.getMe);

// Cập nhật thông tin cá nhân (người dùng tự cập nhật)
router.put('/me', auth, userController.updateMe);

// Đổi mật khẩu (người dùng tự đổi)
router.put('/change-password', auth, userController.changePassword);

module.exports = router;