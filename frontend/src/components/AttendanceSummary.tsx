"use client";

import { useEffect, useState } from "react";
import { getStudents } from "../api/studentApi";
import { getAttendance } from "../api/attendanceApi";
import { Users, PieChart, UserCheck, UserX } from "lucide-react";
import { Student, AttendanceRecord } from "../types";

export default function AttendanceSummary() {
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);

  const loadData = async () => {
    try {
      const [studentRes, attendanceRes] = await Promise.all([
        getStudents(),
        getAttendance(),
      ]);
      setStudents(studentRes.data || []);
      setAttendance(attendanceRes.data || []);
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
      : "0";

  return (
    <div className="rounded-xl bg-white dark:bg-[#0e121b] p-6 shadow-sm border border-slate-200 dark:border-slate-800/80 transition-all duration-200">
      <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
        <PieChart size={14} /> Overview
      </div>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white">
        Today's Summary
      </h2>

      <div className="mt-5 space-y-3">
        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/40 dark:border-blue-900/40">
              <Users size={16} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Total Enrolled</p>
              <p className="text-[11px] text-slate-400">Registered Students</p>
            </div>
          </div>
          <span className="text-base font-bold text-slate-900 dark:text-white">{totalStudents}</span>
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/40 dark:border-emerald-900/40">
              <UserCheck size={16} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Present</p>
              <p className="text-[11px] text-slate-400">Verified via Face</p>
            </div>
          </div>
          <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">{present}</span>
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200/40 dark:border-rose-900/40">
              <UserX size={16} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Absent</p>
              <p className="text-[11px] text-slate-400">Unrecorded</p>
            </div>
          </div>
          <span className="text-base font-bold text-rose-600 dark:text-rose-400">{absent}</span>
        </div>

        <div className="pt-2">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-medium text-slate-600 dark:text-slate-400">Attendance Ratio</span>
            <span className="font-bold text-slate-900 dark:text-white">{percentage}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full bg-blue-600 transition-all duration-500 rounded-full"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
