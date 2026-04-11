const express = require('express');
const router = express.Router();
const { getPlacedStudents, createPlacedStudent, updatePlacedStudent, deletePlacedStudent } = require('../controllers/placedStudentController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getPlacedStudents);
router.post('/', protect, admin, createPlacedStudent);
router.put('/:id', protect, admin, updatePlacedStudent);
router.delete('/:id', protect, admin, deletePlacedStudent);

module.exports = router;
