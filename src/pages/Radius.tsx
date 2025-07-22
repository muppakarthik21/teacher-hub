import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { getTodayRadius, saveRadius } from '@/utils/localStorage';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Save, CheckCircle } from 'lucide-react';

const Radius = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [radius, setRadius] = useState('');
  const [todayRadius, setTodayRadius] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      const existingRadius = getTodayRadius(user.id);
      setTodayRadius(existingRadius);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !radius) return;

    const radiusValue = parseInt(radius);
    if (isNaN(radiusValue) || radiusValue < 0) {
      toast({
        variant: "destructive",
        title: "Invalid radius",
        description: "Please enter a valid positive number.",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      saveRadius(user.id, radiusValue);
      setTodayRadius({ radius: radiusValue, date: new Date().toISOString().split('T')[0] });
      setRadius('');
      
      toast({
        title: "Radius saved successfully!",
        description: `Your distance of ${radiusValue}m has been recorded for today.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save radius. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <div className="flex items-center gap-3 mb-6">
          <MapPin className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Distance Input</h1>
        </div>

        {todayRadius ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="shadow-lg border-success">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-success" />
                  <CardTitle className="text-success">Distance Already Recorded</CardTitle>
                </div>
                <CardDescription>
                  You have already set your distance for today
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="text-4xl font-bold text-success mb-2">
                    {todayRadius.radius}m
                  </div>
                  <p className="text-muted-foreground">
                    Distance from institute recorded for {new Date().toLocaleDateString()}
                  </p>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground text-center">
                    You can only set your distance once per day. Come back tomorrow to update it.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Set Your Distance</CardTitle>
                <CardDescription>
                  Enter your current distance from the institute in meters (once per day)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="radius">Distance (meters)</Label>
                    <Input
                      id="radius"
                      type="number"
                      value={radius}
                      onChange={(e) => setRadius(e.target.value)}
                      placeholder="Enter distance in meters (e.g., 500)"
                      required
                      min="0"
                      className="text-lg"
                    />
                    <p className="text-sm text-muted-foreground">
                      This helps track your proximity to the institute for attendance verification
                    </p>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                      Distance Guidelines:
                    </h3>
                    <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                      <li>• 0-100m: On campus</li>
                      <li>• 100-500m: Very close to institute</li>
                      <li>• 500-1000m: Walking distance</li>
                      <li>• 1000+m: Requires transportation</li>
                    </ul>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting || !radius}
                    style={{ background: 'var(--gradient-primary)' }}
                  >
                    {isSubmitting ? (
                      <>
                        <Save className="mr-2 h-4 w-4 animate-spin" />
                        Saving Distance...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Distance
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    Once set, you cannot change today's distance. Make sure the value is accurate.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Radius;