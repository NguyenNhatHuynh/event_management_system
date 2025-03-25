// backend/controllers/bookingController.js
const Booking = require('../models/Booking');
const nodemailer = require('nodemailer');

// Cấu hình nodemailer
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true cho port 465, false cho các port khác như 587
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Tạo đặt lịch mới (cho client)
exports.createBooking = async (req, res) => {
    try {
        const { customerName, email, eventType, eventDate } = req.body;
        const booking = new Booking({
            customerName,
            email,
            eventType,
            eventDate,
        });
        await booking.save();
        res.status(201).json(booking);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Lấy danh sách đặt lịch (cho admin) với phân trang
exports.getBookings = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Trang hiện tại, mặc định là 1
        const limit = parseInt(req.query.limit) || 5; // Số lượng đặt lịch trên mỗi trang, mặc định là 5
        const skip = (page - 1) * limit; // Số đặt lịch cần bỏ qua

        // Lấy tổng số đặt lịch
        const totalBookings = await Booking.countDocuments();

        // Lấy danh sách đặt lịch với phân trang
        const bookings = await Booking.find()
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }); // Sắp xếp theo ngày tạo, mới nhất trước

        res.json({
            bookings,
            currentPage: page,
            totalPages: Math.ceil(totalBookings / limit),
            totalBookings,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Phê duyệt đặt lịch (cho admin)
exports.approveBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Đặt lịch không tồn tại' });
        }
        if (booking.status !== 'Pending') {
            return res.status(400).json({ message: 'Đặt lịch đã được xử lý' });
        }

        booking.status = 'Approved';
        await booking.save();

        // Gửi email thông báo phê duyệt
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: booking.email,
            subject: 'Thông báo phê duyệt đặt lịch từ EventPro',
            text: `Chào ${booking.customerName},\n\nChúng tôi xin thông báo rằng yêu cầu đặt lịch của bạn cho sự kiện "${booking.eventType}" vào ngày ${booking.eventDate.toLocaleDateString()} đã được phê duyệt.\n\nTrân trọng,\nEventPro Team`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
                    <!-- Header với logo -->
                    <div style="text-align: center; padding-bottom: 20px;">
                        <img src="https://drive.google.com/uc?export=download&id=YOUR_LOGO_ID" alt="EventPro Logo" style="max-width: 150px; height: auto;">
                        <p style="color: #777; font-size: 12px; margin: 5px 0;">(Logo EventPro)</p>
                    </div>
                    <!-- Tiêu đề -->
                    <h2 style="color: #007bff; text-align: center; margin-bottom: 20px;">Chào ${booking.customerName},</h2>
                    <!-- Nội dung chính -->
                    <p style="color: #333; font-size: 16px; line-height: 1.6; text-align: center;">Chúng tôi xin thông báo rằng yêu cầu đặt lịch của bạn cho sự kiện "${booking.eventType}" vào ngày ${booking.eventDate.toLocaleDateString()} đã được phê duyệt.</p>
                    <!-- Chữ ký -->
                    <p style="color: #333; font-size: 16px; line-height: 1.6; text-align: center;">Trân trọng,</p>
                    <p style="color: #007bff; font-size: 16px; font-weight: bold; margin: 0; text-align: center;">EventPro Team</p>
                    <!-- Footer -->
                    <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e0e0e0; margin-top: 20px;">
                        <p style="color: #777; font-size: 14px; margin: 5px 0;">© 2025 EventPro. All rights reserved.</p>
                        <p style="color: #777; font-size: 14px; margin: 5px 0;">
                            <a href="https://yourwebsite.com" style="color: #007bff; text-decoration: none;">Visit our website</a> | 
                            <a href="mailto:support@eventpro.com" style="color: #007bff; text-decoration: none;">Contact us</a>
                        </p>
                    </div>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email phê duyệt đã được gửi tới ${booking.email} vào lúc ${new Date().toISOString()}`);

        res.json(booking);
    } catch (error) {
        console.error(`Lỗi khi gửi email: ${error.message}`);
        res.status(500).json({ message: 'Lỗi khi phê duyệt đặt lịch: ' + error.message });
    }
};

// Từ chối đặt lịch (cho admin)
exports.rejectBooking = async (req, res) => {
    try {
        const { reason } = req.body; // Lý do từ chối
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Đặt lịch không tồn tại' });
        }
        if (booking.status !== 'Pending') {
            return res.status(400).json({ message: 'Đặt lịch đã được xử lý' });
        }

        booking.status = 'Rejected';
        booking.rejectReason = reason || 'Không được cung cấp';
        await booking.save();

        // Gửi email thông báo từ chối
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: booking.email,
            subject: 'Thông báo từ chối đặt lịch từ EventPro',
            text: `Chào ${booking.customerName},\n\nChúng tôi rất tiếc phải thông báo rằng yêu cầu đặt lịch của bạn cho sự kiện "${booking.eventType}" vào ngày ${booking.eventDate.toLocaleDateString()} đã bị từ chối.\nLý do: ${booking.rejectReason}.\n\nTrân trọng,\nEventPro Team`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
                    <!-- Header với logo -->
                    <div style="text-align: center; padding-bottom: 20px;">
                        <img src="https://drive.google.com/uc?export=download&id=YOUR_LOGO_ID" alt="EventPro Logo" style="max-width: 150px; height: auto;">
                        <p style="color: #777; font-size: 12px; margin: 5px 0;">(Logo EventPro)</p>
                    </div>
                    <!-- Tiêu đề -->
                    <h2 style="color: #007bff; text-align: center; margin-bottom: 20px;">Chào ${booking.customerName},</h2>
                    <!-- Nội dung chính -->
                    <p style="color: #333; font-size: 16px; line-height: 1.6; text-align: center;">Chúng tôi rất tiếc phải thông báo rằng yêu cầu đặt lịch của bạn cho sự kiện "${booking.eventType}" vào ngày ${booking.eventDate.toLocaleDateString()} đã bị từ chối.</p>
                    <p style="color: #333; font-size: 16px; line-height: 1.6; text-align: center;">Lý do: ${booking.rejectReason}.</p>
                    <!-- Chữ ký -->
                    <p style="color: #333; font-size: 16px; line-height: 1.6; text-align: center;">Trân trọng,</p>
                    <p style="color: #007bff; font-size: 16px; font-weight: bold; margin: 0; text-align: center;">EventPro Team</p>
                    <!-- Footer -->
                    <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e0e0e0; margin-top: 20px;">
                        <p style="color: #777; font-size: 14px; margin: 5px 0;">© 2025 EventPro. All rights reserved.</p>
                        <p style="color: #777; font-size: 14px; margin: 5px 0;">
                            <a href="https://yourwebsite.com" style="color: #007bff; text-decoration: none;">Visit our website</a> | 
                            <a href="mailto:support@eventpro.com" style="color: #007bff; text-decoration: none;">Contact us</a>
                        </p>
                    </div>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email từ chối đã được gửi tới ${booking.email} vào lúc ${new Date().toISOString()}`);

        res.json(booking);
    } catch (error) {
        console.error(`Lỗi khi gửi email: ${error.message}`);
        res.status(500).json({ message: 'Lỗi khi từ chối đặt lịch: ' + error.message });
    }
};