import React from "react";

interface LogoProps {
  className?: string;
}

export default function Logo({ className = "" }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white shadow-lg shadow-blue-500/25">
        AI
      </div>

      <div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
          Smart Attendance
        </h1>

        <p className="text-sm text-slate-500 dark:text-slate-400">
          Face Recognition System
        </p>
      </div>
    </div>
  );
}
