const axios = require('axios');

/**
 * Sends an SMS notification to the admin using Fast2SMS
 * @param {string} message - The message to send
 * @returns {Promise<any>}
 */
const sendSMSNotification = async (message) => {
    const apiKey = process.env.FAST2SMS_API_KEY;
    const adminPhone = process.env.ADMIN_NOTIFICATION_PHONE || '9950962509';

    if (!apiKey) {
        console.warn('SMS Warning: FAST2SMS_API_KEY is missing in .env. Skipping SMS notification.');
        return null;
    }

    try {
        const response = await axios.post('https://www.fast2sms.com/dev/bulkV2', {
            message: message,
            language: 'english',
            route: 'q',
            numbers: adminPhone,
        }, {
            headers: {
                'authorization': apiKey
            }
        });
        
        console.log('SMS Sent successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('SMS Error:', error.response?.data || error.message);
        return null;
    }
};

module.exports = { sendSMSNotification };
