const mongoose = require('mongoose');

// Hàm kết nối tới MongoDB
const connectDB = async () => {
    try {
        // Kiểm tra biến môi trường MONGO_URI
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI không được định nghĩa trong file .env');
        }

        // Kết nối tới MongoDB
        await mongoose.connect(process.env.MONGO_URI, {
            // Không cần useNewUrlParser và useUnifiedTopology nữa
            // Thêm các tùy chọn mới nếu cần
            serverSelectionTimeoutMS: 5000, // Thời gian chờ chọn server (5 giây)
            connectTimeoutMS: 10000, // Thời gian chờ kết nối (10 giây)
        });

        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        // Thử kết nối lại sau 5 giây nếu thất bại
        setTimeout(connectDB, 5000);
        throw error; // Ném lỗi để xử lý ở nơi gọi
    }
};

// Xử lý sự kiện ngắt kết nối
mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected! Attempting to reconnect...');
    connectDB();
});

// Xử lý sự kiện lỗi
mongoose.connection.on('error', (error) => {
    console.error('MongoDB error:', error.message);
});

module.exports = connectDB;