const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Teacher = require('./Teacher'); 
const Student = require('./Student');

// Registration model
const Registration = sequelize.define('Registration', {
  teacher_email: {
    type: DataTypes.STRING(50),
    allowNull: false,
    references: {
      model: 'Teacher',
      key: 'Email'
    },
    primaryKey: true,
  },
  student_email: {
    type: DataTypes.STRING(50),
    allowNull: false,
    references: {
      model: 'Student',
      key: 'Email'
    },
    primaryKey: true,
  }
}, {
  tableName: 'Registration',
  timestamps: false,
});

Registration.belongsTo(Student, { foreignKey: 'student_email' });
Registration.belongsTo(Teacher, { foreignKey: 'teacher_email' });

module.exports = Registration;
