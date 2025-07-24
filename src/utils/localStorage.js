// Utility functions for managing local storage data

// Get today's date in YYYY-MM-DD format
export const getTodayDate = () => {
  return new Date().toISOString().split('T')[0];
};

// Radius functions
export const getTodayRadius = (userId) => {
  const key = `radius_${userId}`;
  const data = localStorage.getItem(key);
  if (!data) return null;
  
  const entries = JSON.parse(data);
  const today = getTodayDate();
  return entries.find(entry => entry.date === today) || null;
};

export const saveRadius = (userId, radius) => {
  const key = `radius_${userId}`;
  const existing = localStorage.getItem(key);
  const entries = existing ? JSON.parse(existing) : [];
  
  const today = getTodayDate();
  const newEntry = {
    date: today,
    radius,
    timestamp: new Date().toISOString()
  };
  
  // Remove any existing entry for today and add new one
  const filtered = entries.filter(entry => entry.date !== today);
  filtered.push(newEntry);
  
  localStorage.setItem(key, JSON.stringify(filtered));
};

export const getRadiusHistory = (userId) => {
  const key = `radius_${userId}`;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

// Attendance functions
export const getTodayAttendance = (userId) => {
  const key = `attendance_${userId}`;
  const data = localStorage.getItem(key);
  if (!data) return null;
  
  const entries = JSON.parse(data);
  const today = getTodayDate();
  return entries.find(entry => entry.date === today) || null;
};

export const saveAttendance = (userId) => {
  const key = `attendance_${userId}`;
  const existing = localStorage.getItem(key);
  const entries = existing ? JSON.parse(existing) : [];
  
  const today = getTodayDate();
  const now = new Date();
  const newEntry = {
    date: today,
    checkInTime: now.toLocaleTimeString(),
    timestamp: now.toISOString()
  };
  
  // Remove any existing entry for today and add new one
  const filtered = entries.filter(entry => entry.date !== today);
  filtered.push(newEntry);
  
  localStorage.setItem(key, JSON.stringify(filtered));
};

export const getAttendanceHistory = (userId) => {
  const key = `attendance_${userId}`;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

// Timetable functions
export const getTimetable = () => {
  const timetable = [
    { day: 'Monday', timeSlot: '9:00-10:00', subject: 'Mathematics', class: 'Grade 10A' },
    { day: 'Monday', timeSlot: '10:00-11:00', subject: 'Physics', class: 'Grade 11B' },
    { day: 'Monday', timeSlot: '11:30-12:30', subject: 'Mathematics', class: 'Grade 12A' },
    { day: 'Tuesday', timeSlot: '9:00-10:00', subject: 'Physics', class: 'Grade 10B' },
    { day: 'Tuesday', timeSlot: '10:00-11:00', subject: 'Mathematics', class: 'Grade 11A' },
    { day: 'Tuesday', timeSlot: '11:30-12:30', subject: 'Physics', class: 'Grade 12B' },
    { day: 'Wednesday', timeSlot: '9:00-10:00', subject: 'Mathematics', class: 'Grade 9A' },
    { day: 'Wednesday', timeSlot: '10:00-11:00', subject: 'Physics', class: 'Grade 10A' },
    { day: 'Wednesday', timeSlot: '11:30-12:30', subject: 'Mathematics', class: 'Grade 11B' },
    { day: 'Thursday', timeSlot: '9:00-10:00', subject: 'Physics', class: 'Grade 9B' },
    { day: 'Thursday', timeSlot: '10:00-11:00', subject: 'Mathematics', class: 'Grade 10B' },
    { day: 'Thursday', timeSlot: '11:30-12:30', subject: 'Physics', class: 'Grade 11A' },
    { day: 'Friday', timeSlot: '9:00-10:00', subject: 'Mathematics', class: 'Grade 12B' },
    { day: 'Friday', timeSlot: '10:00-11:00', subject: 'Physics', class: 'Grade 9A' },
    { day: 'Friday', timeSlot: '11:30-12:30', subject: 'Mathematics', class: 'Grade 9B' },
    { day: 'Saturday', timeSlot: '9:00-10:00', subject: 'Physics', class: 'Grade 12A' },
    { day: 'Saturday', timeSlot: '10:00-11:00', subject: 'Mathematics', class: 'Grade 10A' },
  ];
  
  return timetable;
};

export const getTodayTimetable = () => {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  return getTimetable().filter(entry => entry.day === today);
};