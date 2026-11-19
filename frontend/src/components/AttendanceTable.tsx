"use client";

import { useEffect, useState } from "react";
import { getAttendance } from "../api/attendanceApi";
import { getStudents } from "../api/studentApi";
import { CheckCircle, Search, ShieldCheck } from "lucide-react";
import { Student, AttendanceRecord } from "../types";

export default function AttendanceTable() {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const loadData = async () => {
    try {
      const [attendanceRes, studentRes] = await Promise.all([
        getAttendance(),
        getStudents(),
      ]);
      setAttendance(attendanceRes.data || []);
      setStudents(studentRes.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
      loadData();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getStudent = (id: number): Student | undefined => {
    return students.find((s) => s.id === id);
  };

  const filteredAttendance = attendance
    .slice()
    .reverse()
    .filter((item) => {
      const student = getStudent(item.student_id);
      const name = student?.name || "";
      const roll = student?.roll || "";
      return (
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        roll.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

  return (
    <div className="rounded-3xl glass-card shadow-xl border border-white/40 dark:border-slate-800/80 transition-all duration-300 overflow-hidden">
      {/* Header & Filter Controls */}
      <div className="p-6 md:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 dark:border-slate-800/60">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
            <ShieldCheck size={16} /> Live Verification Log
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Recent Attendance
          </h2>
        </div>

        <div className="relative w-full sm:w-72">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search by student or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-800/30 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <th className="p-4 pl-6 md:pl-8">Student</th>
              <th className="p-4">Student ID</th>
              <th className="p-4">Department</th>
              <th className="p-4">Date</th>
              <th className="p-4">Time</th>
              <th className="p-4">Emotion</th>
              <th className="p-4 pr-6 md:pr-8 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-xs font-semibold">
            {filteredAttendance.length > 0 ? (
              filteredAttendance.slice(0, 15).map((item) => {
                const student = getStudent(item.student_id);
                return (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="p-4 pl-6 md:pl-8">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-xs shadow-sm">
                          {student?.name ? student.name.charAt(0).toUpperCase() : "S"}
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {student?.name || `Student #${item.student_id}`}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-300 font-mono">
                      {student?.roll || "N/A"}
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">
                      {student?.department || "N/A"}
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">
                      {item.date}
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-300 font-mono">
                      {item.time}
                    </td>
                    <td className="p-4">
                      <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-[11px] font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {item.emotion_status || "Neutral"}
                      </span>
                    </td>
                    <td className="p-4 pr-6 md:pr-8 text-right">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        <CheckCircle size={13} />
                        {item.status || "Present"}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-400 font-medium">
                  No attendance records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
