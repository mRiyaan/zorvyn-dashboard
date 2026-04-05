"use client";

import { useDashboard } from '@/context/DashboardContext';
import Sidebar from './Sidebar';
import { X, Menu } from 'lucide-react';

export default function MobileNav() {
  const { isSidebarOpen, setIsSidebarOpen } = useDashboard();

  return (
    <>
      {/* Drawer Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Drawer Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 w-72 bg-background z-[101] shadow-2xl transition-transform duration-300 lg:hidden transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button 
          onClick={() => setIsSidebarOpen(false)}
          className="absolute top-4 right-4 p-1 text-gray-500 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
        <div className="h-full pt-10">
          <Sidebar />
        </div>
      </div>
    </>
  );
}

export function MobileTrigger() {
  const { setIsSidebarOpen } = useDashboard();
  return (
    <button 
      onClick={() => setIsSidebarOpen(true)}
      className="p-2 -ml-2 text-gray-400 hover:text-white transition-colors lg:hidden"
      title="Open Dashboard Menu"
    >
      <Menu size={20} />
    </button>
  );
}
