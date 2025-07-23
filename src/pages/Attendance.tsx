import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/utils/api';
import { useToast } from '@/hooks/use-toast';
import { Clock, CheckCircle, MapPin, AlertTriangle } from 'lucide-react';

const Attendance = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [hasSubmittedRadius, setHasSubmittedRadius] = useState(false);
  const [hasMarkedAttendance, setHasMarkedAttendance] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setHasMarkedAttendance(user.attendanceSubmitted);
      setHasSubmittedRadius(user.radiusSubmitted);
    }
  }, [user]);

  const handleMarkAttendance = async () => {
    if (!user) return;

    setIsSubmitting(true);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
      const success = await api.saveAttendance(user.id, user.name);
      
      if (success) {
        setHasMarkedAttendance(true);
        const attendanceTime = new Date().toLocaleTimeString();
        
        toast({
          title: "Attendance marked successfully!",
          description: `Your attendance has been recorded for ${attendanceTime}.`,
        });
      } else {
        throw new Error('Failed to save attendance');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to mark attendance. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const canMarkAttendance = hasSubmittedRadius && !hasMarkedAttendance;

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <div className="flex items-center gap-3 mb-6">
          <Clock className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Mark Attendance</h1>
        </div>

        {/* Radius Status Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card className={`shadow-lg ${hasSubmittedRadius ? 'border-success' : 'border-warning'}`}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MapPin className={`h-6 w-6 ${hasSubmittedRadius ? 'text-success' : 'text-warning'}`} />
                <CardTitle className={hasSubmittedRadius ? 'text-success' : 'text-warning'}>
                  Distance Status
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {hasSubmittedRadius ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold">✓ Submitted</p>
                    <p className="text-sm text-muted-foreground">Distance recorded for today</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-success" />
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold text-warning">Not Set</p>
                    <p className="text-sm text-muted-foreground">You must set your distance first</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-warning" />
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Attendance Marking Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          {hasMarkedAttendance ? (
            <Card className="shadow-lg border-success">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-success" />
                  <CardTitle className="text-success">Attendance Already Marked</CardTitle>
                </div>
                <CardDescription>
                  You have successfully marked your attendance for today
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="text-4xl font-bold text-success mb-2">
                    ✓ Present
                  </div>
                  <p className="text-lg mb-2">
                    Attendance marked for today
                  </p>
                  <p className="text-muted-foreground">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground text-center">
                    Your attendance has been recorded successfully. You cannot mark attendance multiple times per day.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Mark Your Attendance</CardTitle>
                <CardDescription>
                  Click the button below to mark your attendance for today
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!hasSubmittedRadius ? (
                  <div className="text-center py-8">
                    <AlertTriangle className="h-16 w-16 text-warning mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Distance Required</h3>
                    <p className="text-muted-foreground mb-6">
                      You must set your distance from the institute before marking attendance.
                    </p>
                    <Button 
                      onClick={() => window.location.href = '/radius'}
                      variant="outline"
                    >
                      <MapPin className="mr-2 h-4 w-4" />
                      Set Distance First
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="text-center py-4">
                      <Clock className="h-16 w-16 text-primary mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Ready to Mark Attendance</h3>
                      <p className="text-muted-foreground">
                        Current time: {new Date().toLocaleTimeString()}
                      </p>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                      <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                        Attendance Requirements:
                      </h4>
                      <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                        <li>✓ Distance recorded for today</li>
                        <li>✓ Within working hours</li>
                        <li>✓ One-time daily marking</li>
                      </ul>
                    </div>

                    <Button 
                      onClick={handleMarkAttendance}
                      className="w-full" 
                      disabled={isSubmitting || !canMarkAttendance}
                      style={{ background: 'var(--gradient-success)' }}
                    >
                      {isSubmitting ? (
                        <>
                          <Clock className="mr-2 h-4 w-4 animate-spin" />
                          Marking Attendance...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Mark Present
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Attendance;