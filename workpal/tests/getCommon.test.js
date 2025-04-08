const { processRequest } = require('../services/getCommonService');
const Registration = require('../models/Registration');

// Mock the Registration model
jest.mock('../models/Registration', () => ({
  findAll: jest.fn()
}));

// Mock other potential imports to prevent actual DB connections
jest.mock('../config/database', () => ({
  Sequelize: {},
  sequelize: {}
}));

jest.mock('../models/Teacher', () => ({}));
jest.mock('../models/Student', () => ({}));

describe('GetCommonService', () => {
  // Clear all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
    // Silence console logs during tests
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore console methods after each test
    console.log.mockRestore();
    console.error.mockRestore();
  });

  test('should return students common to all teachers', async () => {
    // Mock data - two teachers and three students
    const teacherEmails = ['teacher1@example.com', 'teacher2@example.com'];
    
    // Setup mock response for Registration.findAll
    // teacher1 has students 1, 2, 3
    Registration.findAll.mockResolvedValueOnce([
      { student_email: 'student1@example.com' },
      { student_email: 'student2@example.com' },
      { student_email: 'student3@example.com' }
    ]);
    
    // teacher2 has students 1, 2
    Registration.findAll.mockResolvedValueOnce([
      { student_email: 'student1@example.com' },
      { student_email: 'student2@example.com' }
    ]);
    
    // Call the function
    const commonStudents = await processRequest(teacherEmails);
    
    // Assertions
    expect(Registration.findAll).toHaveBeenCalledTimes(2);
    expect(Registration.findAll).toHaveBeenNthCalledWith(1, {
      where: { teacher_email: 'teacher1@example.com' },
      attributes: ['student_email']
    });
    expect(Registration.findAll).toHaveBeenNthCalledWith(2, {
      where: { teacher_email: 'teacher2@example.com' },
      attributes: ['student_email']
    });
    
    // Expect students 1 and 2 to be common to both teachers
    expect(commonStudents).toEqual(expect.arrayContaining(['student1@example.com', 'student2@example.com']));
    expect(commonStudents).not.toContain('student3@example.com');
    expect(commonStudents.length).toBe(2);
  });

  test('should return empty array when no common students exist', async () => {
    // Mock data - two teachers with no common students
    const teacherEmails = ['teacher1@example.com', 'teacher2@example.com'];
    
    // Setup mock response for Registration.findAll
    // teacher1 has students 1, 2
    Registration.findAll.mockResolvedValueOnce([
      { student_email: 'student1@example.com' },
      { student_email: 'student2@example.com' }
    ]);
    
    // teacher2 has students 3, 4
    Registration.findAll.mockResolvedValueOnce([
      { student_email: 'student3@example.com' },
      { student_email: 'student4@example.com' }
    ]);
    
    // Call the function
    const commonStudents = await processRequest(teacherEmails);
    
    // Assertions
    expect(Registration.findAll).toHaveBeenCalledTimes(2);
    expect(commonStudents).toEqual([]);
  });

  test('should handle a single teacher email', async () => {
    // Mock data - single teacher
    const teacherEmails = ['teacher1@example.com'];
    
    // Setup mock response for Registration.findAll
    // teacher1 has students 1, 2, 3
    Registration.findAll.mockResolvedValueOnce([
      { student_email: 'student1@example.com' },
      { student_email: 'student2@example.com' },
      { student_email: 'student3@example.com' }
    ]);
    
    // Call the function
    const commonStudents = await processRequest(teacherEmails);
    
    // Assertions
    expect(Registration.findAll).toHaveBeenCalledTimes(1);
    expect(Registration.findAll).toHaveBeenCalledWith({
      where: { teacher_email: 'teacher1@example.com' },
      attributes: ['student_email']
    });
    
    // Expect all students to be returned since there's only one teacher
    expect(commonStudents).toEqual(expect.arrayContaining([
      'student1@example.com', 
      'student2@example.com', 
      'student3@example.com'
    ]));
    expect(commonStudents.length).toBe(3);
  });

  test('should handle empty teacher list', async () => {
    // Mock data - empty teacher list
    const teacherEmails = [];
    
    // Call the function
    const commonStudents = await processRequest(teacherEmails);
    
    // Assertions
    expect(Registration.findAll).not.toHaveBeenCalled();
    expect(commonStudents).toEqual([]);
  });

  test('should handle teacher with no students', async () => {
    // Mock data - two teachers, one with no students
    const teacherEmails = ['teacher1@example.com', 'teacher2@example.com'];
    
    // Setup mock response for Registration.findAll
    // teacher1 has students 1, 2
    Registration.findAll.mockResolvedValueOnce([
      { student_email: 'student1@example.com' },
      { student_email: 'student2@example.com' }
    ]);
    
    // teacher2 has no students
    Registration.findAll.mockResolvedValueOnce([]);
    
    // Call the function
    const commonStudents = await processRequest(teacherEmails);
    
    // Assertions
    expect(Registration.findAll).toHaveBeenCalledTimes(2);
    expect(commonStudents).toEqual([]);
  });

  test('should handle multiple teachers with some overlap', async () => {
    // Mock data - three teachers with some overlap
    const teacherEmails = ['teacher1@example.com', 'teacher2@example.com', 'teacher3@example.com'];
    
    // Setup mock response for Registration.findAll
    // teacher1 has students 1, 2, 3
    Registration.findAll.mockResolvedValueOnce([
      { student_email: 'student1@example.com' },
      { student_email: 'student2@example.com' },
      { student_email: 'student3@example.com' }
    ]);
    
    // teacher2 has students 1, 2, 4
    Registration.findAll.mockResolvedValueOnce([
      { student_email: 'student1@example.com' },
      { student_email: 'student2@example.com' },
      { student_email: 'student4@example.com' }
    ]);
    
    // teacher3 has students 1, 5
    Registration.findAll.mockResolvedValueOnce([
      { student_email: 'student1@example.com' },
      { student_email: 'student5@example.com' }
    ]);
    
    // Call the function
    const commonStudents = await processRequest(teacherEmails);
    
    // Assertions
    expect(Registration.findAll).toHaveBeenCalledTimes(3);
    
    // Only student1 is common to all three teachers
    expect(commonStudents).toEqual(['student1@example.com']);
    expect(commonStudents.length).toBe(1);
  });

  test('should handle database error gracefully', async () => {
    // Mock data
    const teacherEmails = ['teacher1@example.com'];
    
    // Setup mock to throw an error
    Registration.findAll.mockRejectedValue(new Error('Database connection error'));
    
    // Call the function and expect it to throw
    await expect(processRequest(teacherEmails))
      .rejects
      .toThrow('Error fetching common students');
    
    // Assertions
    expect(Registration.findAll).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith(
      'Error fetching students for teachers:', 
      expect.any(Error)
    );
  });

  test('should handle duplicate students in a teacher list', async () => {
    // This test verifies that the function correctly handles a case where a student 
    // might appear multiple times in a teacher's list (should be deduplicated)
    const teacherEmails = ['teacher1@example.com', 'teacher2@example.com'];
    
    // Setup mock response with duplicates (though this shouldn't happen in a real DB)
    Registration.findAll.mockResolvedValueOnce([
      { student_email: 'student1@example.com' },
      { student_email: 'student1@example.com' }, // Duplicate
      { student_email: 'student2@example.com' }
    ]);
    
    Registration.findAll.mockResolvedValueOnce([
      { student_email: 'student1@example.com' },
      { student_email: 'student3@example.com' }
    ]);
    
    // Call the function
    const commonStudents = await processRequest(teacherEmails);
    
    // Assertions
    expect(commonStudents).toEqual(['student1@example.com']);
    expect(commonStudents.length).toBe(1);
  });
});