const Contract = require('../models/Contract');

exports.getAllContracts = async (req, res) => {
    try {
        const contracts = await Contract.find()
            .populate('customerId', 'fullName phone')
            .populate('eventTypeId', 'name basePrice');
        res.json(contracts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createContract = async (req, res) => {
    const contract = new Contract({
        contractCode: req.body.contractCode,
        customerId: req.body.customerId,
        eventTypeId: req.body.eventTypeId,
        eventDate: req.body.eventDate,
        location: req.body.location,
        totalCost: req.body.totalCost,
        deposit: req.body.deposit,
        status: req.body.status,
    });

    try {
        const newContract = await contract.save();
        res.status(201).json(newContract);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};