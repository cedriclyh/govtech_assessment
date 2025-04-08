const { sequelize } = require('../config/database');
const { QueryTypes } = require('sequelize');

exports.processRequest = async (teacherEmails) => {
  try {
    console.log('Processing request for teacher emails:', teacherEmails);

    const teacherEmailsString = teacherEmails.join("', '")
    const teacherEmailCount = teacherEmails.length

    const inputQuery = `
      SELECT s.email
      FROM students s
      JOIN teacher_student_registration tsr ON s.id = tsr.student_id
      JOIN teachers t ON tsr.teacher_id = t.id
      WHERE t.email IN ('${teacherEmailsString}')
      GROUP BY s.id, s.email
      HAVING COUNT(DISTINCT t.id) = ${teacherEmailCount}
    `;
    
    console.log('Executing query:', inputQuery);
    
    // Execute the query with the replacements for the teacher emails and teacher count
    const results = await sequelize.query(inputQuery, {
        type: QueryTypes.SELECT,
    });

    console.log('Found common students:', results.length);
    
    // Return just the student emails
    return results.map(student => student.email);
  } catch (error) {
    console.error('Error processing request:', error);
    throw new Error('Error fetching common students');
  }
};
