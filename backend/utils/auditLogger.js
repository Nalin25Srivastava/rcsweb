const AuditLog = require('../models/AuditLog');

const logAdminAction = async (user, action, entityType, details = '') => {
    try {
        if (!user || user.role !== 'admin') return;
        
        await AuditLog.create({
            adminId: user._id,
            adminName: user.name,
            action,
            entityType,
            details
        });
    } catch (error) {
        console.error('Failed to create audit log:', error);
    }
};

module.exports = { logAdminAction };
