// backend/models/Event.js
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    eventCode: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    description: { type: String },
    image: { type: String }, // Thêm trường image để lưu đường dẫn hình ảnh
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

eventSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Event', eventSchema);