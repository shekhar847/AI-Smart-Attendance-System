import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import { useEffect, useState } from "react";
import {
  Download,
  FileSpreadsheet,
  Users,
  UserCheck,
  UserX,
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

import DashboardLayout from "../../layouts/DashboardLayout";
import PageTitle from "../../components/PageTitle";

import {
  getSummary,
  getDailyReport,
  getDateRangeReport,
  getMonthlyReport,
  getBestStudent,
} from "../../api/reportApi";

function Reports() {

  const [summary, setSummary] = useState({
    total_students: 0,
    present: 0,
    absent: 0,
  });

  const [daily, setDaily] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [bestStudent, setBestStudent] = useState(null);
  const pieData = [
    {
      name: "Absent",
      value: Number(summary.absent || 0),
    },
    {
      name: "Present",
      value: Number(summary.present || 0),
    },
  ];

  const COLORS = ["#22C55E", "#EF4444"];
  const today = new Date().toISOString().split("T")[0];

  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);

  const [dateReport, setDateReport] = useState([]);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {

    try {

      const summaryRes = await getSummary();

      console.log("========== SUMMARY ==========");
      console.log(JSON.stringify(summaryRes.data, null, 2));
      console.log("=============================");

      const dailyRes = await getDailyReport();
      const monthlyRes = await getMonthlyReport();
      const bestRes = await getBestStudent();

      console.log("Daily =>", dailyRes.data);
      console.log("Monthly =>", monthlyRes.data);
      console.log("Best Student =>", bestRes.data);

      setSummary(summaryRes.data);
      setDaily(dailyRes.data);
      setMonthly(monthlyRes.data);
      setBestStudent(bestRes.data);

    } catch (err) {

      console.error("Reports Error:", err);

      if (err.response) {
        console.log("Response Data:", err.response.data);
        console.log("Status:", err.response.status);
      }

    }

  };

  const generateDateReport = async () => {
    try {

      const res = await getDateRangeReport(
        fromDate,
        toDate
      );

      setDateReport(res.data);

    } catch (err) {
      console.log(err);
    }
  };
  const exportPDF = () => {

    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("AI Smart Attendance Report", 14, 20);

    doc.setFontSize(12);
    doc.text(
      `Generated: ${new Date().toLocaleString()}`,
      14,
      30
    );

    doc.text(
      `Total Students : ${summary.total_students}`,
      14,
      40
    );

    doc.text(
      `Present : ${summary.present}`,
      14,
      48
    );

    doc.text(
      `Absent : ${summary.absent}`,
      14,
      56
    );

    autoTable(doc, {

      startY: 70,

      head: [[
        "Student",
        "Roll",
        "Department",
        "Date",
        "Time",
        "Status",
      ]],

      body: dateReport.map((item) => [
        item.name,
        item.roll,
        item.department,
        item.date,
        item.time,
        item.status,
      ]),

    });

    doc.save("Attendance_Report.pdf");

  };
  const exportExcel = () => {

    const excelData = dateReport.map((item) => ({
      Student: item.name,
      Roll: item.roll,
      Department: item.department,
      Date: item.date,
      Time: item.time,
      Status: item.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Attendance Report"
    );

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob(
      [excelBuffer],
      {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
      }
    );

    saveAs(data, "Attendance_Report.xlsx");

  };

  return (

    <DashboardLayout>

      <PageTitle
        title="Reports"
        subtitle="Attendance reports and analytics"
      >

        <div className="flex gap-3">

          <button
            onClick={exportPDF}
            className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-5 py-3 hover:bg-gray-50 dark:hover:bg-slate-700 transition"
          >
            <Download size={18} />
            Export PDF
          </button>

          <button
            onClick={exportExcel}
            className="flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-white hover:bg-green-700 transition"
          >
            <FileSpreadsheet size={18} />
            Export Excel
          </button>

        </div>

      </PageTitle>

      <div className="mb-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow text-slate-800 dark:text-slate-100">

        <h2 className="mb-5 text-xl font-bold text-slate-900 dark:text-slate-100">
          Date Range Report
        </h2>

        <div className="flex flex-wrap items-end gap-4">

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              From Date
            </label>

            <input
              type="date"
              value={fromDate}
              onChange={(e) =>
                setFromDate(e.target.value)
              }
              className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 px-4 py-3 outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              To Date
            </label>

            <input
              type="date"
              value={toDate}
              onChange={(e) =>
                setToDate(e.target.value)
              }
              className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 px-4 py-3 outline-none"
            />
          </div>

          <button
            onClick={generateDateReport}
            className="rounded-xl bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 transition font-semibold"
          >
            Generate Report
          </button>

        </div>

      </div>

      {/* Summary Cards */}

      <div className="grid gap-6 md:grid-cols-3">

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow">

          <Users
            size={35}
            className="text-blue-600 dark:text-blue-400"
          />

          <h3 className="mt-4 text-gray-500 dark:text-slate-400">
            Total Students
          </h3>

          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">
            {summary.total_students}
          </h1>

        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow">

          <UserCheck
            size={35}
            className="text-green-600 dark:text-green-400"
          />

          <h3 className="mt-4 text-gray-500 dark:text-slate-400">
            Present Today
          </h3>

          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">
            {summary.present}
          </h1>

        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow">

          <UserX
            size={35}
            className="text-red-600 dark:text-red-400"
          />

          <h3 className="mt-4 text-gray-500 dark:text-slate-400">
            Absent Today
          </h3>

          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">
            {summary.absent}
          </h1>

        </div>

      </div>

      <div className="mt-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-xl text-slate-800 dark:text-slate-100">

        <h2 className="mb-8 text-2xl font-bold text-slate-900 dark:text-slate-100">
          Attendance Percentage
        </h2>

        <div className="h-96">

          <ResponsiveContainer>

            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                startAngle={180}
                endAngle={-180}
                label={({ percent }) =>
                  `${(percent * 100).toFixed(0)}%`
                }
              >
                <Cell fill="#EF4444" />
                <Cell fill="#22C55E" />
              </Pie>

              <Tooltip />

              <Legend />

            </PieChart>

          </ResponsiveContainer>

        </div>

      </div>

      <div className="mt-8 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white shadow-xl">

        <h2 className="text-2xl font-bold">
          🏆 Best Attendance Student
        </h2>

        {bestStudent && (

          <div className="mt-6 flex items-center gap-6">

            <img
              src={`${API.defaults.baseURL}/${bestStudent.photo}`}
              alt={bestStudent.name}
              className="h-24 w-24 rounded-full border-4 border-white object-cover"
            />

            <div>

              <h3 className="text-3xl font-bold">
                {bestStudent.name}
              </h3>

              <p className="text-blue-100">
                {bestStudent.roll}
              </p>

              <p className="text-blue-100">
                {bestStudent.department}
              </p>

              <p className="mt-2 text-lg font-semibold">
                Present : {bestStudent.present} Days
              </p>

            </div>

          </div>

        )}

      </div>

      {/* Chart */}

      <div className="mt-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow text-slate-800 dark:text-slate-100">

        <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-slate-100">
          Daily Attendance
        </h2>

        <div className="h-96">

          <ResponsiveContainer>

            <BarChart data={monthly}>

              <CartesianGrid strokeDasharray="5 5" />

              <XAxis dataKey="month" />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="present"
                fill="#2563EB"
                radius={[8, 8, 0, 0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* Table */}

      <div className="mt-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow text-slate-800 dark:text-slate-100">

        <h2 className="mb-5 text-2xl font-bold text-slate-900 dark:text-slate-100">
          Daily Report
        </h2>

        <table className="w-full">

          <thead>

            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">

              <th className="py-3 text-left">
                Date
              </th>

              <th className="py-3 text-left">
                Present Students
              </th>

            </tr>

          </thead>

          <tbody>

            {daily.map((item, index) => (

              <tr
                key={index}
                className="border-b border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300"
              >

                <td className="py-4">
                  {item.date}
                </td>

                <td className="py-4">
                  {item.present}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      <div className="mt-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow text-slate-800 dark:text-slate-100">

        <h2 className="mb-5 text-2xl font-bold text-slate-900 dark:text-slate-100">
          Date Range Attendance
        </h2>

        <table className="w-full">

          <thead>

            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">

              <th className="py-3 text-left">Student</th>
              <th className="py-3 text-left">Roll</th>
              <th className="py-3 text-left">Department</th>
              <th className="py-3 text-left">Date</th>
              <th className="py-3 text-left">Time</th>
              <th className="py-3 text-left">Status</th>

            </tr>

          </thead>

          <tbody>

            {dateReport.map((item, index) => (

              <tr
                key={index}
                className="border-b border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300"
              >

                <td className="py-3">
                  {item.name}
                </td>

                <td>{item.roll}</td>

                <td>{item.department}</td>

                <td>{item.date}</td>

                <td>{item.time}</td>

                <td>

                  <span className="rounded-full bg-green-100 dark:bg-green-950/60 px-3 py-1 text-green-700 dark:text-green-400 font-semibold">
                    {item.status}
                  </span>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </DashboardLayout>

  );

}

export default Reports;