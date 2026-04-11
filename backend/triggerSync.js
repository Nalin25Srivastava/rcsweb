const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { syncPlacedStudentsExcelToDB } = require('./utils/excelSync');
const path = require('path');

dotenv.config();

const triggerSync = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const filePath = path.join(__dirname, 'placed_students.xlsx');
        console.log('Starting sync (this will also remove ID column if present)...');
        await syncPlacedStudentsExcelToDB(filePath);
        console.log('Done!');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.connection.close();
    }
};

triggerSync();
