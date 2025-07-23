import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { getRadiusHistory, getAttendanceHistory, getTodayRadius, getTodayAttendance } from '@/utils/localStorage';
import { Calendar, MapPin, Clock, BarChart3 } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const { user } = useAuth();
  const [radiusHistory, setRadiusHistory] = useState<any[]>([]);
  const [attendanceHistory, setAttendanceHistory] = useState<any[]>([]);
  const [todayRadius, setTodayRadius] = useState<any>(null);
  const [todayAttendance, setTodayAttendance] = useState<any>(null);

  useEffect(() => {
    if (user) {
      setRadiusHistory(getRadiusHistory(user.id));
      setAttendanceHistory(getAttendanceHistory(user.id));
      setTodayRadius(getTodayRadius(user.id));
      setTodayAttendance(getTodayAttendance(user.id));
    }
  }, [user]);

  // Refresh data when component mounts or becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user) {
        setRadiusHistory(getRadiusHistory(user.id));
        setAttendanceHistory(getAttendanceHistory(user.id));
        setTodayRadius(getTodayRadius(user.id));
        setTodayAttendance(getTodayAttendance(user.id));
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [user]);

  const getWeeklyAttendance = () => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const attendance = attendanceHistory.find(a => a.date === dateStr);
      last7Days.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        present: attendance ? 1 : 0
      });
    }
    return last7Days;
  };

  const weeklyData = getWeeklyAttendance();
  
  const barChartData = {
    labels: weeklyData.map(d => d.date),
    datasets: [
      {
        label: 'Attendance',
        data: weeklyData.map(d => d.present),
        backgroundColor: 'hsl(217.2 91.2% 59.8% / 0.8)',
        borderColor: 'hsl(217.2 91.2% 59.8%)',
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const attendanceRate = attendanceHistory.length > 0 ? 
    Math.round((attendanceHistory.length / 30) * 100) : 0;

  const doughnutData = {
    labels: ['Present', 'Absent'],
    datasets: [
      {
        data: [attendanceRate, 100 - attendanceRate],
        backgroundColor: [
          'hsl(142.1 76.2% 36.3%)',
          'hsl(0 84.2% 60.2%)',
        ],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 1,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  Today's Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {todayAttendance ? 'Present' : 'Not Marked'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {todayAttendance ? `Checked in at ${todayAttendance.checkInTime}` : 'Mark your attendance'}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  Today's Radius
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {todayRadius ? `${todayRadius.radius}m` : 'Not Set'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Distance from institute
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  Total Days Present
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{attendanceHistory.length}</div>
                <p className="text-xs text-muted-foreground">
                  This month
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{attendanceRate}%</div>
                <p className="text-xs text-muted-foreground">
                  Monthly average
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Weekly Attendance</CardTitle>
                <CardDescription>Your attendance for the last 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <Bar data={barChartData} options={chartOptions} />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Monthly Overview</CardTitle>
                <CardDescription>Attendance rate for this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center">
                  <Doughnut data={doughnutData} options={doughnutOptions} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Recent Radius Logs</CardTitle>
                <CardDescription>Your recent distance entries</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {radiusHistory.slice(-5).reverse().map((entry, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">{entry.radius}m</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(entry.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                      <MapPin className="h-4 w-4 text-primary" />
                    </div>
                  ))}
                  {radiusHistory.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">No radius entries yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Recent Attendance</CardTitle>
                <CardDescription>Your recent check-ins</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {attendanceHistory.slice(-5).reverse().map((entry, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">{entry.checkInTime}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(entry.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                      <Clock className="h-4 w-4 text-success" />
                    </div>
                  ))}
                  {attendanceHistory.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">No attendance records yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;