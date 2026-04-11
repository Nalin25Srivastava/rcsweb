const mongoose = require('mongoose');
const Job = require('./models/Job');
require('dotenv').config();

const checkDescriptions = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const jobs = await Job.find({ title: { $nin: ["OFFICE RECEPTIONIST (REAL ESTATE)", "GRAPHIC DESIGNER (AD AGENCY)", "CIVIL ENGINEER (CONSTRUCTION)", "TELECALLER (BPO PROCESS)"] } });
        
        jobs.forEach(j => {
            console.log(`Title: ${j.title}`);
            console.log(`Description: ${j.description}`);
            console.log('-------------------');
        });
        
        await mongoose.disconnect();
    } catch (err) {
        console.error(err.message);
    }
};

checkDescriptions();
