import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState({
    id: 'default-user',
    name: 'Teacher',
    email: 'teacher@school.com',
    employeeId: 'EMP001',
    contactNumber: '+91 9876543210',
    radiusSubmitted: false,
    attendanceSubmitted: false
  });

  const updateUserStatus = (updates) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
    }
  };

  return React.createElement(
    AuthContext.Provider,
    { value: { user, updateUserStatus } },
    children
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}