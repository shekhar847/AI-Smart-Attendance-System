import { useEffect, useState } from "react";
import { getAttendance } from "../api/attendanceApi";
import { getStudents } from "../api/studentApi";

function AttendanceTable() {

  const [attendance, setAttendance] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {

    loadData();

    const interval = setInterval(() => {
      loadData();
    }, 3000);

    return () => clearInterval(interval);

  }, []);

  const loadData = async () => {

    try {

      const attendanceRes = await getAttendance();
      const studentRes = await getStudents();

      setAttendance(attendanceRes.data);
      setStudents(studentRes.data);

    } catch (err) {

      console.log(err);

    }

  };

  const getStudent = (id) => {

    return students.find((s) => s.id === id);

  };

  return (

    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-all duration-300 hover:shadow-xl text-slate-800 dark:text-slate-100">

      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 p-7">

        <div>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Recent Attendance
          </h2>

          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Today's latest attendance records
          </p>

        </div>

        <button className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white">
          {attendance.length} Records
        </button>

      </div>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="bg-slate-50 dark:bg-slate-800/50 text-left text-sm uppercase tracking-wide text-slate-500 dark:text-slate-400">

              <th className="px-8 py-5">
                Student
              </th>

              <th className="px-8 py-5">
                Roll No
              </th>

              <th className="px-8 py-5">
                Date
              </th>

              <th className="px-8 py-5">
                Time
              </th>

              <th className="px-8 py-5">
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            {attendance
              .slice()
              .reverse()
              .map((item) => {

                const student = getStudent(item.student_id);

                return (

                  <tr
                    key={item.id}
                    className="border-t border-slate-100 dark:border-slate-800 hover:bg-blue-50 dark:hover:bg-slate-800/50 transition"
                  >

                    <td className="px-8 py-6">

                      <div className="flex items-center gap-4">

                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold">

                          {student?.name?.charAt(0)}

                        </div>

                        <div>

                          <h3 className="font-semibold text-slate-900 dark:text-slate-100">

                            {student?.name}

                          </h3>

                          <p className="text-sm text-gray-500 dark:text-slate-400">

                            Student

                          </p>

                        </div>

                      </div>

                    </td>

                    <td className="px-8 py-6 text-slate-700 dark:text-slate-300">

                      {student?.roll}

                    </td>

                    <td className="px-8 py-6 text-slate-700 dark:text-slate-300">

                      {item.date}

                    </td>

                    <td className="px-8 py-6 text-slate-700 dark:text-slate-300">

                      {item.time?.substring(0, 8)}

                    </td>

                    <td className="px-8 py-6">

                      <span
                        className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${
                          item.status === "Present"
                            ? "bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-400"
                            : "bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400"
                        }`}
                      >

                        {item.status}

                      </span>

                    </td>

                  </tr>

                );

              })}

          </tbody>

        </table>

      </div>

    </div>

  );

}

export default AttendanceTable;