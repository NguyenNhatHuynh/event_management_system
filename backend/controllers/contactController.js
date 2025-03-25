// backend/controllers/contactController.js
const Contact = require('../models/Contact');
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

// Lấy tất cả liên hệ (cho admin) với phân trang
exports.getContacts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Trang hiện tại, mặc định là 1
        const limit = parseInt(req.query.limit) || 5; // Số lượng liên hệ trên mỗi trang, mặc định là 5
        const skip = (page - 1) * limit; // Số liên hệ cần bỏ qua

        // Lấy tổng số liên hệ
        const totalContacts = await Contact.countDocuments();

        // Lấy danh sách liên hệ với phân trang
        const contacts = await Contact.find()
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }); // Sắp xếp theo ngày tạo, mới nhất trước

        res.json({
            contacts,
            currentPage: page,
            totalPages: Math.ceil(totalContacts / limit),
            totalContacts,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Tạo liên hệ mới (cho client)
exports.createContact = async (req, res) => {
    try {
        const { name, email, message } = req.body;
        const contact = new Contact({
            name,
            email,
            message,
        });
        await contact.save();
        res.status(201).json(contact);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Trả lời liên hệ (cho admin)
exports.replyContact = async (req, res) => {
    try {
        const { replyMessage } = req.body;
        const contact = await Contact.findById(req.params.id);
        if (!contact) {
            return res.status(404).json({ message: 'Liên hệ không tồn tại' });
        }
        if (contact.status !== 'Pending') {
            return res.status(400).json({ message: 'Liên hệ đã được xử lý' });
        }

        // Gửi email với định dạng mới
        const logoUrl = `${process.env.SERVER_URL}/public/images/Logo.png`; // Sử dụng URL từ backend
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: contact.email,
            subject: 'Phản hồi từ EventPro',
            text: `Chào ${contact.name},\n\nCảm ơn bạn đã liên hệ với chúng tôi. Dưới đây là phản hồi của chúng tôi:\n\n${replyMessage}\n\nTrân trọng,\nEventPro Team`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
                    <!-- Header với logo -->
                    <div style="text-align: center; padding-bottom: 20px;">
                        <img src="${logoUrl}" alt="EventPro Logo" style="max-width: 150px; height: auto;">
                        <p style="color: #777; font-size: 12px; margin: 5px 0;">(Logo EventPro)</p>
                    </div>
                    <!-- Tiêu đề -->
                    <h2 style="color: #007bff; text-align: center; margin-bottom: 20px;">Chào ${contact.name},</h2>
                    <!-- Nội dung chính -->
                    <p style="color: #333; font-size: 16px; line-height: 1.6; text-align: center;">Cảm ơn bạn đã liên hệ với chúng tôi. Dưới đây là phản hồi của chúng tôi:</p>
                    <div style="background-color: #ffffff; padding: 20px; border-radius: 5px; border: 1px solid #e0e0e0; margin: 20px 0;">
                        <p style="color: #555; font-size: 16px; line-height: 1.6; margin: 0;">${replyMessage}</p>
                    </div>
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
        console.log(`Email đã được gửi tới ${contact.email} vào lúc ${new Date().toISOString()}`);

        contact.status = 'Replied';
        await contact.save();
        res.json(contact);
    } catch (error) {
        console.error(`Lỗi khi gửi email: ${error.message}`);
        res.status(500).json({ message: 'Lỗi khi gửi email: ' + error.message });
    }
};

// Xóa liên hệ (cho admin)
exports.deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) {
            return res.status(404).json({ message: 'Liên hệ không tồn tại' });
        }
        contact.status = 'Closed';
        await contact.save();
        await Contact.findByIdAndDelete(req.params.id);
        res.json({ message: 'Liên hệ đã được xóa' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};