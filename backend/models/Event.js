// backend/models/Event.js
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    name: {
        type: String, required: true, trim: true,
    },
    eventType: {
        type: String, required: true,
    },
    date: {
        type: Date, required: true,
    },
    location: {
        type: String, required: true, trim: true,
    },
    description: {
        type: String, trim: true,
    },
    status: {
        type: String, enum: ['Đang chờ', 'Đã phê duyệt', 'Hủy'], default: 'Đang chờ',
    },
    image: {
        type: String, default: null,
    },
    createdAt: {
        type: Date, default: Date.now,
    },
    updatedAt: {
        type: Date, default: Date.now,
    },
});

eventSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Event', eventSchema);