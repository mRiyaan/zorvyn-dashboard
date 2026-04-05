import { ThemeToggle } from "@/components/ThemeToggle";
import { AuthProvider } from "@/hooks/useAuth";
import { DashboardProvider } from "@/context/DashboardContext";
import Sidebar from "@/components/Sidebar";
import MobileNav, { MobileTrigger } from "@/components/MobileNav";

export default function DashboardLayout({ children }) {
  return (
    <AuthProvider>
      <DashboardProvider>
        <div className="flex h-screen overflow-hidden bg-background text-foreground transition-colors duration-300">
          
          {/* Mobile Drawer Navigation (Slide-out) */}
          <MobileNav />

          {/* Desktop Fixed Sidebar (1024px+) */}
          <aside className="w-64 h-full hidden lg:flex flex-col flex-shrink-0">
             <Sidebar />
          </aside>

          {/* Main Viewport */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
            
            {/* Contextual Navbar */}
            <header className="h-14 border-b border-border-grid flex items-center justify-between px-4 sticky top-0 bg-background/80 backdrop-blur-md z-40 transition-colors">
               <div className="flex items-center space-x-3">
                  <MobileTrigger />
                  <div className="h-4 w-px bg-border-grid lg:hidden" />
                  <span className="text-[10px] font-black tracking-[0.2em] uppercase opacity-60">
                    Terminal Prime <span className="text-brand opacity-100">// Executive Workspace</span>
                  </span>
               </div>
               
               <div className="flex items-center space-x-3">
                  <div className="hidden sm:flex flex-col items-end mr-2">
                     <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">NETWORK_STATUS</span>
                     <span className="text-[9px] font-bold text-bullish uppercase">Synchronized (0.1ms)</span>
                  </div>
                  <ThemeToggle />
               </div>
            </header>

            {/* Scrollable Content Canvas */}
            <main className="flex-1 overflow-y-auto scrollbar-thin p-4 lg:p-6 pb-24 lg:pb-12 bg-black/[0.02]">
              <div className="max-w-[1680px] mx-auto animate-in fade-in slide-in-from-bottom-2 duration-700">
                {children}
              </div>
            </main>
          </div>
        </div>
      </DashboardProvider>
    </AuthProvider>
  );
}
