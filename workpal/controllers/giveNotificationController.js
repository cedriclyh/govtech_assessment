const giveNotificationService = require('../services/giveNotificationService');

exports.giveNotification = async (req, res) => {
    try {
        const finalList = await giveNotificationService.processRequest(req.body);

        // Success: return the finalList as recipients
        res.status(200).json({
            recipients: finalList
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
