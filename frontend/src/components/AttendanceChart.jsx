import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const data = [
  { day: "Mon", present: 1090 },
  { day: "Tue", present: 1145 },
  { day: "Wed", present: 1120 },
  { day: "Thu", present: 1190 },
  { day: "Fri", present: 1210 },
  { day: "Sat", present: 1180 },
];

function AttendanceChart() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:shadow-xl">

      {/* Header */}

      <div className="mb-8 flex items-center justify-between">

        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Attendance Analytics
          </h2>

          <p className="mt-1 text-slate-500">
            Weekly student attendance overview
          </p>
        </div>

        <div className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600">
          This Week
        </div>

      </div>

      {/* Chart */}

      <div className="h-80">

        <ResponsiveContainer width="100%" height="100%">

          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: -20,
              bottom: 0,
            }}
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
              stroke="#E2E8F0"
              vertical={false}
            />

            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tick={{
                fill: "#64748B",
                fontSize: 13,
              }}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{
                fill: "#64748B",
                fontSize: 13,
              }}
            />

            <Tooltip
              contentStyle={{
                borderRadius: "16px",
                border: "none",
                boxShadow:
                  "0 12px 35px rgba(0,0,0,.12)",
              }}
            />

            <Area
              type="monotone"
              dataKey="present"
              stroke="#2563EB"
              strokeWidth={4}
              fill="url(#attendance)"
              animationDuration={1200}
              dot={{
                r: 5,
                strokeWidth: 3,
                stroke: "#2563EB",
                fill: "#fff",
              }}
              activeDot={{
                r: 8,
                fill: "#2563EB",
              }}
            />

          </AreaChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}

export default AttendanceChart;