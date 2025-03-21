// backend/models/EventType.js
const mongoose = require('mongoose');

const eventTypeSchema = new mongoose.Schema({
    typeCode: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String }, // Thêm trường image
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

eventTypeSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('EventType', eventTypeSchema);