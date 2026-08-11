import { useEffect, useState } from "react";
import { getStudents } from "../api/studentApi";
import { getAttendance } from "../api/attendanceApi";

function AttendanceSummary() {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const studentRes = await getStudents();
      const attendanceRes = await getAttendance();

      setStudents(studentRes.data);
      setAttendance(attendanceRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const totalStudents = students.length;
  const present = attendance.length;
  const absent = totalStudents - present;

  const percentage =
    totalStudents > 0
      ? ((present / totalStudents) * 100).toFixed(1)
      : 0;

  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-7 shadow-sm text-slate-800 dark:text-slate-100 transition-colors duration-300">

      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
        Today's Summary
      </h2>

      <div className="mt-8 space-y-6">

        <div className="flex justify-between">
          <span className="text-slate-600 dark:text-slate-400">Total Students</span>
          <span className="font-bold">
            {totalStudents}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-600 dark:text-slate-400">Present</span>
          <span className="font-bold text-green-600 dark:text-green-400">
            {present}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-600 dark:text-slate-400">Absent</span>
          <span className="font-bold text-red-600 dark:text-red-400">
            {absent}
          </span>
        </div>

        <div className="pt-4">

          <div className="flex justify-between mb-2">

            <span className="text-slate-600 dark:text-slate-400">Attendance Rate</span>

            <span className="font-bold">
              {percentage}%
            </span>

          </div>

          <div className="h-3 rounded-full bg-gray-200 dark:bg-slate-800 overflow-hidden">

            <div
              className="h-full bg-green-600"
              style={{
                width: `${percentage}%`,
              }}
            />

          </div>

        </div>

      </div>

    </div>
  );
}

export default AttendanceSummary;