const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');

dotenv.config({ path: path.join(__dirname, '../.env') });

const setupAdmin = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB.');

        const email = 'khmbvs26@gmail.com';
        let user = await User.findOne({ email });

        if (user) {
            user.role = 'admin';
            user.isPaid = true;
            await user.save();
            console.log(`User ${email} successfully promoted to ADMIN and PAID status.`);
        } else {
            console.log(`User ${email} NOT found in database.`);
            console.log(`The user will be automatically created as an ADMIN when they register or login via Google.`);
        }

        process.exit(0);
    } catch (error) {
        console.error('Error during setup:', error);
        process.exit(1);
    }
};

setupAdmin();
