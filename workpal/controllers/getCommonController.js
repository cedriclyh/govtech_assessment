const getCommonStudentsService = require('../services/getCommonService');

exports.getCommonStudents = async (req, res) => {
  try {
    console.log('Request query:', req.query);

    let teacherEmails = req.query.teacher;

    if (!teacherEmails) {
      return res.status(400).json({ message: 'Teacher emails are required' });
    }

    // Ensure teacherEmails is always an array
    if (typeof teacherEmails === 'string') {
      teacherEmails = [teacherEmails]; // Convert to array if it's a single email
    }

    console.log('Teacher emails array:', teacherEmails);

    // Call the service to get common students
    const commonStudents = await getCommonStudentsService.processRequest(teacherEmails);

    console.log('Common students:', commonStudents);

    if (commonStudents && commonStudents.length > 0) {
      // Success
      return res.status(200).json({ students: commonStudents });
    } else {
      return res.status(204).send();  // No common students found
    }
  } catch (error) {
    console.error('Error in getCommonStudents:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
