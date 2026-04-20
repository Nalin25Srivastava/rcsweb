const express = require('express');
const router = express.Router();
const {
    getRegisteredStudents,
    createRegisteredStudent,
    updateRegisteredStudent,
    deleteRegisteredStudent
} = require('../controllers/registeredStudentController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getRegisteredStudents)
    .post(protect, admin, createRegisteredStudent);

router.route('/:id')
    .put(protect, admin, updateRegisteredStudent)
    .delete(protect, admin, deleteRegisteredStudent);

module.exports = router;
