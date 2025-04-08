const express = require('express');
const router = express.Router();
const getCommonStudentsController = require('../controllers/getCommonController');

// GET route
router.get('/commonstudents', getCommonStudentsController.getCommonStudents);


module.exports = router;