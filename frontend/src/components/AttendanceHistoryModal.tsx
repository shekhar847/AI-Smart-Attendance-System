"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Calendar, Clock, CheckCircle, XCircle } from "lucide-react";
import API from "../api/client";
import { Student } from "../types";

interface AttendanceHistoryModalProps {
  open: boolean;
  onClose: () => void;
  data: {
    student: Student;
    summary?: {
      total_classes?: number;
      present?: number;
      attendance_percentage?: number;
    };
    history?: Array<{
      id: number;
      date: string;
      time: string;
      status: string;
      emotion_status?: string;
    }>;
  } | null;
}

export default function AttendanceHistoryModal({
  open,
  onClose,
  data,
}: AttendanceHistoryModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!open || !data || !mounted) return null;

  const { student, summary, history = [] } = data;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="my-auto max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white dark:bg-[#0e1422] border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-5">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Student Attendance Record
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Complete historical verification breakdown
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
          >
            <X size={20} />
          </button>
        </div>

        {/* Student Profile Card */}
        <div className="flex flex-col sm:flex-row items-center gap-5 p-5 my-5 rounded-2xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50">
          {student.photo ? (
            <img
              src={`${API.defaults.baseURL}/${student.photo}`}
              alt={student.name}
              className="h-20 w-20 rounded-2xl border-2 border-[#c8f135] object-cover shadow-md"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#c8f135] text-slate-950 font-black text-2xl shadow-md shadow-[#c8f135]/25">
              {student.name.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="flex-1 text-center sm:text-left space-y-1">
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              {student.name}
            </h3>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Student ID: <span className="text-slate-800 dark:text-slate-200 font-mono">{student.roll}</span> • Dept: <span className="text-slate-800 dark:text-slate-200">{student.department}</span> • Year: <span className="text-slate-800 dark:text-slate-200">{student.year}</span>
            </p>
          </div>

          {summary && (
            <div className="flex items-center gap-4 text-center border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-slate-700 pt-3 sm:pt-0 sm:pl-6">
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-400">Classes</p>
                <p className="text-lg font-extrabold text-slate-900 dark:text-white">{summary.total_classes || history.length}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-400">Present</p>
                <p className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">{summary.present || history.filter(h => h.status === "Present").length}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-400">Rate</p>
                <p className="text-lg font-extrabold text-blue-600 dark:text-cyan-400">{summary.attendance_percentage || "100"}%</p>
              </div>
            </div>
          )}
        </div>

        {/* History Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3.5 pl-4">Date</th>
                <th className="p-3.5">Time</th>
                <th className="p-3.5">Emotion State</th>
                <th className="p-3.5 pr-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {history.length > 0 ? (
                history.map((record, index) => (
                  <tr key={index} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-3.5 pl-4 flex items-center gap-2 text-slate-800 dark:text-slate-200">
                      <Calendar size={14} className="text-slate-400" />
                      {record.date}
                    </td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-300 font-mono">
                      {record.time}
                    </td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-300">
                      <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[11px] font-bold">
                        {record.emotion_status || "Neutral"}
                      </span>
                    </td>
                    <td className="p-3.5 pr-4 text-right">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                          record.status === "Present"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                        }`}
                      >
                        {record.status === "Present" ? <CheckCircle size={12} /> : <XCircle size={12} />}
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-slate-400">
                    No attendance logs found for this student.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-[#c8f135] px-6 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-[#b5e028] shadow-md shadow-[#c8f135]/25"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
