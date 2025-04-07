const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const Registration = require('../models/Registration');

exports.processRequest = async (data) => {
    const { teacher, students } = data;


    // check if teacher exists
    const teacherRecord = await Teacher.findOne({ where: { Email: teacher } });
        if (!teacherRecord){
        throw new Error(`Teacher (${teacher} not found)`);
    }

    // check if students exist
    const studentRecords = await Student.findAll({
        where: {
          Email: students
        }
      });
    
      if (studentRecords.length !== students.length) {
        throw new Error('One or more students not found');
      }

    // register each student to the teacher
    for (const studentEmail of students) {
        const studentRecord = studentRecords.find(s => s.Email === studentEmail);
    
        // check if the student is already registered with the teacher
        const existingRegistration = await Registration.findOne({
          where: {
            teacher_email: teacher,
            student_email: studentEmail
          }
        });
    
        if (existingRegistration) {
          throw new Error(`Student ${studentEmail} is already registered for this teacher`);
        }
    
        // create registration if student is not already registered
        await Registration.create({
          teacher_email: teacher,
          student_email: studentEmail
        });
    
        console.log(`Successfully registered ${studentEmail} for ${teacher}`);
      }
};