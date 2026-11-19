"use client";

import { useEffect, useState } from "react";
import { Camera, Sparkles, Calendar, Clock, ArrowRight } from "lucide-react";
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
    if (!currentTime) return "Welcome to AI Attendance OS";
    const hour = currentTime.getHours();
    if (hour >= 5 && hour < 12) return "Good Morning ☀️";
    if (hour >= 12 && hour < 17) return "Good Afternoon 🌤️";
    if (hour >= 17 && hour < 21) return "Good Evening 🌆";
    return "Good Night 🌙";
  };

  return (
    <div className="relative overflow-hidden rounded-3xl glass-card p-6 md:p-8 mb-8 border border-white/40 dark:border-slate-800/80 shadow-xl transition-all duration-300">
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-blue-500/20 via-indigo-500/10 to-cyan-500/20 blur-3xl" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-3">
            <Sparkles size={14} className="animate-spin" /> AI SMART ATTENDANCE OS
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {greeting()}
          </h1>

          <p className="mt-2 text-base text-slate-600 dark:text-slate-300 max-w-xl">
            Welcome back to your central control hub. Live face recognition active across cameras.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={() => router.push("/attendance")}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:scale-[1.02] hover:shadow-indigo-500/35 active:scale-95"
            >
              <Camera size={18} />
              Open Live Attendance Scanner
            </button>
            <button
              onClick={() => router.push("/students")}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60 px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95"
            >
              Enroll Student Face
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {currentTime && (
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 rounded-2xl bg-slate-100/70 dark:bg-slate-800/60 p-4 border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm self-start lg:self-auto min-w-[220px]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <Calendar size={18} />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">DATE</p>
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

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <Clock size={18} />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">LIVE TIME</p>
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
