const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    adminId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    adminName: { 
        type: String,
        required: true
    },
    action: { 
        type: String, 
        required: true,
        enum: ['CREATE', 'UPDATE', 'DELETE']
    },
    entityType: { 
        type: String, 
        required: true 
    },
    entityId: { 
        type: mongoose.Schema.Types.ObjectId 
    },
    details: { 
        type: String 
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
