const Stat = require('../models/Stat');

// @desc    Get all stats
// @route   GET /api/stats
// @access  Public
const getStats = async (req, res) => {
    try {
        const stats = await Stat.find().sort({ order: 1 });
        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a stat
// @route   POST /api/stats
// @access  Private/Admin
const createStat = async (req, res) => {
    const { id, value, label, iconName, order } = req.body;

    if (!id || !value || !label || !iconName) {
        return res.status(400).json({ message: 'Please add required fields' });
    }

    try {
        const stat = await Stat.create({ id, value, label, iconName, order });
        res.status(201).json(stat);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a stat
// @route   PUT /api/stats/:id
// @access  Private/Admin
const updateStat = async (req, res) => {
    try {
        const stat = await Stat.findById(req.params.id);
        if (!stat) {
            return res.status(404).json({ message: 'Stat not found' });
        }
        
        const updatedStat = await Stat.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        res.status(200).json(updatedStat);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a stat
// @route   DELETE /api/stats/:id
// @access  Private/Admin
const deleteStat = async (req, res) => {
    try {
        const stat = await Stat.findById(req.params.id);
        if (!stat) {
            return res.status(404).json({ message: 'Stat not found' });
        }
        await stat.deleteOne();
        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getStats,
    createStat,
    updateStat,
    deleteStat
};
