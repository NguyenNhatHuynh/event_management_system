// backend/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { auth, adminOnly } = require('./middleware/auth');
const path = require('path');

// Load biến môi trường từ file .env
dotenv.config();

// Khởi tạo ứng dụng Express
const app = express();

// Kết nối tới database
connectDB().catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
});

// Middleware
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' ? 'https://your-frontend-domain.com' : 'http://localhost:3000',
    optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(helmet());

// Phục vụ file tĩnh (hình ảnh trong thư mục uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
    windowMs: 15 * 60 * 1000,
    max: 100,
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
const { router: blogRoutes, publicRouter: blogPublicRoutes } = require('./routes/blogRoutes'); // Sửa lại dòng này
const contactRoutes = require('./routes/contactRoutes');
const settingRoutes = require('./routes/settingRoutes');
const authRoutes = require('./routes/authRoutes');

// Route công khai
app.use('/api/events/public', eventPublicRoutes);
app.use('/api/event-types/public', eventTypeRoutes);
app.use('/api/blogs/public', blogPublicRoutes); // Thêm route công khai cho blog

// Các route admin được bảo vệ bằng middleware auth và adminOnly
app.use('/api/customers', auth, adminOnly, customerRoutes);
app.use('/api/event-types', auth, adminOnly, eventTypeRoutes);
app.use('/api/events', auth, adminOnly, eventRoutes);
app.use('/api/contracts', auth, adminOnly, contractRoutes);
app.use('/api/blogs', auth, adminOnly, blogRoutes); // Sử dụng blogRoutes cho admin
app.use('/api/contacts', auth, adminOnly, contactRoutes);
app.use('/api/settings', auth, adminOnly, settingRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', auth, userRoutes);

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

// Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});