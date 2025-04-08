const { Sequelize } = require('sequelize');

// Establish a connection to your MySQL database, if user has a password enter password
const sequelize = new Sequelize('workpal_db', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  dialectOptions: {
    charset: 'utf8mb4',
  },
  define: {
    timestamps: false,
  },
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Test the connection
sequelize.authenticate()
  .then(() => console.log('Connection established successfully.'))
  .catch(err => console.error('Unable to connect to the database:', err));

module.exports = sequelize;
