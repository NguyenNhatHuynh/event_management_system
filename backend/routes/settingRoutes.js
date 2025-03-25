const express = require('express');
const router = express.Router();
const settingController = require('../controllers/settingController');

router.get('/', settingController.getSettings);
router.put('/', settingController.updateSettings); // Route này sẽ xử lý cả upload file

module.exports = router;