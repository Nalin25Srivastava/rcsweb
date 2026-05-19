const Job = require('../models/Job');
const path = require('path');
const fs = require('fs');
const { logAdminAction } = require('../utils/auditLogger');

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

// Helper to handle array fields from strings
const handleArrayFields = (data) => {
    const updated = { ...data };
    if (typeof data.profiles === 'string') {
        updated.profiles = data.profiles.split(',').map(s => s.trim()).filter(s => s !== '');
    }
    if (typeof data.contactNumbers === 'string') {
        updated.contactNumbers = data.contactNumbers.split(',').map(s => s.trim()).filter(s => s !== '');
    }
    return updated;
};

// @desc    Create a job
// @route   POST /api/jobs
// @access  Private (Admin)
const createJob = async (req, res) => {
    try {
        console.log('Received job data:', req.body);
        const jobData = handleArrayFields(req.body);
        
        const { title, description, email } = jobData;

        const missing = [];
        if (!title || title.trim() === '') missing.push('Title');
        if (!description || description.trim() === '') missing.push('Description');
        if (!email || email.trim() === '') missing.push('Contact Email');

        if (missing.length > 0) {
            console.log('Missing fields:', missing, jobData);
            return res.status(400).json({ 
                message: `Please add all required fields. Missing: ${missing.join(', ')}` 
            });
        }

        const job = await Job.create(jobData);
        await logAdminAction(req.user, 'CREATE', 'Job', `Created job: ${title}`);
        res.status(201).json(job);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Private (Admin)
const updateJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        const jobData = handleArrayFields(req.body);

        const updatedJob = await Job.findByIdAndUpdate(
            req.params.id,
            jobData,
            { new: true, runValidators: true }
        );
        await logAdminAction(req.user, 'UPDATE', 'Job', `Updated job: ${updatedJob.title}`);

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
        await logAdminAction(req.user, 'DELETE', 'Job', `Deleted job: ${job.title}`);

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
