import { useEffect, useState } from "react";
import { getAttendance } from "../api/attendanceApi";
import { getStudents } from "../api/studentApi";
import { CheckCircle, Clock, Search, ShieldCheck } from "lucide-react";

function AttendanceTable() {
  const [attendance, setAttendance] = useState([]);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const loadData = async () => {
    try {
      const attendanceRes = await getAttendance();
      const studentRes = await getStudents();

      setAttendance(attendanceRes.data);
      setStudents(studentRes.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
      loadData();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getStudent = (id) => {
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
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200/70 dark:border-slate-800/70 p-6 md:p-7 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
            <ShieldCheck size={15} /> Real-time Feed
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Recent Attendance Logs
          </h2>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Live AI face detection matches & timestamps
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by name or roll..."
              className="rounded-xl border border-slate-200/80 dark:border-slate-700 bg-slate-100/60 dark:bg-slate-800/60 py-2 pl-9 pr-4 text-xs font-medium outline-none transition focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900"
            />
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-xs font-extrabold text-white shadow-md shadow-indigo-500/20">
            {filteredAttendance.length} Verified Logs
          </span>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200/60 dark:border-slate-800/60 bg-slate-100/50 dark:bg-slate-900/50 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              <th className="px-7 py-4">Student Profile</th>
              <th className="px-6 py-4">Roll Number</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Verification Time</th>
              <th className="px-7 py-4 text-right">AI Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
            {filteredAttendance.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-400 dark:text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Clock size={32} className="opacity-40" />
                    <p className="text-sm font-medium">No attendance logs match your filter query.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredAttendance.map((item) => {
                const student = getStudent(item.student_id);

                return (
                  <tr
                    key={item.id}
                    className="group transition-colors duration-150 hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                  >
                    <td className="px-7 py-4">
                      <div className="flex items-center gap-3.5">
                        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 font-bold text-white text-sm shadow-md shadow-indigo-500/15 group-hover:scale-105 transition-transform">
                          {student?.name ? student.name.charAt(0).toUpperCase() : "S"}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                            {student?.name || "Student #" + item.student_id}
                          </h3>
                          <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                            {student?.department || "Computer Science"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">
                      <span className="inline-block rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-xs font-mono">
                        {student?.roll || "N/A"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-xs font-medium text-slate-600 dark:text-slate-400">
                      {item.date}
                    </td>

                    <td className="px-6 py-4 text-xs font-bold text-slate-700 dark:text-slate-300">
                      <span className="inline-flex items-center gap-1">
                        <Clock size={12} className="text-indigo-500" />
                        {item.time?.substring(0, 8)}
                      </span>
                    </td>

                    <td className="px-7 py-4 text-right">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold shadow-sm ${
                          item.status === "Present" || !item.status
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                        }`}
                      >
                        <CheckCircle size={12} />
                        {item.status || "Present"}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AttendanceTable;