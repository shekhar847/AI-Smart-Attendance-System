import { X } from "lucide-react";

function AttendanceHistoryModal({
  open,
  onClose,
  data,
}) {
  if (!open || !data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-5">

      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl text-slate-800 dark:text-slate-100">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 p-6">

          <div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Attendance History
            </h2>

            <p className="text-slate-500 dark:text-slate-400">
              Student Attendance Details
            </p>

          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
          >
            <X />
          </button>

        </div>

        {/* Student */}

        <div className="flex items-center gap-5 p-6 border-b border-slate-100 dark:border-slate-800">

          <img
            src={`${API.defaults.baseURL}/${data.student.photo}`}
            alt=""
            className="h-24 w-24 rounded-full border border-slate-200 dark:border-slate-700 object-cover"
          />

          <div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {data.student.name}
            </h2>

            <p className="text-slate-600 dark:text-slate-300 mt-1">
              Roll : {data.student.roll}
            </p>

            <p className="text-slate-600 dark:text-slate-300">
              Department : {data.student.department}
            </p>

            <p className="text-slate-600 dark:text-slate-300">
              Year : {data.student.year}
            </p>

          </div>

        </div>

        {/* Summary */}

        <div className="grid grid-cols-3 gap-5 p-6">

          <div className="rounded-2xl bg-blue-50 dark:bg-blue-950/40 p-5">

            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Total Classes</p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
              {data.summary.total_classes}
            </h2>

          </div>

          <div className="rounded-2xl bg-green-50 dark:bg-green-950/40 p-5">

            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Present</p>

            <h2 className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">
              {data.summary.present}
            </h2>

          </div>

          <div className="rounded-2xl bg-purple-50 dark:bg-purple-950/40 p-5">

            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Attendance</p>

            <h2 className="mt-2 text-3xl font-bold text-purple-600 dark:text-purple-400">
              {data.summary.attendance_percentage}%
            </h2>

          </div>

        </div>

        {/* Progress */}

        <div className="px-6 pb-2">

          <div className="h-4 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">

            <div
              style={{
                width: `${data.summary.attendance_percentage}%`,
              }}
              className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500"
            />

          </div>

        </div>

        {/* Table */}

        <div className="p-6">

          <table className="w-full">

            <thead>

              <tr className="border-b border-slate-200 dark:border-slate-800 text-left text-slate-500 dark:text-slate-400">

                <th className="py-3">Date</th>

                <th>Time</th>

                <th>Status</th>

              </tr>

            </thead>

            <tbody>

              {data.history.map((item) => (

                <tr
                  key={item.id}
                  className="border-b border-slate-100 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >

                  <td className="py-3 text-slate-700 dark:text-slate-300">
                    {item.date}
                  </td>

                  <td className="text-slate-700 dark:text-slate-300">
                    {item.time}
                  </td>

                  <td>

                    <span className="rounded-full bg-green-100 dark:bg-green-950/60 px-3 py-1 text-sm font-semibold text-green-700 dark:text-green-400">

                      {item.status}

                    </span>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default AttendanceHistoryModal;