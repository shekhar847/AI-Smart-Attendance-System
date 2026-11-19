import React from "react";

interface LogoProps {
  className?: string;
}

export default function Logo({ className = "" }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#c8f135] text-xl font-black text-slate-950 shadow-lg shadow-[#c8f135]/30">
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
