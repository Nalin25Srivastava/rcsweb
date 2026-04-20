const PlacedStudent = require('../models/PlacedStudent');

// @desc    Get all placed students
// @route   GET /api/placed-students
// @access  Public
const getPlacedStudents = async (req, res, next) => {
    try {
        // Fail fast if database is not connected
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ 
                success: false, 
                message: 'Database connection is currently unavailable. Please try again in 30 seconds.' 
            });
        }

        console.log('Fetching placed students...');
        const students = await PlacedStudent.find().sort({ placedDate: -1 });
        console.log(`Found ${students.length} students`);
        res.status(200).json(students);
    } catch (error) {
        console.error('Error in getPlacedStudents:', error);
        next(error);
    }
};


// @desc    Add a placed student
// @route   POST /api/placed-students
// @access  Private (Admin)
const createPlacedStudent = async (req, res) => {
    const { name, company, position, package: salaryPackage, image, placedDate } = req.body;

    if (!name || !company || !position || !salaryPackage) {
        return res.status(400).json({ message: 'Please add all required fields' });
    }

    try {
        const student = await PlacedStudent.create({
            name,
            company,
            position,
            compensation: salaryPackage,
            image,
            placedDate
        });

        res.status(201).json(student);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a placed student
// @route   PUT /api/placed-students/:id
// @access  Private (Admin)
const updatePlacedStudent = async (req, res) => {
    try {
        const student = await PlacedStudent.findById(req.params.id);

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const updatedStudent = await PlacedStudent.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json(updatedStudent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a placed student
// @route   DELETE /api/placed-students/:id
// @access  Private (Admin)
const deletePlacedStudent = async (req, res) => {
    try {
        const student = await PlacedStudent.findById(req.params.id);

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        await student.deleteOne();

        res.status(200).json({ id: req.params.id, message: 'Student removed' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getPlacedStudents,
    createPlacedStudent,
    updatePlacedStudent,
    deletePlacedStudent
};
