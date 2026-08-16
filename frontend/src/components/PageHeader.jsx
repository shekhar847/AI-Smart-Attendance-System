import { useEffect, useState } from "react";

function PageHeader() {
  const [currentTime, setCurrentTime] = useState(new Date());

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
    <div className="mb-8 flex items-center justify-between">
      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
          AI SMART ATTENDANCE
        </p>

        <h1 className="mt-2 text-5xl font-bold text-slate-900 dark:text-slate-100">
          {greeting()}
        </h1>

        <p className="mt-3 text-lg text-slate-500 dark:text-slate-400">
          Welcome back, Admin. Manage your attendance system efficiently.
        </p>
      </div>

      {/* Clock */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-5 shadow-sm">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {currentTime.toLocaleDateString("en-US", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>

        <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
          {currentTime.toLocaleTimeString()}
        </h2>
      </div>
    </div>
  );
}

export default PageHeader;