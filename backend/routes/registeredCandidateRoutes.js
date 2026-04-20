const express = require('express');
const router = express.Router();
const {
    getRegisteredCandidates,
    createRegisteredCandidate,
    updateRegisteredCandidate,
    deleteRegisteredCandidate
} = require('../controllers/registeredCandidateController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getRegisteredCandidates)
    .post(protect, admin, createRegisteredCandidate);

router.route('/:id')
    .put(protect, admin, updateRegisteredCandidate)
    .delete(protect, admin, deleteRegisteredCandidate);

module.exports = router;
