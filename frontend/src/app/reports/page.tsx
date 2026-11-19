"use client";

import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  Download,
  FileSpreadsheet,
  Users,
  UserCheck,
  UserX,
  Calendar,
  Award,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import ProtectedRoute from "../../components/ProtectedRoute";
import DashboardLayout from "../../layouts/DashboardLayout";
import PageTitle from "../../components/PageTitle";

import {
  getSummary,
  getDailyReport,
  getDateRangeReport,
  getMonthlyReport,
  getBestStudent,
} from "../../api/reportApi";
import API from "../../api/client";
import { ReportSummary, DailyReportItem, MonthlyReportItem, Student } from "../../types";

export default function ReportsPage() {
  const [mounted, setMounted] = useState(false);
  const [summary, setSummary] = useState<ReportSummary>({
    total_students: 0,
    present: 0,
    absent: 0,
  });

  const [daily, setDaily] = useState<DailyReportItem[]>([]);
  const [monthly, setMonthly] = useState<MonthlyReportItem[]>([]);
  const [bestStudent, setBestStudent] = useState<any>(null);

  const today = new Date().toISOString().split("T")[0];
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);
  const [dateReport, setDateReport] = useState<any[]>([]);

  const loadReports = async () => {
    try {
      const [summaryRes, dailyRes, monthlyRes, bestRes] = await Promise.all([
        getSummary(),
        getDailyReport(),
        getMonthlyReport(),
        getBestStudent(),
      ]);

      setSummary(summaryRes.data || { total_students: 0, present: 0, absent: 0 });
      setDaily(dailyRes.data || []);
      setMonthly(monthlyRes.data || []);
      setBestStudent(bestRes.data);
    } catch (err) {
      console.error("Report loading error:", err);
    }
  };

  const handleFilterDateRange = async () => {
    try {
      const res = await getDateRangeReport(fromDate, toDate);
      setDateReport(res.data || []);
    } catch (err) {
      console.error("Date range report error:", err);
    }
  };

  useEffect(() => {
    setMounted(true);
    loadReports();
    handleFilterDateRange();
  }, []);

  const exportExcel = () => {
    const dataToExport = dateReport.length > 0 ? dateReport : daily;
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance_Report");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    saveAs(blob, `attendance_report_${fromDate}_to_${toDate}.xlsx`);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("AI Smart Attendance System - Executive Summary Report", 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);

    const headers = [["Metric", "Count"]];
    const summaryData = [
      ["Total Enrolled Students", String(summary.total_students)],
      ["Present Today", String(summary.present)],
      ["Absent Today", String(summary.absent)],
      [
        "Attendance Rate",
        `${
          summary.total_students > 0
            ? ((summary.present / summary.total_students) * 100).toFixed(1)
            : 0
        }%`,
      ],
    ];

    autoTable(doc, {
      head: headers,
      body: summaryData,
      startY: 28,
      theme: "grid",
    });

    if (dateReport.length > 0) {
      const tableHeaders = [["Student Name", "Roll / ID", "Date", "Status"]];
      const tableRows = dateReport.map((r: any) => [
        r.student_name || r.name || "N/A",
        r.roll || r.student_id || "N/A",
        r.date || "N/A",
        r.status || "Present",
      ]);

      autoTable(doc, {
        head: tableHeaders,
        body: tableRows,
        startY: (doc as any).lastAutoTable.finalY + 15,
        theme: "striped",
      });
    }

    doc.save(`attendance_summary_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  const pieData = [
    { name: "Absent", value: Number(summary.absent || 0) },
    { name: "Present", value: Number(summary.present || 0) },
  ];
  const COLORS = ["#ef4444", "#10b981"];

  return (
    <ProtectedRoute allowedRoles={["admin", "teacher"]}>
      <DashboardLayout>
        <PageTitle
          title="Telemetry Analytics & Reports"
          subtitle="Generate institutional audit reports, export records to XLSX/PDF, and view trends"
        >
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={exportExcel}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition"
            >
              <FileSpreadsheet size={16} className="text-emerald-500" />
              Export Excel
            </button>
            <button
              onClick={exportPDF}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-700 transition active:scale-95"
            >
              <Download size={16} />
              Export PDF
            </button>
          </div>
        </PageTitle>

        {/* Top Summary Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <div className="rounded-3xl glass-card border border-white/40 dark:border-slate-800 p-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Enrolled</p>
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                {summary.total_students}
              </h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Users size={22} />
            </div>
          </div>

          <div className="rounded-3xl glass-card border border-white/40 dark:border-slate-800 p-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-500">Present Count</p>
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                {summary.present}
              </h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <UserCheck size={22} />
            </div>
          </div>

          <div className="rounded-3xl glass-card border border-white/40 dark:border-slate-800 p-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-rose-500">Absent Count</p>
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                {summary.absent}
              </h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <UserX size={22} />
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        {mounted && (
          <div className="grid gap-6 lg:grid-cols-3 mb-8">
            <div className="lg:col-span-2 rounded-3xl glass-card border border-white/40 dark:border-slate-800 p-6 md:p-8">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                Daily Verification Telemetry
              </h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={daily.length > 0 ? daily : [{ date: today, present: summary.present, absent: summary.absent }]}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="date" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                    <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        borderColor: "#334155",
                        borderRadius: "16px",
                        color: "#fff",
                      }}
                    />
                    <Bar dataKey="present" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="absent" fill="#ef4444" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-3xl glass-card border border-white/40 dark:border-slate-800 p-6 md:p-8 flex flex-col justify-between">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                Today&apos;s Ratio
              </h3>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="text-center pt-2 text-xs font-semibold text-slate-400">
                Rate: {summary.total_students > 0 ? ((summary.present / summary.total_students) * 100).toFixed(1) : 0}% Active
              </div>
            </div>
          </div>
        )}

        {/* Date Filter & Results Table */}
        <div className="rounded-3xl glass-card border border-white/40 dark:border-slate-800 p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Filter Records by Custom Date Range
            </h3>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400">From:</span>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs text-slate-800 dark:text-slate-100 outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400">To:</span>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs text-slate-800 dark:text-slate-100 outline-none"
                />
              </div>

              <button
                onClick={handleFilterDateRange}
                className="rounded-xl bg-blue-600 px-4 py-1.5 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition"
              >
                Apply Range
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="p-3.5 pl-6">Student</th>
                  <th className="p-3.5">Roll / ID</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5">Time</th>
                  <th className="p-3.5 pr-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {dateReport.length > 0 ? (
                  dateReport.map((r: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="p-3.5 pl-6 font-bold text-slate-900 dark:text-white">
                        {r.student_name || r.name || `Student #${r.student_id}`}
                      </td>
                      <td className="p-3.5 font-mono text-slate-600 dark:text-slate-300">
                        {r.roll || "—"}
                      </td>
                      <td className="p-3.5 text-slate-600 dark:text-slate-300">
                        {r.date}
                      </td>
                      <td className="p-3.5 font-mono text-slate-600 dark:text-slate-300">
                        {r.time || "—"}
                      </td>
                      <td className="p-3.5 pr-6 text-right">
                        <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          {r.status || "Present"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400">
                      No records found for the selected date range.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
