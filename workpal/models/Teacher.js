const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Define the Teacher model
const Teacher = sequelize.define('Teacher', {
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
  TeacherID: {
    type: DataTypes.INTEGER,
    allowNull: false,  
  },
  Dept: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
}, {
    tableName: 'Teacher',
    timestamps: false,
});

Teacher.sync()
  .then(() => console.log('Teacher table created successfully'))
  .catch((err) => console.error('Error creating table:', err));

module.exports = Teacher;
