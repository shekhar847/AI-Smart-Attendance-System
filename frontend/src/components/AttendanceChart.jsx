import { useEffect, useState } from "react";
import { getAttendance } from "../api/attendanceApi";

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

  useEffect(() => {

    loadChart();

    const interval = setInterval(() => {
      loadChart();
    }, 3000);

    return () => clearInterval(interval);

  }, []);

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
        .slice(-7)
        .map((date) => ({
          day: date.substring(5),
          present: grouped[date],
        }));

      setChartData(data);

    } catch (err) {

      console.log(err);

    }

  };

  return (

    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-7 shadow-sm transition-all duration-300 hover:shadow-xl">

      <div className="mb-8 flex items-center justify-between">

        <div>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Attendance Analytics
          </h2>

          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Last 7 Days Attendance
          </p>

        </div>

        <div className="rounded-full bg-blue-50 dark:bg-blue-950/60 px-4 py-2 text-sm font-semibold text-blue-600 dark:text-blue-400">

          Live

        </div>

      </div>

      <div className="h-80">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <AreaChart
            data={chartData}
          >

            <defs>

              <linearGradient
                id="attendance"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >

                <stop
                  offset="0%"
                  stopColor="#2563EB"
                  stopOpacity={0.45}
                />

                <stop
                  offset="100%"
                  stopColor="#2563EB"
                  stopOpacity={0}
                />

              </linearGradient>

            </defs>

            <CartesianGrid
              strokeDasharray="5 5"
              vertical={false}
            />

            <XAxis
              dataKey="day"
            />

            <YAxis />

            <Tooltip />

            <Area
              type="monotone"
              dataKey="present"
              stroke="#2563EB"
              fill="url(#attendance)"
              strokeWidth={4}
            />

          </AreaChart>

        </ResponsiveContainer>

      </div>

    </div>

  );

}

export default AttendanceChart;