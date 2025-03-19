const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/admin/login', authController.loginAdmin);
router.post('/customer/login', authController.loginCustomer);

module.exports = router;