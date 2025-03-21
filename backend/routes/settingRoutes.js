const express = require('express');
const router = express.Router();
const settingController = require('../controllers/settingController');

router.get('/', settingController.getSettings);
router.put('/', settingController.updateSettings);

module.exports = router;