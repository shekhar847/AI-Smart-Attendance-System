import { useEffect, useState } from "react";
import { getStudents } from "../api/studentApi";
import { getAttendance } from "../api/attendanceApi";
import { CheckCircle2, XCircle, Users, PieChart } from "lucide-react";

function AttendanceSummary() {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);

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

  useEffect(() => {
    loadData();
  }, []);

  const totalStudents = students.length;
  const present = attendance.length;
  const absent = Math.max(0, totalStudents - present);

  const percentage =
    totalStudents > 0
      ? ((present / totalStudents) * 100).toFixed(1)
      : 0;

  return (
    <div className="rounded-3xl glass-card p-7 shadow-xl border border-white/40 dark:border-slate-800/80 transition-all duration-300">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 mb-1">
        <PieChart size={15} /> Status Overview
      </div>
      <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
        Today's Summary
      </h2>

      <div className="mt-6 space-y-5">
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Users size={18} />
            </div>
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Total Enrolled</span>
          </div>
          <span className="text-lg font-black text-slate-900 dark:text-white">
            {totalStudents}
          </span>
        </div>

        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 size={18} />
            </div>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Verified Present</span>
          </div>
          <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
            {present}
          </span>
        </div>

        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/20 text-rose-600 dark:text-rose-400">
              <XCircle size={18} />
            </div>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Total Absent</span>
          </div>
          <span className="text-lg font-black text-rose-600 dark:text-rose-400">
            {absent}
          </span>
        </div>

        <div className="pt-2">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Attendance Ratio</span>
            <span className="text-base font-black text-indigo-600 dark:text-cyan-400">
              {percentage}%
            </span>
          </div>

          <div className="relative h-3.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-400 transition-all duration-1000 shadow-md"
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