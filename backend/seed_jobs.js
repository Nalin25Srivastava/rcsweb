const mongoose = require('mongoose');
const Job = require('./models/Job');
require('dotenv').config();

const jobsToSeed = [
    {
        title: "OFFICE RECEPTIONIST (REAL ESTATE)",
        email: "hr.realty@rcsplacement.com",
        description: `URGENT HIRING FOR REPUTED REAL ESTATE COMPANY

PROFILE : Receptionist

Note: Must have good communication skills & professional attire

QUALIFICATION: Graduate (Any Stream)

Salary:-15k-22k

Time:-9am to 6pm
 
Location -Kota (Jhalawar Road)
 
Female candidates preferred

AGE : 20-30 YEARS

INTERVIEWS ARE GOING ON

CONTACT_RCS PLACEMENT KOTA
(r.c.sindiaconcept@gmail.com)
*Website: www.rcsconsultant.com

Job seeker call on_📞, 8104083002, 9783945080

CALLING TIME_ 10:00am to 5:00pm`
    },
    {
        title: "GRAPHIC DESIGNER (AD AGENCY)",
        email: "design.jobs@rcsplacement.com",
        description: `URGENT HIRING FOR CREATIVE AD AGENCY

PROFILE : Graphic Designer

Note: Proficiency in Photoshop, Illustrator & CorelDraw is mandatory

QUALIFICATION: Diploma/Degree in Graphic Design

Salary:-18k-25k (Negotiable)

Time:-10am to 7pm
 
Location -Kota (Vigyan Nagar)
 
Male & female candidate Can apply

AGE : 21-35 YEARS

PORTFOLIO REQUIRED FOR INTERVIEW

CONTACT_RCS PLACEMENT KOTA
(r.c.sindiaconcept@gmail.com)
*Website: www.rcsconsultant.com

Job seeker call on_📞, 8209635081, 8104083002

CALLING TIME_ 11:00am to 4:00pm`
    },
    {
        title: "CIVIL ENGINEER (CONSTRUCTION)",
        email: "civil.hiring@rcsplacement.com",
        description: `URGENT HIRING FOR ROYAL CONSTRUCTION GROUP

PROFILE : Site Engineer (Civil)

Note: Minimum 2 years onto site experience required

QUALIFICATION: B.Tech / Diploma (Civil)

Salary:-20k-30k + Site Allowances

Time:-8am to 5pm (Site Hours)
 
Location -Kota (Bundi Road Project)
 
Male candidates only

AGE : 22-40 YEARS

IMMEDIATE JOINERS PREFERRED

CONTACT_RCS PLACEMENT KOTA
(r.c.sindiaconcept@gmail.com)
*Website: www.rcsconsultant.com

Job seeker call on_📞, 9783945080, 8209635081

CALLING TIME_ 10:00am to 6:00pm`
    },
    {
        title: "TELECALLER (BPO PROCESS)",
        email: "bpo.hr@rcsplacement.com",
        description: `URGENT HIRING FOR INTERNATIONAL BPO

PROFILE : Customer Care Executive

Note: Basic knowledgeable of computer & typing speed 25 wpm

QUALIFICATION: 12th Pass / Undergraduate / Graduate

Salary:-12k-18k + Huge Incentives

Time:-9:30am to 6:30pm
 
Location -Kota (Indra Vihar)
 
Male & female candidate Can apply

AGE : 18-28 YEARS

WALK-IN INTERVIEWS DAILY

CONTACT_RCS PLACEMENT KOTA
(r.c.sindiaconcept@gmail.com)
*Website: www.rcsconsultant.com

Job seeker call on_📞, 8104083002, 8209635081

CALLING TIME_ 10:00am to 5:00pm`
    }
];

const seedAdditionalJobs = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB...');
        
        const result = await Job.insertMany(jobsToSeed);
        console.log(`Successfully seeded ${result.length} new jobs!`);
        
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB.');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding jobs:', err.message);
        process.exit(1);
    }
};

seedAdditionalJobs();
