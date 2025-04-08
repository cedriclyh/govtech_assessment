const Student = require('../models/Student');

exports.suspendStudent = async (email) => {
  try {
    // Find the student by email
    const student = await Student.findOne({ where: { email } });

    // If student not found, throw an error
    if (!student) {
      throw new Error('Student not found');
    }

    // Set the suspended field to true
    student.suspended = true;

    // Save the student record
    await student.save();

    console.log(`Student ${email} has been suspended.`);
  } catch (error) {
    console.error('Error suspending student:', error);
    throw error;  // Rethrow the error to be caught by the controller
  }
};
