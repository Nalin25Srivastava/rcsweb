const Job = require('../models/Job');
const path = require('path');
const fs = require('fs');

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
    try {
        const jobs = await Job.find().sort({ createdAt: -1 });
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a job
// @route   POST /api/jobs
// @access  Public (for seeding/admin)
const createJob = async (req, res) => {
    const { 
        title, 
        description, 
        email, 
        companyName, 
        location, 
        salary, 
        qualification, 
        ageLimit, 
        gender, 
        dutyTime, 
        profiles, 
        contactNumbers,
        job_posting // New structured field
    } = req.body;

    const requiredFields = { title: 'Job Title', description: 'Job Description', email: 'Contact Email', companyName: 'Company Name', location: 'Location', salary: 'Salary' };
    const missingFields = Object.keys(requiredFields).filter(field => !req.body[field]);

    if (missingFields.length > 0) {
        return res.status(400).json({ 
            message: `Missing required fields: ${missingFields.map(f => requiredFields[f]).join(', ')}` 
        });
    }

    try {
        const job = await Job.create({ 
            title, 
            description, 
            email,
            companyName,
            location,
            salary,
            qualification,
            ageLimit,
            gender,
            dutyTime,
            profiles,
            contactNumbers,
            job_posting // Save structured data if provided
        });

        res.status(201).json(job);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Public (for admin)
const updateJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        const updatedJob = await Job.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json(updatedJob);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Public (for admin)
const deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        await job.deleteOne();

        res.status(200).json({ id: req.params.id, message: 'Job removed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getJobs,
    createJob,
    updateJob,
    deleteJob
};
