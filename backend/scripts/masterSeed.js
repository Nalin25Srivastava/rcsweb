const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const Job = require('../models/Job');
const Service = require('../models/Service');
const PlacedStudent = require('../models/PlacedStudent');
const CarouselSlide = require('../models/CarouselSlide');
const Stat = require('../models/Stat');

const jobs = [
    {
        title: "MAINTENANCE (AUTOMOBILE COMPANY)",
        description: `URGENT HIRING FOR AUTOMOBILE COMPANY\n\nPROFILE : maintenance\n\nNote: basic knowledgeable of computer\n\nQUALIFICATION:ITI, Diploma (mechanical, electrical\n\nSalary:-10k-15k\n\nTime:-10am to 8pm\n \nLocation -kota(bhamashah Mandi)\n \nMale & female candidate  Can apply\n\nAGE : 18-28 YEARS\n\n INTERVIEW ARE GOING ON\n\nCONTACT_RCS PLACEMENT KOTA\n(r.c.sindiaconcept@gmail.com)\n*Website: www.rcsconsultant.com\n\nJob seeker call on_📞, 8104083002,  9783945080,\n8209635081\n\nCALLING TIME_ 10:00am to 5:00pm`,
        email: "r.c.sindiaconcept@gmail.com"
    },
    {
        title: "DELIVERY BOY",
        description: "URGENTLY REQUIRED MALE CANDIDATES FOR WELL KNOWN ONLINE SHOPPING COMPANY",
        email: "HR@rcsconsultant.com"
    },
    {
        title: "HR Recruitment Specialist",
        description: "The person would be responsible for carrying out recruitment activity for IT & Non-IT domain.",
        email: "HR@rcsconsultant.com"
    },
    {
        title: "Marketing Executive",
        description: "Looking for enthusiastic candidates to handle digital and field marketing campaigns.",
        email: "HR@rcsconsultant.com"
    },
    {
        title: "Software Developer",
        description: "Seeking a React developer with knowledge of modern frontend frameworks and UI design.",
        email: "HR@rcsconsultant.com"
    },
    {
        title: "Accounts Manager",
        description: "Experienced candidate required to manage financial statements and tax filings.",
        email: "HR@rcsconsultant.com"
    },
    {
        title: "Customer Support",
        description: "Fluent English and Hindi speaking candidates for global customer service operations.",
        email: "HR@rcsconsultant.com"
    },
    {
        title: "Graphic Designer",
        description: "Creative individual with expertise in Adobe Creative Suite and brand identity design.",
        email: "HR@rcsconsultant.com"
    },
    {
        title: "SEO Specialist",
        description: "Expertise in search engine optimization, keyword research, and traffic analysis.",
        email: "HR@rcsconsultant.com"
    }
];

const services = [
    {
        title: "IT Management",
        description: "We are one of the leading provider of innovative IT solutions offering Custom software development, IT infrastructure management, cloud solutions, and strategic technology consulting."
    },
    {
        title: "Contract Staffing",
        description: "We bring you the innovative staffing solutions which are agile enough to meet the dynamic needs of modern business environments."
    },
    {
        title: "Campus Recruitment",
        description: "rcsconsultant.com is an expert provider of campus hiring solutions and we are dedicated to bridging the gap between academia and the corporate world."
    },
    {
        title: "Permanent Recruitment",
        description: "RCS Consultant is at the centre of connecting people with experience and providing organizations with top talent for permanent roles."
    },
    {
        title: "Workforce Solutions",
        description: "Our Recruitment Process Outsourcing (RPO) offering sources and attracts high-quality candidates to meet your specific needs."
    },
    {
        title: "Career Development & Training",
        description: "An effective career management program designed to help individuals and organizations achieve their highest potential."
    }
];

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

const slides = [
    {
        url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1920',
        title: 'RCS Placements',
        subtitle: 'Rise Your Career With Success',
        order: 1
    },
    {
        url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1920',
        title: 'RCS Consultancy',
        subtitle: 'Rise Your Career With Success',
        order: 2
    },
    {
        url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1920',
        title: 'Business Consultancy',
        subtitle: 'Rise Your Career With Success',
        order: 3
    }
];

const stats = [
    { id: "placements", value: "5000+", label: "Placements", iconName: "Briefcase", order: 1 },
    { id: "universities", value: "300+", label: "Universities", iconName: "School", order: 2 },
    { id: "partners", value: "100+", label: "Hiring Partners", iconName: "People", order: 3 },
    { id: "success-rate", value: "98%", label: "Success Rate", iconName: "TrendingUp", order: 4 }
];

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for master seeding...');

        // Clear existing data
        await Job.deleteMany();
        await Service.deleteMany();
        await PlacedStudent.deleteMany();
        await CarouselSlide.deleteMany();
        await Stat.deleteMany();

        // Insert new data
        await Job.insertMany(jobs);
        await Service.insertMany(services);
        await PlacedStudent.insertMany(students);
        await CarouselSlide.insertMany(slides);
        await Stat.insertMany(stats);

        console.log('Master data seeded successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding master data:', error);
        process.exit(1);
    }
};

seedData();
