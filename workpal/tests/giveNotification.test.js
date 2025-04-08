const { processRequest } = require('../services/giveNotificationService');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const Registration = require('../models/Registration');

// Mock the required models
jest.mock('../models/Teacher', () => ({}));
jest.mock('../models/Student', () => ({
  findAll: jest.fn()
}));
jest.mock('../models/Registration', () => ({
  findAll: jest.fn()
}));

describe('GiveNotificationService', () => {
  // Clear all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
    // Silence console logs and errors during tests
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore console methods after each test
    console.log.mockRestore();
    console.error.mockRestore();
  });

  test('should process notification without @student mentions', async () => {
    const mockStudentEmails = ['student1@example.com', 'student2@example.com'];
    
    // Mock Registration.findAll to return student emails
    Registration.findAll.mockResolvedValue([
      { student_email: 'student1@example.com' },
      { student_email: 'student2@example.com' }
    ]);
    
    // Mock Student.findAll for the existence check
    Student.findAll.mockResolvedValueOnce([
      { Email: 'student1@example.com' },
      { Email: 'student2@example.com' }
    ]);
    
    // Mock Student.findAll for the suspension check
    Student.findAll.mockResolvedValueOnce([
      { Email: 'student1@example.com' },
      { Email: 'student2@example.com' }
    ]);
    
    const data = {
      teacher: 'teacher@example.com',
      notification: 'Hello students!'
    };
    
    const result = await processRequest(data);
    
    expect(Registration.findAll).toHaveBeenCalledWith({
      where: { teacher_email: 'teacher@example.com' },
      attributes: ['student_email']
    });
    
    expect(Student.findAll).toHaveBeenCalledTimes(2);
    expect(result).toEqual(['student1@example.com', 'student2@example.com']);
  });

  // This test requires the bug to be fixed in the implementation
  test('should process notification with @student mentions', async () => {
    // Mock Registration.findAll to return student emails
    Registration.findAll.mockResolvedValue([
      { student_email: 'student1@example.com' }
    ]);
    
    // Mock Student.findAll for the existence check
    Student.findAll.mockResolvedValueOnce([
      { Email: 'student1@example.com' },
      { Email: 'student2@example.com' }
    ]);
    
    // Mock Student.findAll for the suspension check
    Student.findAll.mockResolvedValueOnce([
      { Email: 'student1@example.com' },
      { Email: 'student2@example.com' }
    ]);
    
    const data = {
      teacher: 'teacher@example.com',
      notification: 'Hello @student2@example.com!'
    };
    
    const result = await processRequest(data);
    
    expect(Registration.findAll).toHaveBeenCalledWith({
      where: { teacher_email: 'teacher@example.com' },
      attributes: ['student_email']
    });
    
    expect(Student.findAll).toHaveBeenCalledTimes(2);
    expect(result).toEqual(['student1@example.com', 'student2@example.com']);
  });

  test('should filter out suspended students', async () => {
    // Mock Registration.findAll to return student emails
    Registration.findAll.mockResolvedValue([
      { student_email: 'student1@example.com' },
      { student_email: 'student2@example.com' }
    ]);
    
    // Mock Student.findAll for the existence check
    Student.findAll.mockResolvedValueOnce([
      { Email: 'student1@example.com' },
      { Email: 'student2@example.com' }
    ]);
    
    // Mock Student.findAll for the suspension check - only return student1 as active
    Student.findAll.mockResolvedValueOnce([
      { Email: 'student1@example.com' }
    ]);
    
    const data = {
      teacher: 'teacher@example.com',
      notification: 'Hello students!'
    };
    
    const result = await processRequest(data);
    
    expect(Registration.findAll).toHaveBeenCalledWith({
      where: { teacher_email: 'teacher@example.com' },
      attributes: ['student_email']
    });
    
    expect(Student.findAll).toHaveBeenCalledTimes(2);
    expect(Student.findAll).toHaveBeenNthCalledWith(2, {
      where: {
        Email: ['student1@example.com', 'student2@example.com'],
        IsSuspended: false
      },
      attributes: ['Email']
    });
    
    expect(result).toEqual(['student1@example.com']);
  });

  test('should handle multiple @student mentions', async () => {
    // Mock Registration.findAll to return student emails
    Registration.findAll.mockResolvedValue([
      { student_email: 'student1@example.com' }
    ]);
    
    // Mock Student.findAll for the existence check
    Student.findAll.mockResolvedValueOnce([
      { Email: 'student1@example.com' },
      { Email: 'student2@example.com' },
      { Email: 'student3@example.com' }
    ]);
    
    // Mock Student.findAll for the suspension check
    Student.findAll.mockResolvedValueOnce([
      { Email: 'student1@example.com' },
      { Email: 'student2@example.com' },
      { Email: 'student3@example.com' }
    ]);
    
    const data = {
      teacher: 'teacher@example.com',
      notification: 'Hello @student2@example.com and @student3@example.com!'
    };
    
    const result = await processRequest(data);
    
    expect(Registration.findAll).toHaveBeenCalledWith({
      where: { teacher_email: 'teacher@example.com' },
      attributes: ['student_email']
    });
    
    expect(Student.findAll).toHaveBeenCalledTimes(2);
    expect(result).toEqual(['student1@example.com', 'student2@example.com', 'student3@example.com']);
  });

  test('should throw error when fetching students fails', async () => {
    // Mock Registration.findAll to throw an error
    Registration.findAll.mockRejectedValue(new Error('Database connection error'));
    
    const data = {
      teacher: 'teacher@example.com',
      notification: 'Hello students!'
    };
    
    await expect(processRequest(data))
      .rejects
      .toThrow('Error fetching students');
    
    expect(Registration.findAll).toHaveBeenCalledWith({
      where: { teacher_email: 'teacher@example.com' },
      attributes: ['student_email']
    });
    
    expect(Student.findAll).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();
  });

  test('should throw error when checking for suspended students fails', async () => {
    // Mock Registration.findAll to return student emails
    Registration.findAll.mockResolvedValue([
      { student_email: 'student1@example.com' }
    ]);
    
    // Mock Student.findAll for the existence check
    Student.findAll.mockResolvedValueOnce([
      { Email: 'student1@example.com' }
    ]);
    
    // Mock Student.findAll to throw an error for the suspension check
    Student.findAll.mockRejectedValueOnce(new Error('Database error'));
    
    const data = {
      teacher: 'teacher@example.com',
      notification: 'Hello students!'
    };
    
    await expect(processRequest(data))
      .rejects
      .toThrow('Error fetching active students');
    
    expect(Registration.findAll).toHaveBeenCalled();
    expect(Student.findAll).toHaveBeenCalledTimes(2);
    expect(console.error).toHaveBeenCalled();
  });
});