// backend/controllers/contractController.js
const Contract = require('../models/Contract');

exports.getContracts = async (req, res) => {
    try {
        const contracts = await Contract.find()
            .populate('customerId')
            .populate('eventTypeId');
        res.json(contracts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createContract = async (req, res) => {
    try {
        const contract = new Contract(req.body);
        await contract.save();
        res.status(201).json(contract);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateContract = async (req, res) => {
    try {
        const contract = await Contract.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(contract);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteContract = async (req, res) => {
    try {
        await Contract.findByIdAndDelete(req.params.id);
        res.json({ message: 'Contract deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};