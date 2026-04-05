"use client";

import { useDashboard } from '@/context/DashboardContext';
import { useAuth } from '@/hooks/useAuth';
import {
  Globe,
  ShieldCheck,
  User,
  ChevronRight,
  LayoutDashboard,
  History,
  BarChart3,
  AlertCircle
} from 'lucide-react';

const REGIONS = ['All Regions', 'US-EAST', 'US-WEST', 'EU-CENTRAL', 'APAC'];

export default function Sidebar() {
  const { selectedRegion, setSelectedRegion } = useDashboard();
  const { role, setRole, isAdmin } = useAuth();

  const menuItems = [
    { label: 'Market Terminals', icon: LayoutDashboard, active: true },
    { label: 'Real-time Feed', icon: History, active: false },
    { label: 'Risk Portfolio', icon: AlertCircle, active: false },
    { label: 'Analytics Hub', icon: BarChart3, active: false },
  ];

  return (
    <aside className="w-full h-full flex flex-col bg-background border-r border-border-grid">
      <div className="p-5 border-b border-border-grid">
        <h2 className="font-black tracking-[0.2em] text-brand text-lg uppercase">ZORVYN</h2>
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Institutional Terminal</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-8 scrollbar-hide">
        {/* Navigation Stubs */}
        <div>
          <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mb-4 opacity-50">NAVIGATION</p>
          <div className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.label}
                className={`w-full flex items-center justify-between p-2.5 rounded-sm transition-all border group ${item.active
                  ? 'bg-brand/10 text-brand border-brand/20 font-black'
                  : 'border-transparent text-zinc-500 hover:text-brand hover:bg-zinc-200 hover:border-zinc-300 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/10 dark:hover:border-zinc-700'
                  }`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon size={16} />
                  <span className="text-[11px] font-bold uppercase tracking-tight">{item.label}</span>
                </div>
                {item.active && <ChevronRight size={12} />}
              </button>
            ))}
          </div>
        </div>

        {/* Region Filter - GLOBAL FILTER */}
        <div>
          <div className="flex items-center space-x-2 mb-4 opacity-50">
            <Globe size={12} className="text-gray-500 dark:text-zinc-400" />
            <p className="text-[10px] text-gray-500 dark:text-zinc-400 font-black uppercase tracking-[0.2em]">DOMAIN ACCESS</p>
          </div>
          <div className="space-y-2">
            {REGIONS.map((region) => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`w-full flex items-center px-3 py-2 rounded-sm text-[11px] font-black border transition-all ${selectedRegion === region
                  ? 'bg-[#FFA028] text-black border-[#FFA028] shadow-md'
                  : 'bg-zinc-100 dark:bg-zinc-800/50 border-zinc-300 dark:border-border-grid text-zinc-700 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
              >
                {region}
              </button>
            ))}
          </div>
        </div>

        {/* Role Toggle - FOR TESTING CRUD */}
        <div>
          <div className="flex items-center space-x-2 mb-4 opacity-50">
            <ShieldCheck size={12} className="text-gray-500 dark:text-zinc-400" />
            <p className="text-[10px] text-gray-500 dark:text-zinc-400 font-black uppercase tracking-[0.2em]">ACCESS PROTOCOL</p>
          </div>
          <div className="bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-300 dark:border-border-grid p-3 rounded-sm shadow-sm transition-colors">
            <div className="flex items-center justify-between mb-3 text-[10px] font-black uppercase tracking-tighter">
              <button
                onClick={() => setRole('admin')}
                className={isAdmin ? 'text-[#FFA028] font-black' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors'}
              >
                ADMIN
              </button>
              <button
                onClick={() => setRole('viewer')}
                className={!isAdmin ? 'text-[#FFA028] font-black' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors'}
              >
                VIEWER
              </button>
            </div>
            <button
              onClick={() => setRole(isAdmin ? 'viewer' : 'admin')}
              className="w-full h-8 bg-zinc-200 dark:bg-zinc-900 border border-zinc-300 dark:border-border-grid rounded-full p-1 cursor-pointer flex items-center relative overflow-hidden group/toggle shadow-inner transition-colors"
            >
              <div
                className={`w-1/2 h-full bg-zinc-900 dark:bg-zinc-700 rounded-full transition-all duration-300 transform shadow-md ${isAdmin ? 'translate-x-0' : 'translate-x-[100%]'
                  }`}
              />
              <div className="absolute inset-0 flex items-center justify-between px-3 pointer-events-none">
                <ShieldCheck size={12} className={isAdmin ? 'text-[#FFA028]' : 'text-zinc-500 dark:text-zinc-400'} />
                <User size={12} className={!isAdmin ? 'text-[#FFA028]' : 'text-zinc-500 dark:text-zinc-400'} />
              </div>
            </button>
            <p className="text-[9px] text-zinc-600 dark:text-zinc-400 mt-3 italic leading-relaxed font-bold">
              {isAdmin
                ? "READ/WRITE ACCESS ENABLED: All ledger modification protocols are active."
                : "READ-ONLY ACCESS: Transaction modification restricted by system policy."
              }
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 border-t border-border-grid bg-black/10">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-sm bg-zinc-400/20 flex items-center justify-center border border-zinc-600/10 dark:border-brand/10 dark:bg-brand/20">
            <span className="text-[11px] font-black text-zinc-600 dark:text-brand">MR</span>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-zinc-600 dark:text-brand">USER_PRIME_X1</p>
            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-tighter">Verified Node</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
