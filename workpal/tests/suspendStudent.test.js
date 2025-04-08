const { suspendStudent } = require('../services/suspendStudentService');
const Student = require('../models/Student');

// Mock the Student model
jest.mock('../models/Student', () => ({
  findOne: jest.fn()
}));

describe('SuspendStudentService', () => {
  // Mock student object with save method
  let mockStudent;
  
  // Clear all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Create a new mock student object for each test
    mockStudent = {
      email: 'student@example.com',
      suspended: false,
      save: jest.fn().mockResolvedValue(true)
    };
    
    // Silence console logs and errors during tests
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore console methods after each test
    console.log.mockRestore();
    console.error.mockRestore();
  });

  test('should suspend a student successfully', async () => {
    // Setup mock response for Student.findOne
    Student.findOne.mockResolvedValue(mockStudent);
    
    // Call the function
    await suspendStudent('student@example.com');
    
    // Assertions
    expect(Student.findOne).toHaveBeenCalledWith({ 
      where: { email: 'student@example.com' } 
    });
    expect(mockStudent.suspended).toBe(true);
    expect(mockStudent.save).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith(
      'Student student@example.com has been suspended.'
    );
  });

  test('should throw error when student is not found', async () => {
    // Setup mock response for Student.findOne to return null (student not found)
    Student.findOne.mockResolvedValue(null);
    
    // Call the function and expect it to throw
    await expect(suspendStudent('nonexistent@example.com'))
      .rejects
      .toThrow('Student not found');
    
    // Assertions
    expect(Student.findOne).toHaveBeenCalledWith({ 
      where: { email: 'nonexistent@example.com' } 
    });
    expect(console.error).toHaveBeenCalled();
  });

  test('should handle database error during findOne', async () => {
    // Setup mock to throw a database error
    const dbError = new Error('Database connection error');
    Student.findOne.mockRejectedValue(dbError);
    
    // Call the function and expect it to throw
    await expect(suspendStudent('student@example.com'))
      .rejects
      .toThrow('Database connection error');
    
    // Assertions
    expect(Student.findOne).toHaveBeenCalledWith({ 
      where: { email: 'student@example.com' } 
    });
    expect(console.error).toHaveBeenCalledWith(
      'Error suspending student:', 
      expect.any(Error)
    );
  });

  test('should handle error during save operation', async () => {
    // Setup mock response for Student.findOne
    Student.findOne.mockResolvedValue(mockStudent);
    
    // Setup save method to throw an error
    const saveError = new Error('Error saving changes');
    mockStudent.save.mockRejectedValue(saveError);
    
    // Call the function and expect it to throw
    await expect(suspendStudent('student@example.com'))
      .rejects
      .toThrow('Error saving changes');
    
    // Assertions
    expect(Student.findOne).toHaveBeenCalledWith({ 
      where: { email: 'student@example.com' } 
    });
    expect(mockStudent.suspended).toBe(true); // This should still be set even if save fails
    expect(mockStudent.save).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(
      'Error suspending student:', 
      expect.any(Error)
    );
  });

  test('should not change suspension status if already suspended', async () => {
    // Create a mock for an already suspended student
    const alreadySuspendedStudent = {
      email: 'suspended@example.com',
      suspended: true,
      save: jest.fn().mockResolvedValue(true)
    };
    
    // Setup mock response for Student.findOne
    Student.findOne.mockResolvedValue(alreadySuspendedStudent);
    
    // Call the function
    await suspendStudent('suspended@example.com');
    
    // Assertions
    expect(Student.findOne).toHaveBeenCalledWith({ 
      where: { email: 'suspended@example.com' } 
    });
    expect(alreadySuspendedStudent.suspended).toBe(true); // Should still be true
    expect(alreadySuspendedStudent.save).toHaveBeenCalled(); // Save should still be called
    expect(console.log).toHaveBeenCalledWith(
      'Student suspended@example.com has been suspended.'
    );
  });

  test('should handle case-sensitive email lookup correctly', async () => {
    // Setup mock response for Student.findOne
    Student.findOne.mockImplementation(({ where }) => {
      // Simulate case-sensitive lookup (depends on your actual DB config)
      if (where.email === 'student@example.com') {
        return Promise.resolve(mockStudent);
      }
      return Promise.resolve(null);
    });
    
    // Call with differently cased email
    await expect(suspendStudent('STUDENT@example.com'))
      .rejects
      .toThrow('Student not found');
    
    // Assertions
    expect(Student.findOne).toHaveBeenCalledWith({ 
      where: { email: 'STUDENT@example.com' } 
    });
  });
});