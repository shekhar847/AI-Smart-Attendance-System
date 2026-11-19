"use client";

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, GraduationCap } from "lucide-react";

import ProtectedRoute from "../../components/ProtectedRoute";
import DashboardLayout from "../../layouts/DashboardLayout";
import PageTitle from "../../components/PageTitle";
import TeacherModal from "../../components/TeacherModal";
import DeleteModal from "../../components/DeleteModal";

import {
  getTeachers,
  addTeacher,
  updateTeacher,
  deleteTeacher,
  uploadTeacherPhoto,
} from "../../api/teacherApi";
import API from "../../api/client";
import { Teacher } from "../../types";

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  const loadTeachers = async () => {
    try {
      const res = await getTeachers();
      setTeachers(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadTeachers();
  }, []);

  const handleSave = async (teacherData: any) => {
    try {
      const { photo, ...teacherPayload } = teacherData;
      let teacherId: number;

      if (editingTeacher) {
        await updateTeacher(editingTeacher.id, teacherPayload);
        teacherId = editingTeacher.id;
      } else {
        const response = await addTeacher(teacherPayload);
        teacherId = response.data.id;
      }

      if (photo && teacherId) {
        await uploadTeacherPhoto(teacherId, photo);
      }

      setShowModal(false);
      setEditingTeacher(null);
      loadTeachers();
    } catch (err: any) {
      console.error(err);
      let message = "";
      if (err.response?.data?.detail) {
        if (Array.isArray(err.response.data.detail)) {
          message = err.response.data.detail
            .map((e: any) => {
              if (e.loc && e.loc.includes("email")) {
                return "Please enter a valid email address";
              }
              return e.msg;
            })
            .join("\n");
        } else {
          message = err.response.data.detail;
        }
      } else if (err.response?.data?.message) {
        message = err.response.data.message;
      } else if (err.message) {
        message = err.message;
      }
      alert("Failed to save teacher. " + message);
    }
  };

  const handleDelete = async () => {
    if (!selectedTeacher) return;
    try {
      await deleteTeacher(selectedTeacher.id);
      setDeleteOpen(false);
      setSelectedTeacher(null);
      loadTeachers();
    } catch (err: any) {
      alert("Failed to delete teacher: " + (err.response?.data?.detail || err.message));
    }
  };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <DashboardLayout>
        <PageTitle
          title="Faculty Management Portal"
          subtitle="Onboard faculty members, manage department assignments, and configure portal privileges"
        >
          <button
            onClick={() => {
              setEditingTeacher(null);
              setShowModal(true);
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-[#c8f135] px-6 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-[#c8f135]/25 transition hover:bg-[#b5e028] active:scale-95"
          >
            <Plus size={16} />
            Add Teacher
          </button>
        </PageTitle>

        <div className="overflow-hidden rounded-3xl glass-card border border-white/40 dark:border-slate-800/80 shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="p-4 pl-6 md:pl-8">Faculty Member</th>
                  <th className="p-4">Faculty ID</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Designation</th>
                  <th className="p-4 pr-6 md:pr-8 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs font-medium">
                {teachers.length > 0 ? (
                  teachers.map((teacher) => (
                    <tr
                      key={teacher.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="p-4 pl-6 md:pl-8">
                        <div className="flex items-center gap-3">
                          {teacher.photo ? (
                            <img
                              src={`${API.defaults.baseURL}/${teacher.photo}`}
                              alt={teacher.name}
                              className="h-10 w-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shadow-sm"
                            />
                          ) : (
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-sm shadow-sm">
                              {teacher.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">
                              {teacher.name}
                            </p>
                            <p className="text-[11px] text-slate-500">{teacher.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                        {teacher.employee_id}
                      </td>

                      <td className="p-4 text-slate-700 dark:text-slate-300 font-semibold">
                        {teacher.department}
                      </td>

                      <td className="p-4 text-slate-600 dark:text-slate-400">
                        {teacher.designation}
                      </td>

                      <td className="p-4 pr-6 md:pr-8 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingTeacher(teacher);
                              setShowModal(true);
                            }}
                            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600"
                            title="Edit Teacher"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedTeacher(teacher);
                              setDeleteOpen(true);
                            }}
                            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-rose-600"
                            title="Delete Teacher"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400">
                      No teachers added yet. Click &apos;Add Teacher&apos; to onboard faculty.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <TeacherModal
          open={showModal}
          onClose={() => {
            setShowModal(false);
            setEditingTeacher(null);
          }}
          onSave={handleSave}
          teacher={editingTeacher}
        />

        <DeleteModal
          open={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          onConfirm={handleDelete}
          title="Delete Faculty Member"
          message={`Are you sure you want to remove ${selectedTeacher?.name}? Their access credentials will be revoked.`}
        />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
