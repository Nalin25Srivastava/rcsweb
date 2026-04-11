const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Job = require('./models/Job');

dotenv.config();

const jobs = [
    {
        title: "MAINTENANCE (AUTOMOBILE COMPANY)",
        description: `URGENT HIRING FOR AUTOMOBILE COMPANY

PROFILE : maintenance

Note: basic knowledgeable of computer

QUALIFICATION:ITI, Diploma (mechanical, electrical

Salary:-10k-15k

Time:-10am to 8pm
 
Location -kota(bhamashah Mandi)
 
Male & female candidate  Can apply

AGE : 18-28 YEARS

 INTERVIEW ARE GOING ON

CONTACT_RCS PLACEMENT KOTA
(r.c.sindiaconcept@gmail.com)
*Website: www.rcsconsultant.com

Job seeker call on_📞, 8104083002,  9783945080,
8209635081

CALLING TIME_ 10:00am to 5:00pm`,
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

const seedJobs = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        // Clear existing jobs
        await Job.deleteMany();
        
        // Insert new jobs
        await Job.insertMany(jobs);
        
        console.log('Jobs data seeded successfully');
        process.exit();
    } catch (error) {
        console.error('Error seeding jobs:', error);
        process.exit(1);
    }
};

seedJobs();
