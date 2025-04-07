const express = require('express');
const router = express.Router();
const registerStudentController = require('../controllers/registerStudentController');

// POST route
router.post('/register', registerStudentController.registerStudent);


module.exports = router;