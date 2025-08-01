import { saveRadius as saveRadiusToStorage, saveAttendance as saveAttendanceToStorage } from './localStorage';

export const api = {
  async saveRadius(teacherId, teacherName, radius) {
    try {
      // Save to localStorage instead of backend
      saveRadiusToStorage(teacherId, radius);
      return true;
    } catch (error) {
      console.error('Error saving radius:', error);
      return false;
    }
  },

  async saveAttendance(teacherId, teacherName) {
    try {
      // Save to localStorage instead of backend
      saveAttendanceToStorage(teacherId);
      return true;
    } catch (error) {
      console.error('Error saving attendance:', error);
      return false;
    }
  },
};