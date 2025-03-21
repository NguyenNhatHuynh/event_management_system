// backend/hashPassword.js
const bcrypt = require('bcryptjs');

const password = 'admin123'; // Mật khẩu bạn muốn sử dụng
bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
        console.error('Error hashing password:', err);
    } else {
        console.log('Hashed password:', hash);
    }
});