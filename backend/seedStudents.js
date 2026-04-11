const mongoose = require('mongoose');
const dotenv = require('dotenv');
const PlacedStudent = require('./models/PlacedStudent');

dotenv.config();

const students = [
    {
        name: "Rahul Sharma",
        company: "Vipro India Ltd.",
        position: "Software Engineer",
        package: "6.5 LPA",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?fit=crop&q=80&w=400"
    },
    {
        name: "Priya Verma",
        company: "Accenture",
        position: "HR Manager",
        package: "5.2 LPA",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?fit=crop&q=80&w=400"
    },
    {
        name: "Ankit Gupta",
        company: "DCM Shriram",
        position: "Mechanical Engineer",
        package: "4.8 LPA",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?fit=crop&q=80&w=400"
    },
    {
        name: "Sanya Malhotra",
        company: "HDFC Bank",
        position: "Relationship Manager",
        package: "5.5 LPA",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?fit=crop&q=80&w=400"
    }
];

const seedStudents = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        // Clear existing placed students
        await PlacedStudent.deleteMany();
        
        // Insert new placed students
        await PlacedStudent.insertMany(students);
        
        console.log('Placed Students data seeded successfully');
        process.exit();
    } catch (error) {
        console.error('Error seeding students:', error);
        process.exit(1);
    }
};

seedStudents();
