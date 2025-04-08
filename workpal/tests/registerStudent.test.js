const { processRequest } = require('../services/registerStudentService');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const Registration = require('../models/Registration');

// Completely mock the models to avoid any actual database connections
jest.mock('../models/Teacher', () => ({
  findOne: jest.fn()
}));

jest.mock('../models/Student', () => ({
  findAll: jest.fn()
}));

jest.mock('../models/Registration', () => ({
  findOne: jest.fn(),
  create: jest.fn()
}));

describe('RegisterStudentService', () => {
  // Clear all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
    // Silence console logs during tests
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore console.log after each test
    console.log.mockRestore();
  });

  test('should successfully register students to a teacher', async () => {
    // Mock data
    const teacherEmail = 'teacher@example.com';
    const studentEmails = ['student1@example.com', 'student2@example.com'];
    
    // Mock Teacher.findOne to return a teacher
    Teacher.findOne.mockResolvedValue({ Email: teacherEmail });
    
    // Mock Student.findAll to return all students
    Student.findAll.mockResolvedValue([
      { Email: 'student1@example.com' },
      { Email: 'student2@example.com' }
    ]);
    
    // Mock Registration.findOne to return null (no existing registrations)
    Registration.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce(null);
    
    // Mock Registration.create
    Registration.create.mockResolvedValue({});
    
    // Call the function
    await processRequest({ teacher: teacherEmail, students: studentEmails });
    
    // Assertions
    expect(Teacher.findOne).toHaveBeenCalledWith({ where: { Email: teacherEmail } });
    expect(Student.findAll).toHaveBeenCalledWith({ where: { Email: studentEmails } });
    expect(Registration.findOne).toHaveBeenCalledTimes(2);
    expect(Registration.create).toHaveBeenCalledTimes(2);
    expect(Registration.create).toHaveBeenNthCalledWith(1, {
      teacher_email: teacherEmail,
      student_email: 'student1@example.com'
    });
    expect(Registration.create).toHaveBeenNthCalledWith(2, {
      teacher_email: teacherEmail,
      student_email: 'student2@example.com'
    });
  });

  test('should throw error when teacher is not found', async () => {
    // Mock data
    const teacherEmail = 'nonexistent@example.com';
    const studentEmails = ['student1@example.com'];
    
    // Mock Teacher.findOne to return null (teacher not found)
    Teacher.findOne.mockResolvedValue(null);
    
    // Call the function and expect it to throw
    await expect(processRequest({ teacher: teacherEmail, students: studentEmails }))
      .rejects
      .toThrow(`Teacher (${teacherEmail} not found)`);
    
    // Assertions
    expect(Teacher.findOne).toHaveBeenCalledWith({ where: { Email: teacherEmail } });
    expect(Student.findAll).not.toHaveBeenCalled();
    expect(Registration.findOne).not.toHaveBeenCalled();
    expect(Registration.create).not.toHaveBeenCalled();
  });

  test('should throw error when one or more students are not found', async () => {
    // Mock data
    const teacherEmail = 'teacher@example.com';
    const studentEmails = ['student1@example.com', 'nonexistent@example.com'];
    
    // Mock Teacher.findOne to return a teacher
    Teacher.findOne.mockResolvedValue({ Email: teacherEmail });
    
    // Mock Student.findAll to return only one student (one is missing)
    Student.findAll.mockResolvedValue([
      { Email: 'student1@example.com' }
    ]);
    
    // Call the function and expect it to throw
    await expect(processRequest({ teacher: teacherEmail, students: studentEmails }))
      .rejects
      .toThrow('One or more students not found');
    
    // Assertions
    expect(Teacher.findOne).toHaveBeenCalledWith({ where: { Email: teacherEmail } });
    expect(Student.findAll).toHaveBeenCalledWith({ where: { Email: studentEmails } });
    expect(Registration.findOne).not.toHaveBeenCalled();
    expect(Registration.create).not.toHaveBeenCalled();
  });

  test('should throw error when student is already registered with teacher', async () => {
    // Mock data
    const teacherEmail = 'teacher@example.com';
    const studentEmails = ['student1@example.com'];
    
    // Mock Teacher.findOne to return a teacher
    Teacher.findOne.mockResolvedValue({ Email: teacherEmail });
    
    // Mock Student.findAll to return all students
    Student.findAll.mockResolvedValue([
      { Email: 'student1@example.com' }
    ]);
    
    // Mock Registration.findOne to return an existing registration
    Registration.findOne.mockResolvedValue({ 
      teacher_email: teacherEmail, 
      student_email: 'student1@example.com' 
    });
    
    // Call the function and expect it to throw
    await expect(processRequest({ teacher: teacherEmail, students: studentEmails }))
      .rejects
      .toThrow(`Student student1@example.com is already registered for this teacher`);
    
    // Assertions
    expect(Teacher.findOne).toHaveBeenCalledWith({ where: { Email: teacherEmail } });
    expect(Student.findAll).toHaveBeenCalledWith({ where: { Email: studentEmails } });
    expect(Registration.findOne).toHaveBeenCalledWith({
      where: {
        teacher_email: teacherEmail,
        student_email: 'student1@example.com'
      }
    });
    expect(Registration.create).not.toHaveBeenCalled();
  });

  test('should register first student but throw error when second student is already registered', async () => {
    // Mock data
    const teacherEmail = 'teacher@example.com';
    const studentEmails = ['student1@example.com', 'student2@example.com'];
    
    // Mock Teacher.findOne to return a teacher
    Teacher.findOne.mockResolvedValue({ Email: teacherEmail });
    
    // Mock Student.findAll to return all students
    Student.findAll.mockResolvedValue([
      { Email: 'student1@example.com' },
      { Email: 'student2@example.com' }
    ]);
    
    // First student is not registered, second student is already registered
    Registration.findOne
      .mockResolvedValueOnce(null) // First student check
      .mockResolvedValueOnce({ // Second student check
        teacher_email: teacherEmail, 
        student_email: 'student2@example.com' 
      });
    
    // Mock Registration.create for the first student
    Registration.create.mockResolvedValue({});
    
    // Call the function and expect it to throw for the second student
    await expect(processRequest({ teacher: teacherEmail, students: studentEmails }))
      .rejects
      .toThrow(`Student student2@example.com is already registered for this teacher`);
    
    // Assertions
    expect(Teacher.findOne).toHaveBeenCalledWith({ where: { Email: teacherEmail } });
    expect(Student.findAll).toHaveBeenCalledWith({ where: { Email: studentEmails } });
    expect(Registration.findOne).toHaveBeenCalledTimes(2);
    expect(Registration.create).toHaveBeenCalledTimes(1);
    expect(Registration.create).toHaveBeenCalledWith({
      teacher_email: teacherEmail,
      student_email: 'student1@example.com'
    });
  });
});