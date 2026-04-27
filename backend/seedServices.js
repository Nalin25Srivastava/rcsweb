const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const dns = require('dns');
const Service = require('./models/Service');

// Fix for MongoDB SRV lookup issues
dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config({ path: path.join(__dirname, '.env') });

const services = [
    {
        id: 'career-development',
        title: 'Career Development',
        shortDesc: 'Strategic career mapping and professional optimization.',
        description: 'Our Career Development program is designed to transform candidates into high-value professionals. We provide personalized roadmaps that align your skills with market demands, ensuring you don\'t just find a job, but build a career.',
        features: ['Resume & LinkedIn Optimization', 'Personal Branding Workshops', 'Interview Simulation & Coaching', 'Long-term Career Pathing'],
        iconName: 'GraduationCap',
        color: 'bg-emerald-50 text-emerald-600',
        borderColor: 'border-emerald-200',
        accentColor: 'text-emerald-500',
        order: 1
    },
    {
        id: 'permanent-recruitment',
        title: 'Permanent Recruitment',
        shortDesc: 'Strategic hiring for long-term organizational growth.',
        description: 'We specialize in finding the "perfect fit" for permanent roles. Our deep-dive screening process evaluates not just technical competency, but cultural alignment, ensuring high retention rates and immediate impact for organizations.',
        features: ['Executive Search & Headhunting', 'Technical Competency Mapping', 'Cultural Alignment Assessment', 'Retention Strategy Consulting'],
        iconName: 'Users',
        color: 'bg-blue-50 text-blue-600',
        borderColor: 'border-blue-200',
        accentColor: 'text-blue-500',
        order: 2
    },
    {
        id: 'campus-recruitment',
        title: 'Campus Recruitment',
        shortDesc: 'Connecting fresh talent with industry leaders.',
        description: 'Bridging the gap between academia and the corporate world. We partner with premier institutions to identify raw talent and facilitate seamless transitions into professional roles through structured campus drives.',
        features: ['University Relationship Management', 'Pre-placement Talk Orchestration', 'Aptitude & Technical Testing', 'On-campus Interview Logistics'],
        iconName: 'Briefcase',
        color: 'bg-amber-50 text-amber-600',
        borderColor: 'border-amber-200',
        accentColor: 'text-amber-500',
        order: 3
    },
    {
        id: 'it-services',
        title: 'IT Services',
        shortDesc: 'Specialized staffing for the technology ecosystem.',
        description: 'From software architecture to cybersecurity, our IT services focus on placing highly skilled tech professionals in roles where they can drive innovation. We understand the nuances of modern tech stacks and agile methodologies.',
        features: ['Full-stack Developer Sourcing', 'Cloud & DevOps Specialists', 'Cybersecurity Expert Placement', 'Project-based Tech Staffing'],
        iconName: 'Monitor',
        color: 'bg-purple-50 text-purple-600',
        borderColor: 'border-purple-200',
        accentColor: 'text-purple-500',
        order: 4
    },
    {
        id: 'marketing',
        title: 'Marketing',
        shortDesc: 'Finding growth drivers and brand builders.',
        description: 'In a digital-first world, your marketing team is your growth engine. We source professionals who blend creative thinking with data-driven strategy to build brands and scale customer acquisition across all channels.',
        features: ['Performance Marketing Leads', 'Brand Strategy Consultants', 'Content & Creative Directors', 'SEO & SEM Specialists'],
        iconName: 'BarChart',
        color: 'bg-rose-50 text-rose-600',
        borderColor: 'border-rose-200',
        accentColor: 'text-rose-500',
        order: 5
    },
    {
        id: 'temporary-recruitment',
        title: 'Temporary Recruitment',
        shortDesc: 'Flexible staffing for dynamic business needs.',
        description: 'Agility is key to modern business. Our temporary recruitment services provide rapid access to skilled professionals for short-term projects, seasonal surges, or specialized tasks without the long-term overhead.',
        features: ['Contractual Talent Sourcing', 'Seasonal Peak Management', 'Replacement Staffing Solutions', 'Compliance & Payroll Handling'],
        iconName: 'Clock',
        color: 'bg-indigo-50 text-indigo-600',
        borderColor: 'border-indigo-200',
        accentColor: 'text-indigo-500',
        order: 6
    }
];

const seedServices = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear existing services
        await Service.deleteMany();
        console.log('Cleared existing services');

        // Insert new services
        await Service.insertMany(services);
        console.log('Seeded services successfully');

        process.exit();
    } catch (error) {
        console.error('Error seeding services:', error);
        process.exit(1);
    }
};

seedServices();
