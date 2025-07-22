import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getTimetable, getTodayTimetable } from '@/utils/localStorage';
import { Calendar, Clock, BookOpen, Users } from 'lucide-react';

const Timetable = () => {
  const [selectedDay, setSelectedDay] = useState(new Date().toLocaleDateString('en-US', { weekday: 'long' }));
  const [viewMode, setViewMode] = useState<'today' | 'weekly'>('today');

  const allTimetable = getTimetable();
  const todayTimetable = getTodayTimetable();
  
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  const getScheduleForDay = (day: string) => {
    return allTimetable.filter(entry => entry.day === day);
  };

  const currentDaySchedule = getScheduleForDay(selectedDay);

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Timetable</h1>
        </div>

        {/* View Mode Toggle */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={viewMode === 'today' ? 'default' : 'outline'}
            onClick={() => setViewMode('today')}
          >
            Today's Schedule
          </Button>
          <Button
            variant={viewMode === 'weekly' ? 'default' : 'outline'}
            onClick={() => setViewMode('weekly')}
          >
            Weekly View
          </Button>
        </div>

        {viewMode === 'today' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-6 w-6 text-primary" />
                  Today's Classes
                </CardTitle>
                <CardDescription>
                  Your schedule for {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {todayTimetable.length > 0 ? (
                  <div className="space-y-4">
                    {todayTimetable.map((entry, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-4 p-4 bg-muted rounded-lg"
                      >
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                            <Clock className="h-6 w-6 text-primary-foreground" />
                          </div>
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-semibold text-lg">{entry.subject}</h3>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              {entry.timeSlot}
                            </span>
                            <span className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Users className="h-4 w-4" />
                              {entry.class}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Classes Today</h3>
                    <p className="text-muted-foreground">
                      {new Date().getDay() === 0 ? 'Enjoy your Sunday!' : 'You have no scheduled classes today.'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* Day Selection */}
            <div className="flex flex-wrap gap-2">
              {days.map((day) => (
                <Button
                  key={day}
                  variant={selectedDay === day ? 'default' : 'outline'}
                  onClick={() => setSelectedDay(day)}
                  className="min-w-0"
                >
                  {day}
                </Button>
              ))}
            </div>

            {/* Selected Day Schedule */}
            <motion.div
              key={selectedDay}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-6 w-6 text-primary" />
                    {selectedDay} Schedule
                  </CardTitle>
                  <CardDescription>
                    Classes scheduled for {selectedDay}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {currentDaySchedule.length > 0 ? (
                    <div className="space-y-4">
                      {currentDaySchedule.map((entry, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center gap-4 p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                        >
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                              <BookOpen className="h-6 w-6 text-primary-foreground" />
                            </div>
                          </div>
                          <div className="flex-grow">
                            <h3 className="font-semibold text-lg">{entry.subject}</h3>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                {entry.timeSlot}
                              </span>
                              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Users className="h-4 w-4" />
                                {entry.class}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Classes Scheduled</h3>
                      <p className="text-muted-foreground">
                        No classes are scheduled for {selectedDay}.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Weekly Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Weekly Overview</CardTitle>
                  <CardDescription>Summary of your weekly teaching schedule</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary">{allTimetable.length}</div>
                      <p className="text-sm text-muted-foreground">Total Classes</p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary">6</div>
                      <p className="text-sm text-muted-foreground">Working Days</p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {Math.round(allTimetable.length / 6 * 10) / 10}
                      </div>
                      <p className="text-sm text-muted-foreground">Avg Classes/Day</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Timetable;