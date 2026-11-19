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
      <div className="rounded-xl bg-white dark:bg-[#0e121b] p-6 shadow-sm border border-slate-200 dark:border-slate-800/80 h-80 flex items-center justify-center">
        <div className="flex items-center gap-2 text-slate-400">
          <Activity className="animate-spin text-blue-600" size={18} />
          <span className="text-sm font-medium">Loading Analytics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white dark:bg-[#0e121b] p-6 shadow-sm border border-slate-200 dark:border-slate-800/80 transition-all duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
            <BarChart2 size={14} /> Attendance Trend
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Daily Attendance Flow
          </h2>
        </div>

        <div className="flex items-center rounded-lg bg-slate-100 dark:bg-slate-800/80 p-1 border border-slate-200/80 dark:border-slate-700/60 self-start sm:self-auto">
          <button
            onClick={() => setTimeframe("weekly")}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
              timeframe === "weekly"
                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setTimeframe("biweekly")}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
              timeframe === "biweekly"
                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Last 14 Days
          </button>
        </div>
      </div>

      <div className="h-64 w-full">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.12} />
              <XAxis
                dataKey="day"
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderColor: "#334155",
                  borderRadius: "10px",
                  color: "#fff",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                  fontSize: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey="present"
                stroke="#2563eb"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#attendanceGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center text-slate-400">
            <Activity size={28} className="opacity-30 mb-2" />
            <p className="text-xs font-medium">No attendance records logged yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
