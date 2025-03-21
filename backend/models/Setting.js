// backend/models/Setting.js
const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
    siteName: { type: String, required: true },
    logo: { type: String }, // Đường dẫn tới logo
    contactEmail: { type: String, required: true },
    contactPhone: { type: String, required: true },
    updatedAt: { type: Date, default: Date.now },
});

settingSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Setting', settingSchema);