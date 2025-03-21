// backend/models/EventType.js
const mongoose = require('mongoose');

const eventTypeSchema = new mongoose.Schema({
    typeCode: { type: String, required: true, unique: true }, // Mã loại sự kiện
    name: { type: String, required: true }, // Tên loại sự kiện
    description: { type: String }, // Mô tả (tùy chọn)
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

eventTypeSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('EventType', eventTypeSchema);