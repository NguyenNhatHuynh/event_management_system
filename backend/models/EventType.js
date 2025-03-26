// backend/models/EventType.js
const mongoose = require('mongoose');

const eventTypeSchema = new mongoose.Schema({
    name: {
        type: String, required: true, trim: true,
    },
    typeCode: {
        type: String, required: true, unique: true, trim: true,
    },
    description: {
        type: String, trim: true,
    },
    createdAt: {
        type: Date, default: Date.now,
    },
    updatedAt: {
        type: Date, default: Date.now,
    },
}
);

eventTypeSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('EventType', eventTypeSchema);