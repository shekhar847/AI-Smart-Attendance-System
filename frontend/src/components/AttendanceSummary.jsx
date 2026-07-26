import {
  CheckCircle2,
  XCircle,
  Clock3,
  CalendarDays,
} from "lucide-react";

const summary = [
  {
    title: "Present",
    value: 1180,
    percent: 94,
    color: "bg-emerald-500",
    icon: <CheckCircle2 size={20} />,
    iconBg: "bg-emerald-100 text-emerald-600",
  },
  {
    title: "Absent",
    value: 70,
    percent: 6,
    color: "bg-red-500",
    icon: <XCircle size={20} />,
    iconBg: "bg-red-100 text-red-600",
  },
  {
    title: "Late",
    value: 18,
    percent: 2,
    color: "bg-amber-500",
    icon: <Clock3 size={20} />,
    iconBg: "bg-amber-100 text-amber-600",
  },
  {
    title: "Working Days",
    value: 22,
    percent: null,
    color: "bg-blue-500",
    icon: <CalendarDays size={20} />,
    iconBg: "bg-blue-100 text-blue-600",
  },
];

function AttendanceSummary() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:shadow-xl">

      {/* Header */}

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">
          Today's Summary
        </h2>

        <p className="mt-1 text-slate-500">
          Attendance Overview
        </p>
      </div>

      <div className="space-y-7">

        {summary.map((item) => (

          <div key={item.title}>

            <div className="mb-3 flex items-center justify-between">

              <div className="flex items-center gap-4">

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.iconBg}`}
                >
                  {item.icon}
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900">
                    {item.title}
                  </h3>

                  <p className="text-sm text-slate-500">
                    {item.value} Students
                  </p>
                </div>

              </div>

              {item.percent !== null && (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-700">
                  {item.percent}%
                </span>
              )}

            </div>

            {item.percent !== null && (

              <div className="h-3 overflow-hidden rounded-full bg-slate-100">

                <div
                  className={`h-full rounded-full transition-all duration-700 ${item.color}`}
                  style={{
                    width: `${item.percent}%`,
                  }}
                />

              </div>

            )}

          </div>

        ))}

      </div>
    </div>
  );
}

export default AttendanceSummary;