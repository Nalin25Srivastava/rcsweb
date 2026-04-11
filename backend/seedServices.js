const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Service = require('./models/Service');

dotenv.config();

const services = [
    {
        title: "IT Management",
        description: "We are one of the leading provider of innovative IT solutions offering Custom software development, IT infrastructure management, cloud solutions, and strategic technology consulting. Our team ensures your business stays ahead in the digital landscape by providing scalable and secure technological frameworks tailored to your unique requirements."
    },
    {
        title: "Contract Staffing",
        description: "We bring you the innovative staffing solutions which are agile enough to meet the dynamic needs of modern business environments. Whether you need temporary talent for a specific project or additional resources during peak periods, our contract staffing services provide the flexibility and expertise required to maintain productivity without long-term overhead costs."
    },
    {
        title: "Campus Recruitment",
        description: "rcsconsultant.com is an expert provider of campus hiring solutions and we are dedicated to bridging the gap between academia and the corporate world. We facilitate end-to-end recruitment drives in leading colleges and universities, identifying fresh talent that brings energy, innovation, and updated skill sets to your growing organization."
    },
    {
        title: "Permanent Recruitment",
        description: "RCS Consultant is at the centre of connecting people with experience and providing organizations with top talent for permanent roles. We conduct rigorous screening, behavioral assessments, and skill verification to ensure that the candidates we present not only possess the necessary technical expertise but also align perfectly with your company's culture and long-term vision."
    },
    {
        title: "Workforce Solutions",
        description: "Our Recruitment Process Outsourcing (RPO) offering sources and attracts high-quality candidates to meet your specific needs. From handling localized recruitment drives to managing high-volume global staffing requirements, we leverage advanced sourcing technologies and expert talent scouts to optimize your talent acquisition cycle and reduce time-to-hire."
    },
    {
        title: "Career Development & Training",
        description: "An effective career management program designed to help individuals and organizations achieve their highest potential. We offer workshops, personalized coaching, and specialized training programs that focus on both soft skills and technical proficiency, empowering your workforce to adapt to evolving industry standards and drive organizational success."
    }
];

const seedServices = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        // Clear existing services
        await Service.deleteMany();
        
        // Insert new services
        await Service.insertMany(services);
        
        console.log('Services data seeded successfully');
        process.exit();
    } catch (error) {
        console.error('Error seeding services:', error);
        process.exit(1);
    }
};

seedServices();
