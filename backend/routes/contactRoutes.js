// backend/routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// Route công khai để client gửi liên hệ
router.post('/', contactController.createContact);

// Route cho admin
router.get('/', contactController.getContacts);
router.patch('/:id/reply', contactController.replyContact);
router.delete('/:id', contactController.deleteContact);

module.exports = router;