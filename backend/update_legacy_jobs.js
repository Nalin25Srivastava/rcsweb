const mongoose = require('mongoose');
const Job = require('./models/Job');
require('dotenv').config();

const updates = [
    {
        title: "DELIVERY BOY",
        update: {
            description: `URGENT HIRING FOR ONLINE SHOPPING COMPANY

PROFILE : Delivery Executive

Note: Must have own bike and valid driving license

QUALIFICATION: 10th Pass / 12th Pass

Salary:-12k-15k + Petrol Allowance

Time:-8am to 5pm
 
Location -Kota (All Areas)
 
Male candidates Can apply

AGE : 18-35 YEARS

CONTACT_RCS PLACEMENT KOTA
(r.c.sindiaconcept@gmail.com)
*Website: www.rcsconsultant.com

Job seeker call on_📞, 8104083002,  9783945080

CALLING TIME_ 10:00am to 5:00pm`
        }
    },
    {
        title: "HR Recruitment Specialist",
        update: {
            description: `URGENT HIRING FOR CORPORATE OFFICE

PROFILE : HR Recruiter

Note: Excellent communication and negotiation skills required

QUALIFICATION: MBA (HR) / Graduate with experience

Salary:-15k-25k

Time:-10am to 6pm
 
Location -Kota (Aerodrome Circle)
 
Female candidate Can apply

AGE : 22-30 YEARS

CONTACT_RCS PLACEMENT KOTA
(r.c.sindiaconcept@gmail.com)
*Website: www.rcsconsultant.com

Job seeker call on_📞, 9783945080, 8209635081

CALLING TIME_ 10:00am to 5:00pm`
        }
    },
    {
        title: "Marketing Executive",
        update: {
            description: `URGENT HIRING FOR SALES & MARKETING

PROFILE : Field Marketing Executive

Note: Proficiency in local market and digital tools is a plus

QUALIFICATION: Graduate (Any Stream)

Salary:-15k-20k + Incentives

Time:-10am to 7pm
 
Location -Kota (Commercial Areas)
 
Male & female candidate Can apply

AGE : 21-30 YEARS

CONTACT_RCS PLACEMENT KOTA
(r.c.sindiaconcept@gmail.com)
*Website: www.rcsconsultant.com

Job seeker call on_📞, 8209635081, 8104083002

CALLING TIME_ 10:00am to 5:00pm`
        }
    },
    {
        title: "Software Developer",
        update: {
            description: `URGENT HIRING FOR TECH STARTUP

PROFILE : React JS Developer

Note: Seeking a React developer with knowledge of modern frontend frameworks and UI design

QUALIFICATION: B.E/B.Tech (CS/IT) / MCA

Salary:-25k-40k

Time:-10am to 7pm (Mon-Fri)
 
Location -Kota (Work from Office)
 
Male & female candidate Can apply

AGE : 22-35 YEARS

CONTACT_RCS PLACEMENT KOTA
(r.c.sindiaconcept@gmail.com)
*Website: www.rcsconsultant.com

Job seeker call on_📞, 8104083002, 8209635081

CALLING TIME_ 10:00am to 5:00pm`
        }
    }
];

const updateJobs = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for update...');
        
        for (const item of updates) {
            const result = await Job.findOneAndUpdate(
                { title: item.title },
                { $set: item.update },
                { new: true }
            );
            if (result) {
                console.log(`Updated: ${item.title}`);
            } else {
                console.log(`Job not found: ${item.title}`);
            }
        }
        
        await mongoose.disconnect();
        console.log('Update complete.');
        process.exit(0);
    } catch (err) {
        console.error('Update Error:', err.message);
        process.exit(1);
    }
};

updateJobs();
