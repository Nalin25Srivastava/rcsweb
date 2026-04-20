const RegisteredStudent = require('../models/RegisteredStudent');

// @desc    Get all registered students
// @route   GET /api/registered-students
// @access  Public
const getRegisteredStudents = async (req, res) => {
    try {
        const students = await RegisteredStudent.find({}).sort({ registrationDate: -1 });
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a registered student
// @route   POST /api/registered-students
// @access  Private/Admin
const createRegisteredStudent = async (req, res) => {
    const { userId, name, email, phone, course, batch, status, image } = req.body;

    try {
        const student = await RegisteredStudent.create({
            user: userId,
            name,
            email,
            phone,
            course,
            batch,
            status,
            image
        });

        res.status(201).json(student);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a registered student
// @route   PUT /api/registered-students/:id
// @access  Private/Admin
const updateRegisteredStudent = async (req, res) => {
    try {
        const student = await RegisteredStudent.findById(req.params.id);

        if (student) {
            student.name = req.body.name || student.name;
            student.email = req.body.email || student.email;
            student.phone = req.body.phone || student.phone;
            student.course = req.body.course || student.course;
            student.batch = req.body.batch || student.batch;
            student.status = req.body.status || student.status;
            student.image = req.body.image || student.image;

            const updatedStudent = await student.save();
            res.json(updatedStudent);
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a registered student
// @route   DELETE /api/registered-students/:id
// @access  Private/Admin
const deleteRegisteredStudent = async (req, res) => {
    try {
        const student = await RegisteredStudent.findById(req.params.id);

        if (student) {
            await student.deleteOne();
            res.json({ message: 'Student removed' });
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getRegisteredStudents,
    createRegisteredStudent,
    updateRegisteredStudent,
    deleteRegisteredStudent
};
