const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const Registration = require('../models/Registration');

exports.processRequest = async (data) => {
    console.log(data);

    const teacherEmail = data.teacher;
    const notif = data.notification;

    let msg;
    let includedStudents = [];

    // process notification
    if (notif.includes(' @student')) {
        let outcome_list = notif.split(' @student');

        msg = outcome_list[0];
        includedStudents = outcome_list.slice(1).map(email => 'student' + email);

        console.log("msg:", msg);
        console.log("includedStudents:", includedStudents);
    } else {
        msg = notif;  
        includedStudents = [];

        console.log("msg:", msg);
        console.log("includedStudents:", includedStudents);
    }

    // get list of students under teacherEmail
    let studentEmails = [];
    try {
        const registrations = await Registration.findAll({
            where: {
                teacher_email: teacherEmail,
            },
            attributes: ['student_email'],
        });
    
        studentEmails = registrations.map(registration => registration.student_email);
    } catch (error) {
        console.error('Error fetching students for teacher:', error);
        throw new Error('Error fetching students');
    }

    // combine list
    includedStudents.forEach(student => {
        if (!studentEmails.includes(student)) {
            studentEmails.push(student);
        }
    });

    // check if students exist
    const studentRecords = await Student.findAll({
        where: {
          Email: studentEmails
        }
      });
    
      if (studentRecords.length !== students.length) {
        throw new Error('One or more students not found');
      }

    // check if suspended
    let finalList = [];
    try {
        // Query the Students table to get emails where IsSuspended is false
        const students = await Student.findAll({
            where: {
                Email: studentEmails,
                IsSuspended: false,
            },
            attributes: ['Email'],
        });

        finalList = students.map(student => student.Email);
    
    } catch (error) {
        console.error('Error fetching active students:', error);
        throw new Error('Error fetching active students');
    }

    console.log(finalList);
    return finalList;
}
