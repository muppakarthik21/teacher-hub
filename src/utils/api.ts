const API_BASE_URL = 'http://localhost:5000/api';

export const api = {
  async saveRadius(teacherId: string, teacherName: string, radius: number) {
    try {
      const response = await fetch(`${API_BASE_URL}/radius-logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teacherId,
          teacherName,
          radius,
          timestamp: new Date().toISOString(),
        }),
      });

      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Error saving radius:', error);
      return false;
    }
  },

  async saveAttendance(teacherId: string, teacherName: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/attendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teacherId,
          teacherName,
          timestamp: new Date().toISOString(),
        }),
      });

      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Error saving attendance:', error);
      return false;
    }
  },
};