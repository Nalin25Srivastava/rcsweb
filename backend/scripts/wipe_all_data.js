const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env from backend directory
dotenv.config({ path: path.join(__dirname, '../.env') });

const wipeAllData = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/rcs_placements';
        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB:', mongoURI);

        const collections = await mongoose.connection.db.collections();
        
        for (let collection of collections) {
            const result = await collection.deleteMany({});
            console.log(`Deleted ${result.deletedCount} documents from ${collection.collectionName}`);
        }

        console.log('Database wipe complete.');
        process.exit(0);
    } catch (error) {
        console.error('Error during wipe:', error);
        process.exit(1);
    }
};

wipeAllData();
