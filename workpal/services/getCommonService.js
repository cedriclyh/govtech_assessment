const { sequelize } = require('../config/database');
const { QueryTypes } = require('sequelize');

exports.processRequest = async (teacherEmails) => {
  try {
    console.log('Processing request for teacher emails:', teacherEmails);

    // Construct the query using parameterized replacements
    const query = `
      SELECT s.email
      FROM students s
      JOIN teacher_student_registration tsr ON s.id = tsr.student_id
      JOIN teachers t ON tsr.teacher_id = t.id
      WHERE t.email IN (:teacherEmails)
      GROUP BY s.id, s.email
      HAVING COUNT(DISTINCT t.id) = :teacherCount
    `;
    
    console.log('Executing query:', query);
    
    // Execute the query with the replacements for the teacher emails and teacher count
    const results = await sequelize.query(query, {
      replacements: { teacherEmails, teacherCount: teacherEmails.length },
      type: QueryTypes.SELECT
    });

    console.log('Found common students:', results.length);
    
    // Return just the student emails
    return results.map(student => student.email);
  } catch (error) {
    console.error('Error processing request:', error);
    throw new Error('Error fetching common students');
  }
};
