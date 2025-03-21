// backend/models/Contract.js
const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
    contractCode: { type: String, required: true, unique: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    eventTypeId: { type: mongoose.Schema.Types.ObjectId, ref: 'EventType', required: true },
    eventDate: { type: Date, required: true },
    location: { type: String, required: true },
    totalCost: { type: Number, required: true },
    deposit: { type: Number, default: 0 },
    status: { type: String, enum: ['Pending', 'Signed', 'Completed', 'Cancelled'], default: 'Pending' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// Tự động cập nhật updatedAt khi chỉnh sửa
contractSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Contract', contractSchema);