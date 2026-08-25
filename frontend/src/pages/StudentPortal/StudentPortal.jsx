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
import API from "../../api/client";
import { getAlertLogs } from "../../api/alertApi";
import Topbar from "../../components/Topbar";
import Card from "../../components/Card";

function StudentPortal() {
  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);
  const [alertLogs, setAlertLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("attendance"); // "attendance" | "alerts"
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

  const fetchStudentData = async (studentId) => {
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
  const summary = data?.summary || { total_classes: 0, present: 0, attendance_percentage: 0 };
  const history = data?.history || [];

  const filteredHistory = history.filter((item) => {
    if (selectedMonth === "all") return true;
    if (!item.date) return false;
    const month = new Date(item.date).getMonth() + 1;
    return month === parseInt(selectedMonth, 10);
  });

  const getPercentageColor = (pct) => {
    if (pct >= 85) return "text-emerald-600 dark:text-emerald-400 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40";
    if (pct >= 75) return "text-blue-600 dark:text-blue-400 border-blue-500 bg-blue-50 dark:bg-blue-950/40";
    if (pct >= 60) return "text-amber-600 dark:text-amber-400 border-amber-500 bg-amber-50 dark:bg-amber-950/40";
    return "text-rose-600 dark:text-rose-400 border-rose-500 bg-rose-50 dark:bg-rose-950/40";
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pl-0 lg:pl-72 transition-all">
      <Topbar title="Student & Parent Attendance Portal" />

      <main className="p-6 max-w-7xl mx-auto space-y-6">
        {/* STUDENT BANNER & PROFILE CARD */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 p-6 md:p-8 text-white shadow-xl">
          <div className="absolute right-0 top-0 h-full w-1/3 bg-white/5 backdrop-blur-3xl transform skew-x-12 pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
              {student?.photo ? (
                <img
                  src={`${API.defaults.baseURL}/${student.photo}`}
                  alt={student.name}
                  className="h-24 w-24 rounded-2xl border-4 border-white/30 object-cover shadow-2xl"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white/10 text-3xl font-bold border-2 border-white/20 backdrop-blur-md">
                  🎓
                </div>
              )}

              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-white backdrop-blur-md">
                  <UserCheck size={14} /> Official Attendance Portal
                </span>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                  {student?.name || "Student Portal"}
                </h1>
                <p className="text-sm text-blue-100 font-medium">
                  Roll No: <span className="font-bold text-white">{student?.roll || "N/A"}</span> | Department:{" "}
                  <span className="font-bold text-white">{student?.department || "N/A"}</span> ({student?.year || "N/A"})
                </p>

                <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-blue-100">
                  {student?.parent_phone && (
                    <span className="flex items-center gap-1">
                      <Phone size={13} className="text-emerald-300" /> Parent Phone: <strong className="text-white">{student.parent_phone}</strong>
                    </span>
                  )}
                  {student?.email && (
                    <span className="flex items-center gap-1">
                      <Mail size={13} className="text-blue-300" /> Email: <strong className="text-white">{student.email}</strong>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* PERCENTAGE BADGE */}
            <div className="flex flex-col items-center justify-center rounded-2xl bg-white/15 backdrop-blur-xl border border-white/20 p-5 min-w-[160px] text-center shadow-lg">
              <span className="text-xs uppercase tracking-wider text-blue-100 font-bold">Overall Attendance</span>
              <div className="mt-1 text-4xl font-extrabold tracking-tight text-white">
                {summary.attendance_percentage}%
              </div>
              <span className="mt-1 text-[11px] font-semibold text-emerald-300 flex items-center gap-1">
                <CheckCircle2 size={13} /> {summary.attendance_percentage >= 75 ? "Good Standing" : "Needs Attention"}
              </span>
            </div>
          </div>
        </div>

        {/* SUMMARY STAT CARDS */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Classes</p>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
                  {summary.total_classes}
                </h3>
              </div>
              <div className="rounded-2xl bg-blue-500/10 p-3 text-blue-600 dark:text-blue-400">
                <BookOpen size={24} />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Present Days</p>
                <h3 className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                  {summary.present}
                </h3>
              </div>
              <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 size={24} />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Absent Days</p>
                <h3 className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">
                  {summary.total_classes - summary.present}
                </h3>
              </div>
              <div className="rounded-2xl bg-rose-500/10 p-3 text-rose-600 dark:text-rose-400">
                <XCircle size={24} />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Parent Alerts Sent</p>
                <h3 className="text-2xl font-extrabold text-purple-600 dark:text-purple-400 mt-1">
                  {alertLogs.length}
                </h3>
              </div>
              <div className="rounded-2xl bg-purple-500/10 p-3 text-purple-600 dark:text-purple-400">
                <BellRing size={24} />
              </div>
            </div>
          </Card>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 text-sm font-bold">
          <button
            type="button"
            onClick={() => setActiveTab("attendance")}
            className={`pb-3 transition relative ${
              activeTab === "attendance"
                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            📋 Attendance Log History ({filteredHistory.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("alerts")}
            className={`pb-3 transition relative ${
              activeTab === "alerts"
                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            📲 Parent SMS / WhatsApp Alerts ({alertLogs.length})
          </button>
        </div>

        {/* TAB 1: ATTENDANCE HISTORY TABLE */}
        {activeTab === "attendance" && (
          <Card>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Date-wise Attendance Records
                </h2>
                <p className="text-xs text-slate-500">
                  Verified face recognition attendance logs
                </p>
              </div>

              {/* Month Filter */}
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-slate-400" />
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold outline-none"
                >
                  <option value="all">All Months</option>
                  <option value="1">January</option>
                  <option value="2">February</option>
                  <option value="3">March</option>
                  <option value="4">April</option>
                  <option value="5">May</option>
                  <option value="6">June</option>
                  <option value="7">July</option>
                  <option value="8">August</option>
                  <option value="9">September</option>
                  <option value="10">October</option>
                  <option value="11">November</option>
                  <option value="12">December</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                <thead className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Time</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {filteredHistory.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-400">
                        No attendance records found for selected period.
                      </td>
                    </tr>
                  ) : (
                    filteredHistory.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                        <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100">
                          {item.date ? new Date(item.date).toLocaleDateString("en-IN", { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }) : "N/A"}
                        </td>
                        <td className="py-3.5 px-4 font-mono">
                          {item.time || "09:00 AM"}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-extrabold ${
                              item.status === "Present" || item.status === "P"
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                                : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30"
                            }`}
                          >
                            {item.status === "Present" || item.status === "P" ? (
                              <CheckCircle2 size={13} />
                            ) : (
                              <XCircle size={13} />
                            )}
                            {item.status === "Present" || item.status === "P" ? "Present" : "Absent"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-400 font-medium">
                          AI Face Camera Scan
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* TAB 2: PARENT ALERT LOGS */}
        {activeTab === "alerts" && (
          <Card>
            <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <BellRing size={20} className="text-purple-600" /> Parent SMS & WhatsApp Notification History
              </h2>
              <p className="text-xs text-slate-500">
                Log of automatic alerts sent to parent contact ({student?.parent_phone || "Registered Phone"})
              </p>
            </div>

            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                <thead className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Sent At</th>
                    <th className="py-3 px-4">Recipient Phone</th>
                    <th className="py-3 px-4">Channel</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Message Content</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {alertLogs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        No parent alert notifications sent yet.
                      </td>
                    </tr>
                  ) : (
                    alertLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                        <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-slate-100 whitespace-nowrap">
                          {new Date(log.sent_at).toLocaleString("en-IN")}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-semibold text-slate-700 dark:text-slate-300">
                          {log.parent_phone}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="uppercase font-bold text-[10px] px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-300">
                            {log.channel}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600">
                            <CheckCircle2 size={12} /> {log.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 max-w-sm">
                          {log.message}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}

export default StudentPortal;
