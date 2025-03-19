const Customer = require('../models/Customer');
const bcrypt = require('bcryptjs');

exports.getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.find();
        res.json(customers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createCustomer = async (req, res) => {
    const { customerCode, fullName, phone, email, address, password } = req.body;
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

    const customer = new Customer({
        customerCode,
        fullName,
        phone,
        email,
        address,
        password: hashedPassword,
    });

    try {
        const newCustomer = await customer.save();
        res.status(201).json(newCustomer);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};