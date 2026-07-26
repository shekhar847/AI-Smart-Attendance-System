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

    if (hour < 12) return "Good Morning ☀️";
    if (hour < 17) return "Good Afternoon 🌤️";
    return "Good Evening 🌙";
  };

  return (
  <div className="mb-8 flex items-center justify-between">
    <div>
      <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
        AI SMART ATTENDANCE
      </p>

      <h1 className="mt-2 text-5xl font-bold text-slate-900">
        {greeting()}
      </h1>

      <p className="mt-3 text-lg text-slate-500">
        Welcome back, Admin. Manage your attendance system efficiently.
      </p>
    </div>

    {/* Clock */}
    <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
      <p className="text-sm text-slate-500">
        {currentTime.toLocaleDateString("en-US", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </p>

      <h2 className="mt-2 text-3xl font-bold text-slate-900">
        {currentTime.toLocaleTimeString()}
      </h2>
    </div>
  </div>
);
}

export default PageHeader;