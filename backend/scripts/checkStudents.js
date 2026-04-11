const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const PlacedStudent = require('../models/PlacedStudent');

dotenv.config({ path: path.join(__dirname, '../.env') });

const checkDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const students = await PlacedStudent.find();
        console.log('Students count:', students.length);
        console.log('Students:', JSON.stringify(students, null, 2));
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkDb();
