const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
// const Registration = require('./Registration');
// const Teacher = require('./Teacher');

// Student model
const Student = sequelize.define('Student', {
    Email: {
        type: DataTypes.STRING(50),
        primaryKey: true,  // primary key
        allowNull: false,
        unique: true,
      },
      FName: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      LName: {
        type: DataTypes.STRING(50),
        allowNull: false,  
      },
      StudentIndex: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      Class: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      IsSuspended: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      }
}, {
    tableName: 'Student',
    timestamps: false,
});

Student.sync()
  .then(() => console.log('Student table created successfully'))
  .catch((err) => console.error('Error creating table:', err));

module.exports = Student;