import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/utils/api';
import { useToast } from '@/hooks/use-toast';
import { formatInTimeZone } from 'date-fns-tz';
import { saveRadius } from '@/utils/localStorage';
import { MapPin, Save, CheckCircle, Loader2, AlertTriangle, Navigation } from 'lucide-react';

// Institute location coordinates
const INSTITUTE_LOCATION = {
  lat: 17.435019,
  lng: 78.392648,
  address: "Vishnu Kalpa, Amar Co-Operative Society, Madhapur, Hyderabad, Telangana 500033"
};

const MAX_RADIUS = 700; // 700 meters

// Function to calculate distance between two coordinates using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  const distance = R * c;
  return Math.round(distance);
};

const Radius = () => {
  const { user, updateUserStatus } = useAuth();
  const { toast } = useToast();
  const [todayRadius, setTodayRadius] = useState(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [calculatedDistance, setCalculatedDistance] = useState(null);
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    if (user && user.radiusSubmitted) {
      setTodayRadius({ 
        radius: 'Already submitted', 
        date: new Date().toISOString().split('T')[0] 
      });
    }
  }, [user]);

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser.");
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ lat: latitude, lng: longitude });
        
        const distance = calculateDistance(
          latitude, 
          longitude, 
          INSTITUTE_LOCATION.lat, 
          INSTITUTE_LOCATION.lng
        );
        
        setCalculatedDistance(distance);
        setIsGettingLocation(false);

        if (distance > MAX_RADIUS) {
          toast({
            variant: "destructive",
            title: "Outside allowed radius",
            description: `You are ${distance}m away from the institute. Maximum allowed distance is ${MAX_RADIUS}m.`,
          });
        }
      },
      (error) => {
        let errorMessage = "Failed to get your location.";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied. Please enable location permissions.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
        }
        setLocationError(errorMessage);
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const handleSubmit = async () => {
    if (!user || calculatedDistance === null) return;

    if (calculatedDistance > MAX_RADIUS) {
      toast({
        variant: "destructive",
        title: "Cannot save distance",
        description: `You are outside the allowed radius of ${MAX_RADIUS}m.`,
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      const success = await api.saveRadius(user.id, user.name, calculatedDistance);
      
      if (success) {
        // Update user status in context
        updateUserStatus({ radiusSubmitted: true });
        
        // Save to localStorage for dashboard
        saveRadius(user.id, calculatedDistance);
        
        setTodayRadius({ 
          radius: calculatedDistance, 
          date: new Date().toISOString().split('T')[0],
          coordinates: currentLocation
        });
        
        const indiaTime = formatInTimeZone(new Date(), 'Asia/Kolkata', 'PPpp');
        
        toast({
          title: "Distance saved successfully!",
          description: `Your distance of ${calculatedDistance}m has been recorded at ${indiaTime}.`,
        });
      } else {
        throw new Error('Failed to save radius');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save distance. Please try again.",
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
          <Navigation className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Location Tracking</h1>
        </div>

        {/* Institute Location Info */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card className="border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Institute Location</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{INSTITUTE_LOCATION.address}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Maximum allowed distance: {MAX_RADIUS} meters
              </p>
            </CardContent>
          </Card>
        </motion.div>

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
                  You have already recorded your distance for today
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
                    You can only record your location once per day. Come back tomorrow to update it.
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
                <CardTitle>Track Your Location</CardTitle>
                <CardDescription>
                  Click the button below to automatically detect your distance from the institute
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {!currentLocation ? (
                  <div className="text-center">
                    <Button 
                      onClick={getCurrentLocation}
                      disabled={isGettingLocation}
                      className="w-full"
                      style={{ background: 'var(--gradient-primary)' }}
                    >
                      {isGettingLocation ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Getting Your Location...
                        </>
                      ) : (
                        <>
                          <Navigation className="mr-2 h-4 w-4" />
                          Get My Location
                        </>
                      )}
                    </Button>
                    
                    {locationError && (
                      <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-destructive" />
                          <p className="text-sm text-destructive">{locationError}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center p-6 bg-muted rounded-lg">
                      <div className="text-3xl font-bold mb-2">
                        {calculatedDistance}m
                      </div>
                      <p className="text-muted-foreground">
                        Distance from institute
                      </p>
                      {calculatedDistance && calculatedDistance <= MAX_RADIUS && (
                        <p className="text-success text-sm mt-2">
                          ✓ Within allowed radius
                        </p>
                      )}
                      {calculatedDistance && calculatedDistance > MAX_RADIUS && (
                        <p className="text-destructive text-sm mt-2">
                          ✗ Outside allowed radius
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-muted-foreground">Your Location</p>
                        <p className="font-medium">
                          {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
                        </p>
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-muted-foreground">Institute Location</p>
                        <p className="font-medium">
                          {INSTITUTE_LOCATION.lat}, {INSTITUTE_LOCATION.lng}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        onClick={getCurrentLocation}
                        disabled={isGettingLocation}
                        className="flex-1"
                      >
                        <Navigation className="mr-2 h-4 w-4" />
                        Refresh Location
                      </Button>
                      
                      <Button 
                        onClick={handleSubmit}
                        disabled={isSubmitting || calculatedDistance === null || calculatedDistance > MAX_RADIUS}
                        className="flex-1"
                        style={{ background: 'var(--gradient-primary)' }}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Distance
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                    Distance Guidelines:
                  </h3>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    <li>• 0-100m: On campus</li>
                    <li>• 100-500m: Very close to institute</li>
                    <li>• 500-700m: Within allowed range</li>
                    <li>• 700+m: <span className="text-destructive font-medium">Outside allowed radius</span></li>
                  </ul>
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