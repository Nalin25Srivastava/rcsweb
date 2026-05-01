const Contact = require('../models/Contact');

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

        // Send SMS Notification to Admin
        const { sendSMSNotification } = require('../utils/smsUtil');
        const smsMessage = `New Enquiry from RCS Web:\nName: ${fullName}\nPhone: ${phone}\nSubject: ${subject}\nMsg: ${message.substring(0, 50)}...`;
        await sendSMSNotification(smsMessage);

        res.status(201).json({
            message: 'Message sent successfully',
            contact
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    submitContact
};

