const students = [
  {
    name: "Rahul Kumar",
    roll: "CS101",
    time: "09:02 AM",
    status: "Present",
  },
  {
    name: "Priya Sharma",
    roll: "CS102",
    time: "09:05 AM",
    status: "Present",
  },
  {
    name: "Aman Singh",
    roll: "CS103",
    time: "--",
    status: "Absent",
  },
  {
    name: "Neha Verma",
    roll: "CS104",
    time: "09:07 AM",
    status: "Present",
  },
];

function AttendanceTable() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl">

      {/* Header */}

      <div className="flex items-center justify-between border-b border-slate-100 p-7">

        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Recent Attendance
          </h2>

          <p className="mt-1 text-slate-500">
            Today's latest attendance records
          </p>
        </div>

        <button className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700">
          View All
        </button>

      </div>

      {/* Table */}

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="bg-slate-50 text-left text-sm uppercase tracking-wide text-slate-500">

              <th className="px-8 py-5">Student</th>

              <th className="px-8 py-5">Roll No</th>

              <th className="px-8 py-5">Check In</th>

              <th className="px-8 py-5">Status</th>

            </tr>

          </thead>

          <tbody>

            {students.map((student) => (

              <tr
                key={student.roll}
                className="border-t border-slate-100 transition duration-300 hover:bg-blue-50"
              >

                <td className="px-8 py-6">

                  <div className="flex items-center gap-4">

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-lg font-bold text-white shadow-lg">

                      {student.name.charAt(0)}

                    </div>

                    <div>

                      <h3 className="font-semibold text-slate-900">
                        {student.name}
                      </h3>

                      <p className="text-sm text-slate-500">
                        Student
                      </p>

                    </div>

                  </div>

                </td>

                <td className="px-8 py-6 font-medium text-slate-700">
                  {student.roll}
                </td>

                <td className="px-8 py-6 text-slate-600">
                  {student.time}
                </td>

                <td className="px-8 py-6">

                  <span
                    className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${
                      student.status === "Present"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {student.status}
                  </span>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default AttendanceTable;