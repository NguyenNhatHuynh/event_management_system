const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { auth, adminOnly } = require('../middleware/auth');

// Route công khai để khách hàng gửi yêu cầu đặt lịch
router.post('/public', bookingController.createBooking);

// Route bảo vệ để admin quản lý đặt lịch
router.get('/', auth, adminOnly, bookingController.getBookings);
router.put('/:id/approve', auth, adminOnly, bookingController.approveBooking);
router.put('/:id/reject', auth, adminOnly, bookingController.rejectBooking);

module.exports = router;