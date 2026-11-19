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
    <div className="rounded-xl bg-white dark:bg-[#0e121b] shadow-sm border border-slate-200 dark:border-slate-800/80 transition-all duration-200 overflow-hidden">
      {/* Header & Filter Controls */}
      <div className="p-5 md:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
            <ShieldCheck size={15} /> Real-Time Log
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Recent Attendance
          </h2>
        </div>

        <div className="relative w-full sm:w-72">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search by student or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 py-2 pl-9 pr-4 text-xs font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-800/30 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <th className="p-3.5 pl-6">Student</th>
              <th className="p-3.5">Student ID</th>
              <th className="p-3.5">Department</th>
              <th className="p-3.5">Date</th>
              <th className="p-3.5">Time</th>
              <th className="p-3.5">Status Indicator</th>
              <th className="p-3.5 pr-6 text-right">Verification</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs font-medium">
            {filteredAttendance.length > 0 ? (
              filteredAttendance.slice(0, 15).map((item) => {
                const student = getStudent(item.student_id);
                return (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="p-3.5 pl-6">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-xs shadow-sm">
                          {student?.name ? student.name.charAt(0).toUpperCase() : "S"}
                        </div>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {student?.name || `Student #${item.student_id}`}
                        </span>
                      </div>
                    </td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                      {student?.roll || "N/A"}
                    </td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-300">
                      {student?.department || "N/A"}
                    </td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-300">
                      {item.date}
                    </td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                      {item.time}
                    </td>
                    <td className="p-3.5">
                      <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {item.emotion_status || "Verified"}
                      </span>
                    </td>
                    <td className="p-3.5 pr-6 text-right">
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40">
                        <CheckCircle size={12} />
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
