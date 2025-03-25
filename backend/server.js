const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { auth, adminOnly } = require('./middleware/auth');
const path = require('path');
const Setting = require('./models/Setting'); // Thêm import model Setting

// Load biến môi trường từ file .env
dotenv.config();

// Khởi tạo ứng dụng Express
const app = express();

// Kết nối tới database
connectDB().catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
});

// Khởi tạo cài đặt mặc định
const initializeSettings = async () => {
    try {
        const settingExists = await Setting.findOne();
        if (!settingExists) {
            const defaultSettings = new Setting({
                siteName: 'Event Management System',
                contactEmail: 'contact@example.com',
                contactPhone: '0123 456 789',
                logo: '', // Đường dẫn logo mặc định (có thể để trống)
            });
            await defaultSettings.save();
            console.log('Cài đặt mặc định đã được tạo!');
        }
    } catch (error) {
        console.error('Lỗi khi tạo cài đặt mặc định:', error);
    }
};

// Middleware CORS
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' ? 'https://your-frontend-domain.com' : 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Middleware khác
app.use(express.json());
app.use(helmet());

// Phục vụ file tĩnh (hình ảnh trong thư mục uploads) với CORS
app.use('/uploads', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', process.env.NODE_ENV === 'production' ? 'https://your-frontend-domain.com' : 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}, express.static(path.join(__dirname, 'uploads')));

// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    const fs = require('fs');
    const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
    app.use(morgan('combined', { stream: accessLogStream }));
}

// Giới hạn số lượng request
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 phút
    max: process.env.NODE_ENV === 'development' ? 1000 : 100, // Tăng lên 1000 trong môi trường phát triển
    message: 'Quá nhiều yêu cầu từ IP này, vui lòng thử lại sau 15 phút!',
});
app.use((req, res, next) => {
    if (req.path.startsWith('/api/auth')) {
        return next();
    }
    limiter(req, res, next);
});

// Routes
const customerRoutes = require('./routes/customerRoutes');
const eventTypeRoutes = require('./routes/eventTypeRoutes');
const { router: eventRoutes, publicRouter: eventPublicRoutes } = require('./routes/eventRoutes');
const contractRoutes = require('./routes/contractRoutes');
const userRoutes = require('./routes/userRoutes');
const { router: blogRoutes, publicRouter: blogPublicRoutes } = require('./routes/blogRoutes');
const contactRoutes = require('./routes/contactRoutes');
const settingRoutes = require('./routes/settingRoutes');
const authRoutes = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// Route công khai
app.use('/api/events/public', eventPublicRoutes);
app.use('/api/event-types/public', eventTypeRoutes);
app.use('/api/blogs/public', blogPublicRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/bookings', bookingRoutes);

// Các route admin được bảo vệ bằng middleware auth và adminOnly
app.use('/api/customers', auth, adminOnly, customerRoutes);
app.use('/api/event-types', auth, adminOnly, eventTypeRoutes);
app.use('/api/events', auth, adminOnly, eventRoutes);
app.use('/api/contracts', auth, adminOnly, contractRoutes);
app.use('/api/blogs', auth, adminOnly, blogRoutes);
app.use('/api/contacts', auth, adminOnly, contactRoutes);
app.use('/api/settings', auth, adminOnly, settingRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', auth, userRoutes);
app.use('/api/dashboard', auth, adminOnly, dashboardRoutes);

// Route cơ bản để kiểm tra API
app.get('/', (req, res) => {
    res.json({
        message: 'Event Management API',
        version: '1.0.0',
        status: 'running',
    });
});

// Middleware xử lý lỗi
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Có lỗi xảy ra trên server!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
});

// Khởi động server và khởi tạo cài đặt
connectDB().then(() => {
    initializeSettings(); // Gọi hàm khởi tạo cài đặt
}).catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


















































// ============================ DÙNG ĐỂ TẠO TÀI KHOẢN ADMIN ==================================

// const User = require('./models/User');
// const bcrypt = require('bcryptjs');

// const initializeAdmin = async () => {
//     try {
//         const adminExists = await User.findOne({ role: 'admin' });
//         if (!adminExists) {
//             const hashedPassword = await bcrypt.hash('admin123', 10);
//             const admin = new User({
//                 username: 'admin',
//                 email: 'admin@example.com',
//                 password: hashedPassword,
//                 role: 'admin',
//                 fullName: 'Admin User',
//                 phone: '0987543211',
//                 address: '456 Đường Láng, Hà Nội',
//             });
//             await admin.save();
//             console.log('Tài khoản admin đã được tạo!');
//         }
//     } catch (error) {
//         console.error('Lỗi khi tạo tài khoản admin:', error);
//     }
// };

// // Gọi hàm khởi tạo admin sau khi kết nối database
// connectDB().then(() => {
//     initializeAdmin();
// }).catch((error) => {
//     console.error('Failed to connect to MongoDB:', error);
//     process.exit(1);
// });