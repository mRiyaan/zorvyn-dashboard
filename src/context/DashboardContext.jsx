"use client";

import { createContext, useContext, useState, useMemo } from 'react';

const DashboardContext = createContext(null);

export function DashboardProvider({ children }) {
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const value = useMemo(() => ({
    selectedRegion,
    setSelectedRegion,
    isSidebarOpen,
    setIsSidebarOpen,
    toggleSidebar: () => setIsSidebarOpen(prev => !prev),
    closeSidebar: () => setIsSidebarOpen(false),
  }), [selectedRegion, isSidebarOpen]);

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}
