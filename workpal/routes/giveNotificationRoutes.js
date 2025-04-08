const express = require('express');
const router = express.Router();
const giveNotificationController = require('../controllers/giveNotificationController');

// POST route
router.post('/retrievefornotifications', giveNotificationController.giveNotification);


module.exports = router;