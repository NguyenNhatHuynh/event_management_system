const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { auth, adminOnly } = require('./middleware/auth');
const path = require('path');
const Setting = require('./models/Setting');

// Load biến môi trường từ file .env
dotenv.config();

// Khởi tạo ứng dụng Express
const app = express();

// Enable trust proxy
app.set('trust proxy', 1);

// Kết nối tới database
const startServer = async () => {
    try {
        await connectDB();
        // Khởi tạo cài đặt mặc định
        await initializeSettings();
        // Start the server
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error.message);
        process.exit(1);
    }
};

// Khởi tạo cài đặt mặc định
const initializeSettings = async () => {
    try {
        const settingExists = await Setting.findOne();
        if (!settingExists) {
            const defaultSettings = new Setting({
                siteName: 'Event Management System',
                contactEmail: 'contact@example.com',
                contactPhone: '0123 456 789',
                logo: '',
            });
            await defaultSettings.save();
            console.log('Cài đặt mặc định đã được tạo!');
        }
    } catch (error) {
        console.error('Lỗi khi tạo cài đặt mặc định:', error);
    }
};

// Middleware CORS cho các API routes
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' ? 'https://your-frontend-domain.com' : 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'cache-control'],
    optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Middleware khác
app.use(express.json());
// Temporarily disable helmet to rule out interference with CORS headers
// app.use(helmet());

// Phục vụ file tĩnh (hình ảnh trong thư mục uploads) với CORS
app.use('/uploads', (req, res, next) => {
    console.log(`Accessing /uploads route: ${req.method} ${req.url}`);
    // Set CORS headers explicitly
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    // Handle preflight OPTIONS requests
    if (req.method === 'OPTIONS') {
        console.log('Handling OPTIONS request for /uploads');
        return res.status(200).end();
    }

    // Log the headers being sent
    console.log('Response headers for /uploads:', res.getHeaders());
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
    windowMs: 15 * 60 * 1000,
    max: process.env.NODE_ENV === 'development' ? 1000 : 100,
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

// Các route được bảo vệ bằng middleware auth và adminOnly
app.use('/api/customers', auth, adminOnly, customerRoutes);
app.use('/api/event-types', auth, adminOnly, eventTypeRoutes);
app.use('/api/events', auth, adminOnly, eventRoutes);
app.use('/api/contracts', auth, adminOnly, contractRoutes);
app.use('/api/blogs', auth, adminOnly, blogRoutes);
app.use('/api/contacts', auth, adminOnly, contactRoutes);
app.use('/api/settings', auth, adminOnly, settingRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
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

// Start the server
startServer();