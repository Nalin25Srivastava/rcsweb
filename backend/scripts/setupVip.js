const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');

dotenv.config({ path: path.join(__dirname, '../.env') });

const setupVip = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB...');

        const email = 'hitkarikusum.ngo@gmail.com';
        let user = await User.findOne({ email });

        if (user) {
            user.role = 'admin';
            user.isPaid = true;
            await user.save();
            console.log(`User ${email} updated to ADMIN and PAID status.`);
        } else {
            console.log(`User ${email} not found. They can register using the Admin secret 'rcsplacements2009' to become an admin.`);
        }

        process.exit();
    } catch (error) {
        console.error('Error setting up VIP user:', error);
        process.exit(1);
    }
};

setupVip();
