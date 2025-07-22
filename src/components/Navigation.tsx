import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  MapPin, 
  Clock, 
  Calendar, 
  LogOut, 
  User,
  GraduationCap 
} from 'lucide-react';

const Navigation = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/radius', label: 'Distance', icon: MapPin },
    { path: '/attendance', label: 'Attendance', icon: Clock },
    { path: '/timetable', label: 'Timetable', icon: Calendar },
  ];

  return (
    <motion.nav
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-card border-r shadow-lg h-screen w-64 flex-shrink-0 flex flex-col"
    >
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg" style={{ background: 'var(--gradient-primary)' }}>
            <GraduationCap className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-bold text-lg">TeacherApp</h2>
            <p className="text-sm text-muted-foreground">Management System</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <User className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <p className="font-medium text-sm">{user?.name}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 p-4">
        <div className="space-y-2">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Button
                  variant={isActive ? 'default' : 'ghost'}
                  className={`w-full justify-start gap-3 ${
                    isActive ? '' : 'hover:bg-accent'
                  }`}
                  onClick={() => navigate(item.path)}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t">
        <Button
          variant="outline"
          className="w-full justify-start gap-3 hover:bg-destructive hover:text-destructive-foreground"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </motion.nav>
  );
};

export default Navigation;