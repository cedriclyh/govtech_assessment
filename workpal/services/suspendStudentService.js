const Student = require('../models/Student');

exports.suspendStudent = async (email) => {
  try {
    // Find the student by email
    const student = await Student.findOne({ where: { email } });

    if (!student) {
      throw new Error('Student not found');
    }

    student.suspended = true;

    await student.save();

    console.log(`Student ${email} has been suspended.`);
  } catch (error) {
    console.error('Error suspending student:', error);
    throw error;
  }
};
