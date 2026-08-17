import { useEffect, useState } from "react";
import { getAttendance } from "../api/attendanceApi";
import { Activity, BarChart2 } from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

function AttendanceChart() {
  const [chartData, setChartData] = useState([]);
  const [timeframe, setTimeframe] = useState("weekly");

  const loadChart = async () => {
    try {
      const res = await getAttendance();
      const attendance = res.data;
      const grouped = {};
      attendance.forEach((item) => {
        if (!grouped[item.date]) {
          grouped[item.date] = 0;
        }
        grouped[item.date]++;
      });
      const data = Object.keys(grouped)
        .sort()
        .slice(timeframe === "weekly" ? -7 : -14)
        .map((date) => ({
          day: date.substring(5),
          present: grouped[date],
        }));
      setChartData(data);
    } catch (err) {
      console.log(err);
      setChartData([]);
    }
  };

  useEffect(() => {
    loadChart();
    const interval = setInterval(() => {
      loadChart();
    }, 3000);
    return () => clearInterval(interval);
  }, [timeframe]);

  return (
    <div className="rounded-3xl glass-card p-7 shadow-xl border border-white/40 dark:border-slate-800/80 transition-all duration-300">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            <BarChart2 size={15} /> Real-time Telemetry
          </div>
          <h2 className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-white">
            Attendance Analytics
          </h2>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            AI facial verification trend log
          </p>
        </div>

        {/* Timeframe Controls & Live Indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800/80 p-1 border border-slate-200/60 dark:border-slate-700/60">
            <button
              onClick={() => setTimeframe("weekly")}
              className={`rounded-lg px-3 py-1 text-xs font-bold transition-all ${
                timeframe === "weekly"
                  ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-cyan-400 shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setTimeframe("biweekly")}
              className={`rounded-lg px-3 py-1 text-xs font-bold transition-all ${
                timeframe === "biweekly"
                  ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-cyan-400 shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              14 Days
            </button>
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-600 dark:text-cyan-400">
            <Activity size={12} className="animate-spin" /> Live Sync
          </div>
        </div>
      </div>

      <div className="h-80 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.6} />
                <stop offset="50%" stopColor="#06b6d4" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.15)" />

            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 600 }}
              dy={8}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 600 }}
              dx={-8}
            />

            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-xl border border-white/20 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 p-3 shadow-2xl backdrop-blur-xl">
                      <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                        Date: <span className="text-slate-900 dark:text-white">{label}</span>
                      </p>
                      <p className="mt-1 text-sm font-extrabold text-indigo-600 dark:text-cyan-400">
                        Verified Attendance: {payload[0].value} Students
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Area
              type="monotone"
              dataKey="present"
              stroke="#6366f1"
              strokeWidth={3.5}
              fill="url(#attendanceGradient)"
              activeDot={{ r: 7, stroke: "#06b6d4", strokeWidth: 3, fill: "#ffffff" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default AttendanceChart;