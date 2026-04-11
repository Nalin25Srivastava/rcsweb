const Contact = require('../models/Contact');
const XLSX = require('xlsx');

// @desc    Submit contact form
// @route   POST /api/contacts
// @access  Public
const submitContact = async (req, res) => {
    const { fullName, phone, email, subject, message } = req.body;

    if (!fullName || !phone || !email || !subject || !message) {
        return res.status(400).json({ message: 'Please add all fields' });
    }

    try {
        const contact = await Contact.create({
            fullName,
            phone,
            email,
            subject,
            message
        });
        res.status(201).json({
            message: 'Message sent successfully',
            contact
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Download contacts as Excel
// @route   GET /api/contacts/download
// @access  Public (Should be protected in production)
const downloadContactsExcel = async (req, res) => {
    try {
        const contacts = await Contact.find().lean();
        
        if (contacts.length === 0) {
            return res.status(404).json({ message: 'No contacts found' });
        }

        // Format data for Excel
        const data = contacts.map(c => ({
            'Full Name': c.fullName,
            'Phone': c.phone,
            'Email': c.email,
            'Subject': c.subject,
            'Message': c.message,
            'Submitted At': c.createdAt
        }));

        // Create workbook and worksheet
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Contacts');

        // Generate buffer
        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        // Set headers for download
        res.setHeader('Content-Disposition', 'attachment; filename=contacts.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        
        res.send(buffer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    submitContact,
    downloadContactsExcel
};
