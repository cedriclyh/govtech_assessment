// controllers/suspendStudentController.js
const suspendStudentService = require('../services/suspendStudentService'); // Import the service

exports.suspendStudent = async (req, res) => {
  try {
    const { email } = req.body;  // Get the student's email from the request body
    
    // Call the service to suspend the student
    await suspendStudentService.suspendStudent(email);

    // Respond with HTTP 204 (No Content) on success
    return res.status(204).send();
  } catch (error) {
    console.error('Error in suspendStudent controller:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
