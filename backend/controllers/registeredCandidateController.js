const RegisteredCandidate = require('../models/RegisteredCandidate');

// @desc    Get all registered candidates
// @route   GET /api/registered-candidates
// @access  Public
const getRegisteredCandidates = async (req, res) => {
    try {
        const candidates = await RegisteredCandidate.find({}).sort({ registrationDate: -1 });
        res.json(candidates);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a registered candidate
// @route   POST /api/registered-candidates
// @access  Private/Admin
const createRegisteredCandidate = async (req, res) => {
    const { userId, name, email, phone, course, batch, status, image } = req.body;

    try {
        const candidate = await RegisteredCandidate.create({
            user: userId,
            name,
            email,
            phone,
            course,
            batch,
            status,
            image
        });

        res.status(201).json(candidate);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a registered candidate
// @route   PUT /api/registered-candidates/:id
// @access  Private/Admin
const updateRegisteredCandidate = async (req, res) => {
    try {
        const candidate = await RegisteredCandidate.findById(req.params.id);

        if (candidate) {
            candidate.name = req.body.name || candidate.name;
            candidate.email = req.body.email || candidate.email;
            candidate.phone = req.body.phone || candidate.phone;
            candidate.course = req.body.course || candidate.course;
            candidate.batch = req.body.batch || candidate.batch;
            candidate.status = req.body.status || candidate.status;
            candidate.image = req.body.image || candidate.image;

            const updatedCandidate = await candidate.save();
            res.json(updatedCandidate);
        } else {
            res.status(404).json({ message: 'Candidate not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a registered candidate
// @route   DELETE /api/registered-candidates/:id
// @access  Private/Admin
const deleteRegisteredCandidate = async (req, res) => {
    try {
        const candidate = await RegisteredCandidate.findById(req.params.id);

        if (candidate) {
            await candidate.deleteOne();
            res.json({ message: 'Candidate removed' });
        } else {
            res.status(404).json({ message: 'Candidate not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getRegisteredCandidates,
    createRegisteredCandidate,
    updateRegisteredCandidate,
    deleteRegisteredCandidate
};
