const getCommonStudentsService = require('../services/getCommonService');

exports.getCommonStudents = async (req, res) => {
  try {
    console.log('Request query:', req.query);

    let teacherEmails = req.query.teacher;

    if (!teacherEmails) {
      return res.status(400).json({ message: 'Teacher emails are required' });
    }

    if (typeof teacherEmails === 'string') {
      teacherEmails = [teacherEmails];
    }

    console.log('Teacher emails array:', teacherEmails);

    const commonStudents = await getCommonStudentsService.processRequest(teacherEmails);

    console.log('Common students:', commonStudents);

    if (commonStudents && commonStudents.length > 0) {
      // Success
      return res.status(200).json({ students: commonStudents });
    } else {
      return res.status(204).send();
    }
  } catch (error) {
    console.error('Error in getCommonStudents:', error);
    res.status(500).json({ message: 'Internal server error: ' + error.message });
  }
};
