"use client";

import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Default role: admin (toggle-able for demo purposes)
  const [role, setRole] = useState('admin');

  const value = {
    role,
    setRole,
    isAdmin: role === 'admin',
    isViewer: role === 'viewer',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
