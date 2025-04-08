const suspendStudentService = require('../services/suspendStudentService');

exports.suspendStudent = async (req, res) => {
  try {
    const { email } = req.body;
    
    await suspendStudentService.suspendStudent(email);

    // Respond with HTTP 204 (No Content) on success
    return res.status(204).send();
  } catch (error) {
    console.error('Error in suspendStudent controller:', error);
    return res.status(500).json({ message: 'Internal server error: ' + error.message });
  }
};
