-- DROP the database if it exists
DROP DATABASE IF EXISTS workpal_db;

-- CREATE a new database
CREATE DATABASE workpal_db;

-- USE the database
USE workpal_db;

-- TEACHER table
CREATE TABLE Teacher (
    Email VARCHAR(50) PRIMARY KEY,
    FName VARCHAR(50) NOT NULL,
    LName VARCHAR(50) NOT NULL,
    TeacherID INT NOT NULL,
    Dept VARCHAR(50) NOT NULL
);

-- STUDENT table
CREATE TABLE Student (
    Email VARCHAR(50) PRIMARY KEY,
    FName VARCHAR(50) NOT NULL,
    LName VARCHAR(50) NOT NULL,
    StudentIndex INT NOT NULL,
    Class VARCHAR(50) NOT NULL
);

-- REGISTRATION table
CREATE TABLE Registration (
    teacher_email VARCHAR(50),
    student_email VARCHAR(50),
    PRIMARY KEY (teacher_email, student_email)
    FOREIGN KEY (teacher_email) REFERENCES Teacher(Email),
    FOREIGN KEY (student_email) REFERENCES Student(Email),
    UNIQUE(teacher_email, student_email)
);

-- Teacher Values
INSERT INTO Teacher (Email, FName, LName, TeacherID, Dept) VALUES
    ('teacherken@gmail.com', 'Ken', 'Khoo', 1001, 'Mathematics'),
    ('teacherben@gmail.com', 'Ben', 'Boon', 1002, 'Biology'),
    ('teacherjacob@gmail.com', 'Jacob', 'Tan', 1003, 'Chemistry'),
    ('teacherjohn@gmail.com', 'John', 'Lim', 1004, 'English'),
    ('teachermary@gmail.com', 'Mary', 'Ma', 1005, 'Chinese'),
    ('teacherchristy@gmail.com', 'Christy', 'Chen', 1006, 'Mathematics');

-- Student Values
INSERT INTO Student (Email, FName, LName, StudentIndex, Class) VALUES
    ('studentjames@gmail.com', 'James', 'Koh', 1 ,'1E1'),
    ('studentharry@gmail.com', 'Harry', 'Koh', 2 ,'1E1'),
    ('studentjerry@gmail.com', 'Jerry', 'Lim', 3 ,'1E1'),
    ('studentvicky@gmail.com', 'Vicky', 'Lim', 4 ,'1E1'),
    ('studentgwen@gmail.com', 'Gwen', 'Pang', 5 ,'1E1'),
    ('studentmandy@gmail.com', 'Mandy', 'Ong', 6 ,'1E1'),
    ('studentjamie@gmail.com', 'Jamie', 'Oo', 7 ,'1E1'),
    ('studentjay@gmail.com', 'Jay', 'Koh', 1 ,'1E2'),
    ('studentcarol@gmail.com', 'Carol', 'Ho', 2 ,'1E2'),
    ('studentmichael@gmail.com', 'Michael', 'Koh', 3 ,'1E2'),
    ('studentchris@gmail.com', 'Chris', 'Ho', 4 ,'1E2'),
    ('studentandy@gmail.com', 'Andy', 'Toh', 5 ,'1E2'),
    ('studentjasper@gmail.com', 'Jasper', 'Toh', 6 ,'1E2'),
    ('studentwally@gmail.com', 'Wally', 'Koh', 1 ,'2E1'),
    ('studentadam@gmail.com', 'Adam', 'Koh', 2 ,'2E1'),
    ('studentsilver@gmail.com', 'Silver', 'Lim', 3 ,'2E1'),
    ('studentapril@gmail.com', 'April', 'Lim', 4 ,'2E1'),
    ('studentmay@gmail.com', 'May', 'Pang', 5 ,'2E1'),
    ('studentjenny@gmail.com', 'Jenny', 'Ong', 6 ,'2E1'),
    ('studentlisa@gmail.com', 'Lisa', 'Zhou', 7 ,'2E1');

-- REGISTRATION values
INSERT INTO Registration (teacher_email, student_email) VALUES
    ('teacherchristy@gmail.com', 'studentjames@gmail.com'),
    ('teacherchristy@gmail.com', 'studentharry@gmail.com'),
    ('teacherchristy@gmail.com', 'studentjerry@gmail.com'),
    ('teacherchristy@gmail.com', 'studentvicky@gmail.com'),
    ('teacherchristy@gmail.com', 'studentgwen@gmail.com'),
    ('teacherchristy@gmail.com', 'studentmandy@gmail.com'),
    ('teacherchristy@gmail.com', 'studentjamie@gmail.com'),

    ('teacherjohn@gmail.com', 'studentjames@gmail.com'),
    ('teacherjohn@gmail.com', 'studentharry@gmail.com'),
    ('teacherjohn@gmail.com', 'studentjerry@gmail.com'),
    ('teacherjohn@gmail.com', 'studentvicky@gmail.com'),
    ('teacherjohn@gmail.com', 'studentgwen@gmail.com'),
    ('teacherjohn@gmail.com', 'studentmandy@gmail.com'),
    ('teacherjohn@gmail.com', 'studentjamie@gmail.com'),

    ('teachermary@gmail.com', 'studentjames@gmail.com'),
    ('teachermary@gmail.com', 'studentharry@gmail.com'),
    ('teachermary@gmail.com', 'studentjerry@gmail.com'),
    ('teachermary@gmail.com', 'studentvicky@gmail.com'),
    ('teachermary@gmail.com', 'studentgwen@gmail.com'),
    ('teachermary@gmail.com', 'studentmandy@gmail.com'),
    ('teachermary@gmail.com', 'studentjamie@gmail.com'),

    ('teacherben@gmail.com', 'studentharry@gmail.com'),
    ('teacherben@gmail.com', 'studentgwen@gmail.com'),
    ('teacherben@gmail.com', 'studentmandy@gmail.com'),
    ('teacherben@gmail.com', 'studentjamie@gmail.com'),

    ('teacherben@gmail.com', 'studentjay@gmail.com'),
    ('teacherben@gmail.com', 'studentcarol@gmail.com'),
    ('teacherben@gmail.com', 'studentmichael@gmail.com'),
    ('teacherben@gmail.com', 'studentchris@gmail.com'),
    ('teacherben@gmail.com', 'studentandy@gmail.com'),
    ('teacherben@gmail.com', 'studentjasper@gmail.com'),

    ('teacherken@gmail.com', 'studentjay@gmail.com'),
    ('teacherken@gmail.com', 'studentcarol@gmail.com'),
    ('teacherken@gmail.com', 'studentmichael@gmail.com'),
    ('teacherken@gmail.com', 'studentchris@gmail.com'),
    ('teacherken@gmail.com', 'studentandy@gmail.com'),
    ('teacherken@gmail.com', 'studentjasper@gmail.com'),

    ('teacherken@gmail.com', 'studentwally@gmail.com'),
    ('teacherken@gmail.com', 'studentadam@gmail.com'),
    ('teacherken@gmail.com', 'studentsilver@gmail.com'),
    ('teacherken@gmail.com', 'studentapril@gmail.com'),
    ('teacherken@gmail.com', 'studentmay@gmail.com'),
    ('teacherken@gmail.com', 'studentjenny@gmail.com'),
    ('teacherken@gmail.com', 'studentlisa@gmail.com'),

    ('teacherjacob@gmail.com', 'studentwally@gmail.com'),
    ('teacherjacob@gmail.com', 'studentadam@gmail.com'),
    ('teacherjacob@gmail.com', 'studentsilver@gmail.com'),
    ('teacherjacob@gmail.com', 'studentapril@gmail.com'),
    ('teacherjacob@gmail.com', 'studentmay@gmail.com'),
    ('teacherjacob@gmail.com', 'studentjenny@gmail.com'),
    ('teacherjacob@gmail.com', 'studentlisa@gmail.com'),

    ('teacherjacob@gmail.com', 'studentwally@gmail.com'),
    ('teacherjacob@gmail.com', 'studentadam@gmail.com'),
    ('teacherjacob@gmail.com', 'studentsilver@gmail.com'),
    ('teacherjacob@gmail.com', 'studentapril@gmail.com'),
    ('teacherjacob@gmail.com', 'studentmay@gmail.com'),
    ('teacherjacob@gmail.com', 'studentjenny@gmail.com'),
    ('teacherjacob@gmail.com', 'studentlisa@gmail.com');
