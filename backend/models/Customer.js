const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    customerCode: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    address: { type: String },
    password: { type: String }, // Nếu khách hàng đăng ký tài khoản
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Customer', customerSchema);