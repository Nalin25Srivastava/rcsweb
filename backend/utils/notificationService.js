const axios = require('axios');

const sendNotification = async (resumeData) => {
    const adminPhone = process.env.ADMIN_NOTIFICATION_PHONE || '9950962509';
    const smsApiKey = process.env.FAST2SMS_API_KEY;
    
    const { firstName, lastName, phone, functionalArea } = resumeData;
    
    const message = `RCS Placements: New Resume!\nName: ${firstName} ${lastName}\nArea: ${functionalArea}\nPhone: ${phone}`;

    // Log the notification to console
    console.log('--- NOTIFICATION LOG ---');
    console.log(`To: ${adminPhone}`);
    console.log(`Content: ${message}`);
    
    // SMS Notification (via Fast2SMS)
    if (smsApiKey) {
        try {
            const response = await axios.get('https://www.fast2sms.com/dev/bulkV2', {
                params: {
                    authorization: smsApiKey,
                    route: 'otp',
                    variables_values: message,
                    numbers: adminPhone
                }
            });
            console.log('Real SMS sent successfully:', response.data);
        } catch (error) {
            console.error('Failed to send real SMS:', error.response?.data || error.message);
        }
    } else {
        console.log('Note: Add FAST2SMS_API_KEY to .env to send real SMS alerts.');
    }
    
    console.log('-------------------------');

    return true;
};

module.exports = { sendNotification };
