const mongoose = require('mongoose');

const siteSettingSchema = mongoose.Schema({
    contact: {
        address: { type: String, default: 'Building No. 645, Behind Allahabad Bank, In front of Gumanpura Thana, Aerodrome Circle, Kota, Rajasthan - 324001' },
        phoneNumbers: { type: String, default: '+91 8104083002, +91 9783945080, +91 8209635081\nMon-Sat, 10am to 5pm IST' },
        email: { type: String, default: 'r.c.sindiaconcept@gmail.com' },
        enterpriseEmail: { type: String, default: 'enterprise@rcsweb.com' }
    },
    about: {
        corePhilosophy: { type: String, default: "Recruitment & Consulting Services (RCS) is a premiere professional services firm focused exclusively on creating powerful synergies between top-tier talent and industry-leading organizations.\n\nWith over a decade of excellence in the staffing sector, we've developed proprietary methodologies for screening, mapping, and placing candidates globally. We don't just fill vacancies—we build high-performing teams infrastructure." },
        mission: { type: String, default: "To empower enterprises by delivering unparalleled human capital solutions, and to transform candidate careers by unlocking access to premium organizational environments." },
        vision: { type: String, default: "To be the global benchmark in recruiting ecosystems where technology, psychology, and organizational strategy converge to create perfect professional alignments." }
    }
}, { timestamps: true });

module.exports = mongoose.model('SiteSetting', siteSettingSchema);
