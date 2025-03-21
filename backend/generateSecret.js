// backend/generateSecret.js
const crypto = require('crypto');

// Tạo chuỗi ngẫu nhiên 32 byte và chuyển thành hex
const secret = crypto.randomBytes(32).toString('hex');
console.log('Your JWT_SECRET:', secret);