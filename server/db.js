const mysql = require('mysql2');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '123456',     // replace with your MySQL password
  database: 'teacher_mgmt1',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test the connection
db.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Successfully connected to database');
  connection.release();
});

module.exports = db;