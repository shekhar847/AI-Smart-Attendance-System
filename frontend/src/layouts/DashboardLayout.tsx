"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative flex min-h-screen bg-slate-100/70 dark:bg-[#0b0e14] text-slate-900 dark:text-slate-100 transition-colors duration-200 overflow-x-clip">
      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Component */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="relative z-10 flex min-h-screen flex-1 flex-col lg:ml-72 transition-all duration-300 min-w-0">
        {/* Sticky Header Topbar */}
        <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800/80 bg-white/95 dark:bg-[#0e121b]/95 backdrop-blur-md transition-all duration-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <Topbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
        </header>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 min-w-0 overflow-x-hidden">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
