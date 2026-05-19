const Job = require('../models/Job');
const User = require('../models/User');
const axios = require('axios');

// Centralized Twilio SMS Dispatcher (No SDK required, highly stable)
const sendSMSNotification = async (to, message) => {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const from = process.env.TWILIO_FROM_NUMBER;

    console.log(`\n======================================================`);
    console.log(`[SMS NOTIFICATION DISPATCH]`);
    console.log(`To: ${to}`);
    console.log(`Message: ${message}`);
    console.log(`======================================================\n`);

    if (!accountSid || !authToken || !from) {
        console.log(`[TWILIO FALLBACK] SMS simulated successfully. Config TWILIO_ACCOUNT_SID in .env for real SMS.`);
        return { success: true, simulated: true };
    }

    try {
        // Build Twilio request
        const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
        const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
        
        const params = new URLSearchParams();
        params.append('To', to);
        params.append('From', from);
        params.append('Body', message);

        const response = await axios.post(url, params, {
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        console.log(`[TWILIO SUCCESS] Message SID: ${response.data.sid}`);
        return { success: true, sid: response.data.sid };
    } catch (error) {
        console.error(`[TWILIO ERROR] Failed to send SMS:`, error.response?.data || error.message);
        return { success: false, error: error.message };
    }
};

// Initialize Background Timer
const startJobTimerScheduler = () => {
    console.log('⏰ Job Expiry Timer Background Scheduler Initialized.');

    setInterval(async () => {
        try {
            const now = new Date();
            // Find all active timed jobs nearing expiration (under 30 minutes remaining) where notification hasn't been sent yet
            const alertThreshold = new Date(now.getTime() + 30 * 60 * 1000);

            const expiringJobs = await Job.find({
                timerActive: true,
                notificationSent: false,
                expiresAt: { $lte: alertThreshold, $gt: now }
            }).populate('creator');

            for (const job of expiringJobs) {
                if (job.creator && job.creator.mobileNo) {
                    const timeRemainingMs = job.expiresAt.getTime() - now.getTime();
                    const minutesRemaining = Math.max(0, Math.round(timeRemainingMs / 60000));

                    const message = `[RCS PLACEMENTS] Job Warning: Your job posting "${job.title}" is expiring soon! Only ${minutesRemaining} minutes remaining. Please visit your admin dashboard to end, restart, or extend this job.`;
                    
                    await sendSMSNotification(job.creator.mobileNo, message);
                    
                    // Mark as sent to prevent duplicate alerting
                    job.notificationSent = true;
                    await job.save();
                } else {
                    console.log(`[ALERT FAILED] Job "${job.title}" is expiring, but creator has no mobileNo set.`);
                    // Still set notificationSent to true to avoid log flooding
                    job.notificationSent = true;
                    await job.save();
                }
            }

            // Optional: Automatically expire jobs that have passed their expiresAt timestamp
            const expiredJobs = await Job.find({
                timerActive: true,
                expiresAt: { $lte: now }
            });

            for (const job of expiredJobs) {
                console.log(`[TIMER EXPIRED] Job "${job.title}" has reached its expiration time.`);
                job.timerActive = false;
                await job.save();
            }

        } catch (error) {
            console.error('Error in Job Expiry Timer scheduler loop:', error);
        }
    }, 30000); // Check every 30 seconds
};

module.exports = {
    startJobTimerScheduler,
    sendSMSNotification
};
