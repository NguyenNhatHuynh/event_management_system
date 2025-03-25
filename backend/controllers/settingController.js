const Setting = require('../models/Setting');
const multer = require('multer');
const path = require('path');

// Cấu hình multer để lưu file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `logo-${Date.now()}${path.extname(file.originalname)}`);
    },
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Chỉ chấp nhận file ảnh (jpeg, jpg, png)!'));
        }
    },
}).single('logo');

exports.getSettings = async (req, res) => {
    try {
        const settings = await Setting.findOne();
        if (!settings) {
            return res.status(404).json({ message: 'Không tìm thấy cài đặt' });
        }
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateSettings = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }

        try {
            const updateData = {
                siteName: req.body.siteName,
                contactEmail: req.body.contactEmail,
                contactPhone: req.body.contactPhone,
            };

            if (req.file) {
                updateData.logo = `/uploads/${req.file.filename}`;
            }

            const settings = await Setting.findOneAndUpdate({}, updateData, { new: true, upsert: true });
            res.json(settings);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    });
};