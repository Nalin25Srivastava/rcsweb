const axios = require('axios');

const sendNotification = async (resumeData) => {
    const adminPhone = process.env.ADMIN_NOTIFICATION_PHONE || '9950962509';
    const smsApiKey = process.env.FAST2SMS_API_KEY;
    const whatsappApiKey = process.env.WHATSAPP_API_KEY; // Using CallMeBot for WhatsApp
    
    const { firstName, lastName, phone, functionalArea } = resumeData;
    
    const message = `*RCS Placements: New Resume!*%0A*Name:* ${firstName} ${lastName}%0A*Area:* ${functionalArea}%0A*Phone:* ${phone}%0A*Contact:* https://wa.me/91${phone}`;
    const plainMessage = message.replace(/%0A/g, '\n').replace(/\*/g, '');

    // Log the notification to console
    console.log('--- NOTIFICATION LOG ---');
    console.log(`To: ${adminPhone}`);
    console.log(`Content: ${plainMessage}`);
    
    // 1. WhatsApp Notification (via CallMeBot)
    if (whatsappApiKey) {
        try {
            await axios.get(`https://api.callmebot.com/whatsapp.php?phone=91${adminPhone}&text=${message}&apikey=${whatsappApiKey}`);
            console.log('WhatsApp alert sent successfully via CallMeBot');
        } catch (error) {
            console.error('Failed to send WhatsApp alert:', error.message);
        }
    } else {
        console.log('Note: Add WHATSAPP_API_KEY to .env to send real WhatsApp alerts.');
    }

    // 2. SMS Notification (via Fast2SMS)
    if (smsApiKey) {
        try {
            const response = await axios.get('https://www.fast2sms.com/dev/bulkV2', {
                params: {
                    authorization: smsApiKey,
                    route: 'otp',
                    variables_values: plainMessage,
                    numbers: adminPhone
                }
            });
            console.log('Real SMS sent successfully:', response.data);
        } catch (error) {
            console.error('Failed to send real SMS:', error.response?.data || error.message);
        }
    }
    
    console.log('-------------------------');

    return true;
};

module.exports = { sendNotification };
