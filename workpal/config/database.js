const { Sequelize } = require('sequelize');

// Establish a connection to your MySQL database, if user has a password enter password
const sequelize = new Sequelize('workpal_db', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

// Test the connection
sequelize.authenticate()
  .then(() => console.log('Connection established successfully.'))
  .catch(err => console.error('Unable to connect to the database:', err));

module.exports = sequelize;
