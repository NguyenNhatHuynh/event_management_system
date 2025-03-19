const mongoose = require('mongoose');

const eventTypeSchema = new mongoose.Schema({
    typeCode: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    basePrice: { type: Number, required: true },
});

module.exports = mongoose.model('EventType', eventTypeSchema);