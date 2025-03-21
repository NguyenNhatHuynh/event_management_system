// backend/routes/customerRoutes.js
const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');

// Lấy danh sách khách hàng
router.get('/', async (req, res) => {
    try {
        const customers = await Customer.find();
        res.json(customers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Thêm khách hàng mới
router.post('/', async (req, res) => {
    const { customerCode, fullName, phone, email, address } = req.body;
    try {
        const existingCustomer = await Customer.findOne({ customerCode });
        if (existingCustomer) {
            return res.status(400).json({ message: 'Mã khách hàng đã tồn tại' });
        }

        const customer = new Customer({
            customerCode,
            fullName,
            phone,
            email,
            address,
        });

        const newCustomer = await customer.save();
        res.status(201).json(newCustomer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Cập nhật thông tin khách hàng
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { customerCode, fullName, phone, email, address } = req.body;

    try {
        const customer = await Customer.findById(id);
        if (!customer) {
            return res.status(404).json({ message: 'Khách hàng không tồn tại' });
        }

        // Kiểm tra mã khách hàng mới có bị trùng không
        const existingCustomer = await Customer.findOne({ customerCode, _id: { $ne: id } });
        if (existingCustomer) {
            return res.status(400).json({ message: 'Mã khách hàng đã tồn tại' });
        }

        customer.customerCode = customerCode;
        customer.fullName = fullName;
        customer.phone = phone;
        customer.email = email;
        customer.address = address;

        const updatedCustomer = await customer.save();
        res.json(updatedCustomer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Xóa khách hàng
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const customer = await Customer.findById(id);
        if (!customer) {
            return res.status(404).json({ message: 'Khách hàng không tồn tại' });
        }

        await customer.deleteOne();
        res.json({ message: 'Xóa khách hàng thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;