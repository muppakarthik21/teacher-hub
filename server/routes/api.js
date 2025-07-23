const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');


// Teacher validation middleware
const validateTeacher = async (req, res, next) => {
  const { teacherId } = req.body;
  
  if (!teacherId) {
    return res.status(400).json({ success: false, message: 'Teacher ID is required' });
  }

  try {
    const [rows] = await db.promise().query(
      'SELECT * FROM teachers WHERE id = ?',
      [teacherId]
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    req.teacher = rows[0];
    next();
  } catch (error) {
    console.error('Validation error:', error);
    res.status(500).json({ success: false, message: 'Validation failed' });
  }
};

// REGISTER
router.post('/register', async (req, res) => {
  const { name, email, employeeId, contactNumber, password } = req.body;

  try {
    const checkEmail = 'SELECT * FROM teachers WHERE email = ?';
    const [existing] = await db.promise().query(checkEmail, [email]);

    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    const insert = 'INSERT INTO teachers (name, email, employee_id, contact_number, password) VALUES (?, ?, ?, ?, ?)';
    await db.promise().query(insert, [name, email, employeeId, contactNumber, password]);

    res.status(201).json({ success: true, message: 'Teacher registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);  // 🪵 LOG ERROR
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const query = 'SELECT * FROM teachers WHERE email = ? AND password = ?';
    const [rows] = await db.promise().query(query, [email, password]);

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const teacher = rows[0];
    
    // Check if submissions were made today
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    const radiusSubmitted = teacher.last_radius_check && 
      teacher.last_radius_check.toISOString().split('T')[0] === today;
    const attendanceSubmitted = teacher.last_attendance_time && 
      teacher.last_attendance_time.toISOString().split('T')[0] === today;

    res.status(200).json({
      success: true,
      teacher: {
        id: teacher.id,
        name: teacher.name,
        email: teacher.email,
        employeeId: teacher.employee_id,
        contactNumber: teacher.contact_number,
        radiusSubmitted: Boolean(radiusSubmitted),
        attendanceSubmitted: Boolean(attendanceSubmitted)
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
});

// Apply middleware to protected routes
router.post('/radius-logs', async (req, res) => {
  const { teacherId, teacherName, radius, timestamp } = req.body;

  try {
    const mysqlTimestamp = new Date(timestamp).toISOString().slice(0, 19).replace('T', ' ');
    const connection = await db.promise().getConnection();
    
    await connection.beginTransaction();
    try {
      // Insert radius log
      await connection.query(
        'INSERT INTO radius_logs (teacher_id, name, radius_in_meters, timestamp) VALUES (?, ?, ?, ?)',
        [teacherId, teacherName, radius, mysqlTimestamp]
      );

      // Update teacher's last_radius_check time
      await connection.query(
        'UPDATE teachers SET last_radius_check = ? WHERE id = ?',
        [mysqlTimestamp, teacherId]
      );

      await connection.commit();
      res.json({ success: true });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/attendance', async (req, res) => {
  const { teacherId, teacherName, timestamp } = req.body;

  try {
    const mysqlTimestamp = new Date(timestamp).toISOString().slice(0, 19).replace('T', ' ');
    const connection = await db.promise().getConnection();
    
    await connection.beginTransaction();
    try {
      // Insert attendance record
      await connection.query(
        'INSERT INTO attendance (teacher_id, name, attendance_time) VALUES (?, ?, ?)',
        [teacherId, teacherName, mysqlTimestamp]
      );

      // Update teacher's last_attendance_time
      await connection.query(
        'UPDATE teachers SET last_attendance_time = ? WHERE id = ?',
        [mysqlTimestamp, teacherId]
      );

      await connection.commit();
      res.json({ success: true });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});



module.exports = router;