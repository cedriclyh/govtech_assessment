# Workpal NodeJS API Assessment

## Overview

Workpal is a mobile application designed for public officer employee services. It helps public officers manage their work transactions easily and quickly from anywhere. This project builds APIs for teachers to perform administrative services for students.

## Features

- **Register Students**: Teachers can register one or more students
- **Retrieve Common Students**: Retrieve students registered with ALL specified teachers
- **Suspend Students**: Teachers can suspend specific students
- **Send Notifications**: Teachers can send notifications to active students

## Installation

### Prerequisites

- Node.js
- MySQL

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/cedriclyh/govtech_assessment
   cd workpal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure database**
   - Open `config/database.js`
   - Update the database credentials (host, username, password, database)

4. **Set up database schema**
   ```bash
   mysql -u <username> -p <database_name> < config/workpal.sql
   ```

5. **Start the server**
   ```bash
   node server.js
   ```

## API Endpoints

| Method | Endpoint                  | Description                                           |
|--------|---------------------------|-------------------------------------------------------|
| POST   | `/register`                | Register students to a teacher                       |
| GET    | `/commonstudents`          | Retrieve students common to given teachers           |
| POST   | `/suspend`                 | Suspend a specified student                          |
| GET    | `/retrievefornotifications`| Retrieve students eligible for notifications         |

For more detailed API documentation, you can refer to the [API Documentation](https://docs.google.com/document/d/1m9R7nmK01g0XzLeWIUsoKzdLrqanKzznUFFAgTMvs48/edit?usp=sharing).

## Testing

Run tests with coverage report:

```bash
npx jest --coverage
```

### Improving Test Coverage

To improve test coverage, add tests for:
- Cases where a student is not found
- Edge cases with empty student arrays
- Scenarios where included students already exist in the main list

Example test case for student not found:
```javascript
test('should throw error when student is not found', async () => {
  // Mock Registration.findAll to return student emails
  Registration.findAll.mockResolvedValue([
    { student_email: 'student1@example.com' }
  ]);
  
  // Mock Student.findAll to return fewer students than requested
  Student.findAll.mockResolvedValueOnce([
    { Email: 'student1@example.com' }
    // student2@example.com is missing
  ]);
  
  const data = {
    teacher: 'teacher@example.com',
    notification: 'Hello @student2@example.com!'
  };
  
  await expect(processRequest(data))
    .rejects
    .toThrow('One or more students not found');
});
```

## Project Structure

```
├── config/
│   ├── database.js
│   └── workpal.sql
├── models/
│   ├── Student.js
│   ├── Teacher.js
│   └── Registration.js
├── services/
│   └── giveNotificationService.js
├── tests/
│   └── giveNotification.test.js
├── server.js
└── README.md
```

## Contributing

If you find any bugs or have questions, please contact:
- Email: cedric.lim.2022@scis.smu.edu.sg

## License

This project is licensed under the MIT License.
