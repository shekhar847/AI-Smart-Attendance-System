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
    <div className="rounded-3xl glass-card p-7 shadow-xl border border-white/40 dark:border-slate-800/80 transition-all duration-300">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 mb-1">
        <PieChart size={15} /> Status Overview
      </div>
      <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
        Today's Summary
      </h2>

      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Users size={18} />
            </div>
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              Total Enrolled
            </span>
          </div>
          <span className="text-base font-bold text-slate-900 dark:text-white">
            {totalStudents}
          </span>
        </div>

        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-500/10 dark:bg-emerald-950/30 border border-emerald-500/20">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              <UserCheck size={18} />
            </div>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Present Today
            </span>
          </div>
          <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">
            {present}
          </span>
        </div>

        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-rose-500/10 dark:bg-rose-950/30 border border-rose-500/20">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/20 text-rose-600 dark:text-rose-400">
              <UserX size={18} />
            </div>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Absent Today
            </span>
          </div>
          <span className="text-base font-bold text-rose-600 dark:text-rose-400">
            {absent}
          </span>
        </div>
      </div>

      <div className="mt-6 pt-5 border-t border-slate-200/60 dark:border-slate-800/60">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Attendance Rate
          </span>
          <span className="text-sm font-extrabold text-blue-600 dark:text-cyan-400">
            {percentage}%
          </span>
        </div>
        <div className="h-3 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-500"
            style={{ width: `${Math.min(100, Math.max(0, Number(percentage)))}%` }}
          />
        </div>
      </div>
    </div>
  );
}
