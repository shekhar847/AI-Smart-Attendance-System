"use client";

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

export default function AttendanceChart() {
  const [chartData, setChartData] = useState<{ day: string; present: number }[]>([]);
  const [timeframe, setTimeframe] = useState<"weekly" | "biweekly">("weekly");
  const [mounted, setMounted] = useState(false);

  const loadChart = async () => {
    try {
      const res = await getAttendance();
      const attendance = res.data;
      const grouped: { [key: string]: number } = {};
      attendance.forEach((item: any) => {
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
      console.error(err);
      setChartData([]);
    }
  };

  useEffect(() => {
    setMounted(true);
    loadChart();
    const interval = setInterval(() => {
      loadChart();
    }, 5000);
    return () => clearInterval(interval);
  }, [timeframe]);

  if (!mounted) {
    return (
      <div className="rounded-3xl glass-card p-6 md:p-8 shadow-xl border border-white/40 dark:border-slate-800/80 h-96 flex items-center justify-center">
        <div className="flex items-center gap-2 text-slate-400">
          <Activity className="animate-spin text-blue-500" size={20} />
          <span className="text-sm font-semibold">Loading Analytics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl glass-card p-6 md:p-8 shadow-xl border border-white/40 dark:border-slate-800/80 transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#a6d81e] dark:text-[#c8f135] mb-1">
            <BarChart2 size={15} /> Dynamic Trend
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Attendance Flow
          </h2>
        </div>

        <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700 self-start sm:self-auto">
          <button
            onClick={() => setTimeframe("weekly")}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              timeframe === "weekly"
                ? "bg-[#c8f135] text-slate-950 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setTimeframe("biweekly")}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              timeframe === "biweekly"
                ? "bg-[#c8f135] text-slate-950 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Last 14 Days
          </button>
        </div>
      </div>

      <div className="h-72 w-full">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c8f135" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#c8f135" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis
                dataKey="day"
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderColor: "#334155",
                  borderRadius: "16px",
                  color: "#fff",
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
                }}
              />
              <Area
                type="monotone"
                dataKey="present"
                stroke="#c8f135"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#attendanceGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center text-slate-400">
            <Activity size={32} className="opacity-40 mb-2" />
            <p className="text-sm font-semibold">No attendance logged yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
