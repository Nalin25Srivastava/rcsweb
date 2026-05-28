const SiteSetting = require('../models/SiteSetting');
const auditLogger = require('../utils/auditLogger');

// @desc    Get site settings
// @route   GET /api/settings
// @access  Public
const getSettings = async (req, res) => {
    try {
        let settings = await SiteSetting.findOne();
        if (!settings) {
            settings = await SiteSetting.create({});
        }
        res.status(200).json(settings);
    } catch (error) {
        console.error('Get Settings Error:', error);
        res.status(500).json({ message: 'Server error fetching settings' });
    }
};

// @desc    Update site settings
// @route   PUT /api/settings
// @access  Private/Admin
const updateSettings = async (req, res) => {
    try {
        let settings = await SiteSetting.findOne();
        if (!settings) {
            settings = await SiteSetting.create(req.body);
        } else {
            // Merge changes
            settings.contact = { ...settings.contact, ...(req.body.contact || {}) };
            settings.about = { ...settings.about, ...(req.body.about || {}) };
            await settings.save();
        }
        
        await auditLogger.log(req.user._id, 'UPDATE_SETTINGS', 'Site settings updated');

        res.status(200).json(settings);
    } catch (error) {
        console.error('Update Settings Error:', error);
        res.status(500).json({ message: 'Server error updating settings' });
    }
};

module.exports = {
    getSettings,
    updateSettings
};
