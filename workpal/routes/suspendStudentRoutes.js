const express = require('express');
const router = express.Router();
const suspendStudentController = require('../controllers/suspendStudentController');  // Adjust the path accordingly

// POST route to suspend a student
router.post('/suspend', suspendStudentController.suspendStudent);

module.exports = router;
