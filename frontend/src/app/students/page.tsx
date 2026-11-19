"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Download,
  Edit,
  Trash2,
  Upload,
  Search,
  Users,
  Eye,
  CheckCircle,
  XCircle,
} from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import { getAttendance } from "../../api/attendanceApi";
import {
  getStudents,
  addStudent,
  updateStudent,
  deleteStudent,
  getStudentAttendance,
  uploadStudentPhoto,
  uploadStudentsBulk,
} from "../../api/studentApi";

import ProtectedRoute from "../../components/ProtectedRoute";
import DashboardLayout from "../../layouts/DashboardLayout";
import PageTitle from "../../components/PageTitle";
import StudentModal from "../../components/StudentModal";
import DeleteModal from "../../components/DeleteModal";
import AttendanceHistoryModal from "../../components/AttendanceHistoryModal";
import API from "../../api/client";
import { Student, AttendanceRecord } from "../../types";

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [attendanceHistory, setAttendanceHistory] = useState<any>(null);
  const [uploadingBulk, setUploadingBulk] = useState(false);

  const loadStudents = async () => {
    try {
      const studentRes = await getStudents();
      setStudents(studentRes.data || []);

      try {
        const attendanceRes = await getAttendance();
        setAttendance(attendanceRes.data || []);
      } catch (e) {
        console.error("Attendance Load Error:", e);
      }
    } catch (err) {
      console.error("Student load error:", err);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleSave = async (formData: any) => {
    try {
      const { photo, ...studentPayload } = formData;
      let studentId = editingStudent?.id;

      if (editingStudent) {
        await updateStudent(editingStudent.id, studentPayload);
      } else {
        const res = await addStudent(studentPayload);
        studentId = res.data.id;
      }

      if (photo && studentId) {
        await uploadStudentPhoto(studentId, photo);
      }

      setOpenModal(false);
      setEditingStudent(null);
      loadStudents();
    } catch (err: any) {
      console.error("Save student error:", err);
      let errorMsg = err.message;
      if (err.response?.data?.detail) {
        const detail = err.response.data.detail;
        if (typeof detail === "string") {
          errorMsg = detail;
        } else if (Array.isArray(detail)) {
          errorMsg = detail
            .map((d: any) => d.msg || JSON.stringify(d))
            .join(", ");
        } else {
          errorMsg = JSON.stringify(detail);
        }
      }
      alert("Failed to save student: " + errorMsg);
    }
  };

  const handleDelete = async () => {
    if (!selectedStudent) return;
    try {
      await deleteStudent(selectedStudent.id);
      setDeleteOpen(false);
      setSelectedStudent(null);
      loadStudents();
    } catch (err: any) {
      alert("Failed to delete student: " + (err.response?.data?.detail || err.message));
    }
  };

  const handleViewHistory = async (student: Student) => {
    try {
      const res = await getStudentAttendance(student.id);
      setAttendanceHistory(res.data);
      setHistoryOpen(true);
    } catch (err) {
      alert("Unable to fetch attendance history");
    }
  };

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingBulk(true);
    try {
      await uploadStudentsBulk(file);
      alert("Bulk upload completed successfully!");
      loadStudents();
    } catch (err: any) {
      alert("Bulk upload failed: " + (err.response?.data?.detail || err.message));
    } finally {
      setUploadingBulk(false);
      e.target.value = "";
    }
  };

  const exportStudents = () => {
    const rows = students.map((s) => ({
      ID: s.roll,
      Name: s.name,
      Department: s.department,
      Year: s.year,
      Email: s.email || "",
      "Parent Phone": s.parent_phone || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    saveAs(data, `students_${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.roll.toLowerCase().includes(search.toLowerCase()) ||
      s.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ProtectedRoute allowedRoles={["admin", "teacher"]}>
      <DashboardLayout>
        <PageTitle
          title="Students Directory"
          subtitle="Manage student enrollment, facial telemetry records, and academic profiles"
        >
          <div className="flex flex-wrap items-center gap-3">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-sm transition hover:bg-slate-50 dark:hover:bg-slate-700">
              <Upload size={16} />
              <span>{uploadingBulk ? "Uploading..." : "Bulk Upload"}</span>
              <input
                type="file"
                accept=".csv, .xlsx, .xls"
                onChange={handleBulkUpload}
                disabled={uploadingBulk}
                className="hidden"
              />
            </label>

            <button
              onClick={exportStudents}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-sm transition hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              <Download size={16} />
              Export
            </button>

            <button
              onClick={() => {
                setEditingStudent(null);
                setOpenModal(true);
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-[#c8f135] px-5 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-[#c8f135]/25 transition hover:bg-[#b5e028] active:scale-95"
            >
              <Plus size={16} />
              Add Student
            </button>
          </div>
        </PageTitle>

        {/* Filter bar */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search by name, ID or department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none focus:border-blue-600"
            />
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <Users size={16} />
            <span>Total: <strong>{filteredStudents.length}</strong> students</span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-3xl glass-card border border-white/40 dark:border-slate-800/80 shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="p-4 pl-6 md:pl-8">Student</th>
                  <th className="p-4">Student ID</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Year/Sem</th>
                  <th className="p-4">Parent Phone</th>
                  <th className="p-4 pr-6 md:pr-8 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="p-4 pl-6 md:pl-8">
                        <div className="flex items-center gap-3">
                          {student.photo ? (
                            <img
                              src={`${API.defaults.baseURL}/${student.photo}`}
                              alt={student.name}
                              className="h-10 w-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shadow-sm"
                            />
                          ) : (
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-sm">
                              {student.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">
                              {student.name}
                            </p>
                            <p className="text-[11px] text-slate-500">{student.email || "No email"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                        {student.roll}
                      </td>
                      <td className="p-4 text-slate-700 dark:text-slate-300 font-semibold">
                        {student.department}
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-400">
                        {student.year}
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-400 font-mono">
                        {student.parent_phone || "—"}
                      </td>
                      <td className="p-4 pr-6 md:pr-8 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleViewHistory(student)}
                            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600"
                            title="View Attendance History"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => {
                              setEditingStudent(student);
                              setOpenModal(true);
                            }}
                            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600"
                            title="Edit Student"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedStudent(student);
                              setDeleteOpen(true);
                            }}
                            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-rose-600"
                            title="Delete Student"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400 font-medium">
                      No students found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <StudentModal
          open={openModal}
          onClose={() => {
            setOpenModal(false);
            setEditingStudent(null);
          }}
          onSave={handleSave}
          student={editingStudent}
        />

        <DeleteModal
          open={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          onConfirm={handleDelete}
          title="Delete Student"
          message={`Are you sure you want to remove ${selectedStudent?.name}? All biometric and attendance records will be removed.`}
        />

        <AttendanceHistoryModal
          open={historyOpen}
          onClose={() => setHistoryOpen(false)}
          data={attendanceHistory}
        />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
