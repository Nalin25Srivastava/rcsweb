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
        
        const { title, description, email, timerActive, durationMinutes } = jobData;

        const missing = [];
        if (!title || title.trim() === '') missing.push('Title');
        if (!email || email.trim() === '') missing.push('Contact Email');

        if (missing.length > 0) {
            console.log('Missing fields:', missing, jobData);
            return res.status(400).json({ 
                message: `Please add all required fields. Missing: ${missing.join(', ')}` 
            });
        }

        // Set creator reference
        jobData.creator = req.user._id;

        // Calculate expiresAt if timer is active
        if (timerActive === true || timerActive === 'true') {
            const minutes = Number(durationMinutes) || 30;
            jobData.expiresAt = new Date(Date.now() + minutes * 60 * 1000);
            jobData.notificationSent = false;
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

        // Recalculate expiry if timer properties were updated
        if (jobData.timerActive === true || jobData.timerActive === 'true') {
            // Only reset expiresAt if timer wasn't active before, or if durationMinutes was explicitly changed
            const wasActive = job.timerActive;
            const durationChanged = Number(jobData.durationMinutes) !== job.durationMinutes;
            
            if (!wasActive || durationChanged) {
                const minutes = Number(jobData.durationMinutes) || 30;
                jobData.expiresAt = new Date(Date.now() + minutes * 60 * 1000);
                jobData.notificationSent = false;
            }
        } else if (jobData.timerActive === false || jobData.timerActive === 'false') {
            jobData.expiresAt = null;
        }

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

// @desc    Restart a job timer
// @route   POST /api/jobs/:id/timer/restart
// @access  Private (Admin)
const restartJobTimer = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        
        if (!job.timerActive) {
            return res.status(400).json({ message: 'Timer is not active for this job' });
        }

        const duration = job.durationMinutes || 30; // fallback to 30 mins
        job.expiresAt = new Date(Date.now() + duration * 60 * 1000);
        job.notificationSent = false;
        
        await job.save();
        await logAdminAction(req.user, 'UPDATE', 'Job', `Restarted timer for job: ${job.title} (${duration} mins)`);
        
        res.status(200).json(job);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Extend a job timer
// @route   POST /api/jobs/:id/timer/extend
// @access  Private (Admin)
const extendJobTimer = async (req, res) => {
    const { minutes } = req.body;
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        if (!job.timerActive) {
            return res.status(400).json({ message: 'Timer is not active for this job' });
        }

        const extendBy = Number(minutes) || 30;
        
        // If expired, calculate extension from now. Otherwise from current expiresAt
        const baseTime = job.expiresAt && job.expiresAt.getTime() > Date.now() 
            ? job.expiresAt.getTime() 
            : Date.now();
            
        job.expiresAt = new Date(baseTime + extendBy * 60 * 1000);
        job.durationMinutes = (job.durationMinutes || 0) + extendBy;
        
        // Reset notification if new time is > 30 minutes
        if ((job.expiresAt.getTime() - Date.now()) > 30 * 60 * 1000) {
            job.notificationSent = false;
        }

        await job.save();
        await logAdminAction(req.user, 'UPDATE', 'Job', `Extended timer for job: ${job.title} by ${extendBy} mins`);

        res.status(200).json(job);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    End a job timer (make active over)
// @route   POST /api/jobs/:id/timer/end
// @access  Private (Admin)
const endJobTimer = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        job.timerActive = false;
        job.expiresAt = new Date(); // set to expired now
        
        await job.save();
        await logAdminAction(req.user, 'UPDATE', 'Job', `Ended timer for job: ${job.title}`);

        res.status(200).json(job);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getJobs,
    createJob,
    updateJob,
    deleteJob,
    restartJobTimer,
    extendJobTimer,
    endJobTimer
};
