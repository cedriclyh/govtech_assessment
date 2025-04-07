const registerStudentService = require('../services/registerStudentService');

exports.registerStudent = async (req, res) => {
    try {
        await registerStudentService.processRequest(req.body);

        // success
        res.status(204).send();
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error'});
    }
};