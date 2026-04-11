const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const createTestUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        
        // Remove existing test user if exists
        await User.deleteOne({ email: 'test@rcs.com' });
        
        const testUser = await User.create({
            name: 'Security Test',
            email: 'test@rcs.com',
            password: 'password123'
        });
        
        console.log(`Test user created:`);
        console.log(`Email: ${testUser.email}`);
        console.log(`Password: password123`);
        
        await mongoose.connection.close();
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

createTestUser();
