"use client";

import { useState, useEffect } from "react";
import {
  UserCheck,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  MessageSquare,
  Award,
  BellRing,
  Phone,
  Mail,
  GraduationCap,
  Shield,
  BookOpen,
  Filter,
} from "lucide-react";

import ProtectedRoute from "../../components/ProtectedRoute";
import DashboardLayout from "../../layouts/DashboardLayout";
import Topbar from "../../components/Topbar";
import Card from "../../components/Card";

import API from "../../api/client";
import { getAlertLogs } from "../../api/alertApi";
import { Student } from "../../types";

export default function StudentPortalPage() {
  const [user, setUser] = useState<any>(null);
  const [data, setData] = useState<any>(null);
  const [alertLogs, setAlertLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"attendance" | "alerts">("attendance");
  const [selectedMonth, setSelectedMonth] = useState("all");

  useEffect(() => {
    const userJson = localStorage.getItem("user");
    if (userJson) {
      const u = JSON.parse(userJson);
      setUser(u);
      fetchStudentData(u.student_id || u.id);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchStudentData = async (studentId: number | string) => {
    setLoading(true);
    try {
      const [historyRes, alertRes] = await Promise.all([
        API.get(`/students/${studentId}/attendance`),
        getAlertLogs(studentId),
      ]);
      setData(historyRes.data);
      setAlertLogs(alertRes.data || []);
    } catch (err) {
      console.error("Failed to fetch student portal data:", err);
    } finally {
      setLoading(false);
    }
  };

  const student = data?.student || user;
  const summary = data?.summary || {
    total_classes: 0,
    present: 0,
    attendance_percentage: 0,
  };
  const history: any[] = data?.history || [];

  const filteredHistory = history.filter((item) => {
    if (selectedMonth === "all") return true;
    return item.date?.startsWith(selectedMonth);
  });

  return (
    <ProtectedRoute allowedRoles={["student", "admin", "teacher"]}>
      <DashboardLayout>
        {/* Student Banner */}
        <div className="mb-8 rounded-3xl glass-card border border-white/40 dark:border-slate-800 p-6 md:p-8 shadow-2xl relative overflow-hidden">
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
            {student?.photo ? (
              <img
                src={`${API.defaults.baseURL}/${student.photo}`}
                alt={student.name}
                className="h-28 w-28 rounded-3xl border-4 border-blue-500 object-cover shadow-xl"
              />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-black text-4xl shadow-xl">
                {student?.name ? student.name.charAt(0).toUpperCase() : "S"}
              </div>
            )}

            <div className="space-y-1.5 text-center sm:text-left flex-1">
              <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-600 dark:text-cyan-400 border border-blue-500/20">
                Verified Student Account
              </span>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                {student?.name || "Student"}
              </h1>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Student ID: <span className="font-mono text-slate-800 dark:text-slate-200">{student?.roll}</span> • Dept: <span className="text-slate-800 dark:text-slate-200">{student?.department}</span> • Year: <span className="text-slate-800 dark:text-slate-200">{student?.year}</span>
              </p>
            </div>

            <div className="flex items-center gap-6 text-center border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-slate-800 pt-4 sm:pt-0 sm:pl-8">
              <div>
                <p className="text-xs font-bold uppercase text-slate-400">Total Classes</p>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                  {summary.total_classes || history.length}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-slate-400">Attendance</p>
                <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {summary.attendance_percentage || "100"}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
          <button
            onClick={() => setActiveTab("attendance")}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition ${
              activeTab === "attendance"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Calendar size={16} /> My Attendance Logs
          </button>
          <button
            onClick={() => setActiveTab("alerts")}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition ${
              activeTab === "alerts"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <BellRing size={16} /> Parent Alerts History
          </button>
        </div>

        {activeTab === "attendance" ? (
          <div className="rounded-3xl glass-card border border-white/40 dark:border-slate-800 p-6 md:p-8">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
              Verified Attendance Logs
            </h3>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 font-bold uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="p-3.5 pl-6">Date</th>
                    <th className="p-3.5">Time</th>
                    <th className="p-3.5">Emotion State</th>
                    <th className="p-3.5 pr-6 text-right">Verification Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                  {filteredHistory.length > 0 ? (
                    filteredHistory.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="p-3.5 pl-6 flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                          <Calendar size={14} className="text-slate-400" />
                          {item.date}
                        </td>
                        <td className="p-3.5 font-mono text-slate-600 dark:text-slate-300">
                          {item.time || "—"}
                        </td>
                        <td className="p-3.5 text-slate-600 dark:text-slate-300">
                          <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[11px] font-bold">
                            {item.emotion_status || "Neutral"}
                          </span>
                        </td>
                        <td className="p-3.5 pr-6 text-right">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                              item.status === "Present"
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                            }`}
                          >
                            {item.status === "Present" ? (
                              <CheckCircle2 size={12} />
                            ) : (
                              <XCircle size={12} />
                            )}
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-slate-400">
                        No attendance history records available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl glass-card border border-white/40 dark:border-slate-800 p-6 md:p-8">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
              Parent Notification Dispatch History
            </h3>

            <div className="space-y-3">
              {alertLogs.length > 0 ? (
                alertLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs"
                  >
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <MessageSquare size={14} className="text-blue-500" />
                        Dispatched via {log.channel?.toUpperCase()} to {log.recipient_phone}
                      </p>
                      <p className="mt-1 text-slate-600 dark:text-slate-300">
                        {log.message}
                      </p>
                    </div>
                    <span
                      className={`self-start sm:self-auto rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        log.status === "Sent"
                          ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                          : "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                      }`}
                    >
                      {log.status}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-400 text-center py-8">
                  No automated absence alerts have been dispatched for your account.
                </p>
              )}
            </div>
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
