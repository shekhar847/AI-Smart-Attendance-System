"use client";

import { useEffect, useState } from "react";
import { Camera, Calendar, Clock, ArrowRight, Video } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PageHeader() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const router = useRouter();

  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const greeting = () => {
    if (!currentTime) return "Attendance Dashboard";
    const hour = currentTime.getHours();
    if (hour >= 5 && hour < 12) return "Good Morning, Admin";
    if (hour >= 12 && hour < 17) return "Good Afternoon, Admin";
    if (hour >= 17 && hour < 21) return "Good Evening, Admin";
    return "Good Evening, Admin";
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-[#0e121b] p-6 md:p-8 mb-8 border border-slate-200 dark:border-slate-800/80 shadow-sm transition-all duration-200">
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Real-Time Attendance Monitoring
          </div>

          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            {greeting()}
          </h1>

          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
            Central monitoring console. Real-time facial recognition verification active across campus camera feeds.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={() => router.push("/attendance")}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-150 active:scale-98"
            >
              <Camera size={17} />
              Open Live Attendance Scanner
            </button>
            <button
              onClick={() => router.push("/students")}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 transition-all duration-150 hover:bg-slate-50 dark:hover:bg-slate-700/60 active:scale-98"
            >
              Enroll Student Face
              <ArrowRight size={15} />
            </button>
          </div>
        </div>

        {currentTime && (
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 p-3.5 border border-slate-200/80 dark:border-slate-700/60 self-start lg:self-auto min-w-[210px]">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/40 dark:border-blue-900/40">
                <Calendar size={16} />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">DATE</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {currentTime.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1 border-t border-slate-200/60 dark:border-slate-700/40">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                <Clock size={16} />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">LIVE CLOCK</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white tabular-nums">
                  {currentTime.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
