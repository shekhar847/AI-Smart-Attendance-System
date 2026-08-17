import { useEffect, useState } from "react";
import { Camera, Sparkles, Calendar, Clock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

function PageHeader() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const greeting = () => {
    const hour = currentTime.getHours();
    if (hour >= 5 && hour < 12) return "Good Morning ☀️";
    if (hour >= 12 && hour < 17) return "Good Afternoon 🌤️";
    if (hour >= 17 && hour < 21) return "Good Evening 🌆";
    return "Good Night 🌙";
  };

  return (
    <div className="relative overflow-hidden rounded-3xl glass-card p-6 md:p-8 mb-8 border border-white/40 dark:border-slate-800/80 shadow-xl transition-all duration-300">
      {/* Background Subtle Gradient Glow */}
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
            Welcome back to your central control hub. Live face recognition active across 4 cameras.
          </p>

          {/* Quick Actions */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate("/attendance")}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:scale-[1.02] hover:shadow-indigo-500/35 active:scale-95"
            >
              <Camera size={18} />
              Start AI Scan
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => navigate("/reports")}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-4 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-200 backdrop-blur-md transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              View Analytics
            </button>
          </div>
        </div>

        {/* Digital Clock & Date Card */}
        <div className="flex shrink-0 items-center gap-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 p-5 backdrop-blur-xl shadow-inner">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Clock size={24} />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <Calendar size={13} />
              {currentTime.toLocaleDateString("en-US", {
                weekday: "short",
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </div>
            <h2 className="mt-0.5 text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              {currentTime.toLocaleTimeString()}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PageHeader;