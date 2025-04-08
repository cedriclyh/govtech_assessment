const { Sequelize, sequelize } = require('../config/database');  // Import Sequelize correctly
const { QueryTypes } = require('sequelize');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const Registration = require('../models/Registration');

exports.processRequest = async (teacherEmails) => {
  try {
    console.log('Teacher emails array:', teacherEmails);

    const teacherStudentsMap = {};

    // Iterate through each teacher email
    for (const teacherEmail of teacherEmails) {
      // Query the Registration table to find all students associated with this teacher
      const registrations = await Registration.findAll({
        where: { teacher_email: teacherEmail },
        attributes: ['student_email'],
      });

      // Store the result for this teacher
      teacherStudentsMap[teacherEmail] = registrations.map(registration => registration.student_email);
    }

    // Count how many times each student appears across all teacher emails
    const studentOccurrences = {};
    for (const teacherEmail in teacherStudentsMap) {
      const students = teacherStudentsMap[teacherEmail];
      students.forEach(studentEmail => {
        studentOccurrences[studentEmail] = (studentOccurrences[studentEmail] || 0) + 1;
      });
    }

    // Filter students who appear in at least as many teacher lists as there are teacher emails
    const studentsInMultipleLists = Object.keys(studentOccurrences).filter(
      studentEmail => studentOccurrences[studentEmail] >= teacherEmails.length
    );

    // Return the list of students who appear in at least as many teacher's lists as the total count
    return studentsInMultipleLists;

  } catch (error) {
    console.error('Error fetching students for teachers:', error);
    throw new Error('Error fetching common students');
  }
};