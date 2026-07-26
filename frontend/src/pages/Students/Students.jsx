import { useState } from "react";

import {
  Search,
  Plus,
  Download,
  Edit,
  Trash2,
} from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import PageTitle from "../../components/PageTitle";
import StudentModal from "../../components/StudentModal";
import DeleteModal from "../../components/DeleteModal";


const initialStudents = [
  {
    id: 1,
    name: "Rahul Kumar",
    roll: "CS101",
    course: "BCA",
    year: "3rd Year",
    status: "Present",
  },
  {
    id: 2,
    name: "Priya Sharma",
    roll: "CS102",
    course: "BCA",
    year: "2nd Year",
    status: "Present",
  },
  {
    id: 3,
    name: "Aman Singh",
    roll: "CS103",
    course: "B.Tech",
    year: "1st Year",
    status: "Absent",
  },
  {
    id: 4,
    name: "Neha Verma",
    roll: "CS104",
    course: "MCA",
    year: "Final Year",
    status: "Present",
  },
];

function Students() {

  const [students, setStudents] = useState(initialStudents);
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleSaveStudent = (student) => {
    if (student.id) {
      // Edit Student
      setStudents((prev) =>
        prev.map((item) =>
          item.id === student.id
            ? {
              ...item,
              name: student.name,
              roll: student.roll,
              course: student.department,
              year: student.year,
              email: student.email,
            }
            : item
        )
      );
    } else {
      // Add Student
      const newStudent = {
        id: Date.now(),
        name: student.name,
        roll: student.roll,
        course: student.department,
        year: student.year,
        email: student.email,
        status: "Present",
      };

      setStudents((prev) => [...prev, newStudent]);
    }

    setEditingStudent(null);
    setOpenModal(false);
  };

  const handleDelete = () => {
    setStudents((prev) =>
      prev.filter(
        (student) => student.id !== selectedStudent.id
      )
    );

    setDeleteOpen(false);
    setSelectedStudent(null);
  };

  return (
    <DashboardLayout>

      <PageTitle title="Students" subtitle="Manage all students from one place.">
        <button
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-medium hover:bg-slate-50">
          <Download size={18} />
          Export
        </button>
        <button onClick={() => {
          setEditingStudent(null);
          setOpenModal(true);
        }} className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700">
          <Plus size={18} />
          Add Student
        </button>
      </PageTitle>

      {/* Table */}
      <div className="mb-6 flex items-center">
        <div className="relative w-full max-w-md">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search student..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 outline-none focus:border-blue-600"
          />

        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-3xl bg-white shadow-sm">

        <table className="w-full">

          <thead className="bg-slate-50">

            <tr className="text-left text-slate-600">

              <th className="px-6 py-4">Student</th>
              <th className="px-6 py-4">Roll No</th>
              <th className="px-6 py-4">Course</th>
              <th className="px-6 py-4">Year</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">Action</th>

            </tr>

          </thead>

          <tbody>

            {students
              .filter((student) =>
                student.name.toLowerCase().includes(search.toLowerCase()) ||
                student.roll.toLowerCase().includes(search.toLowerCase())
              )
              .map((student) => (

                <tr key={student.id} className="border-t hover:bg-slate-50">

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">

                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-lg font-bold text-white shadow-md">
                        {student.name.charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <h3 className="font-semibold text-slate-800">
                          {student.name}
                        </h3>

                        <p className="text-sm text-slate-500">
                          {student.email || "No Email"}
                        </p>
                      </div>

                    </div>
                  </td>

                  <td className="px-6 py-5">
                    {student.roll}
                  </td>

                  <td className="px-6 py-5">
                    {student.course}
                  </td>

                  <td className="px-6 py-5">
                    {student.year}
                  </td>

                  <td className="px-6 py-5">

                    <span className={`rounded-full px-3 py-1 text-sm font-medium ${student.status === "Present"
                      ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {student.status}
                    </span>

                  </td>

                  <td className="px-6 py-5">

                    <div className="flex justify-center gap-3">

                      <button onClick={() => {
                        setEditingStudent(student);
                        setOpenModal(true);
                      }}
                        className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                      >
                        <Edit size={18} />
                      </button>

                      <button
                        onClick={() => {
                          setSelectedStudent(student);
                          setDeleteOpen(true);
                        }}
                        className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={18} />
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

          </tbody>

        </table>

      </div>
      <StudentModal open={openModal} onClose={() => {
        setOpenModal(false);
        setEditingStudent(null);
      }}
        onSave={handleSaveStudent}
        student={editingStudent}
      />
      <DeleteModal
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setSelectedStudent(null);
        }}
        onConfirm={handleDelete}
        title="Delete Student"
        message={`Are you sure you want to delete ${selectedStudent?.name || "this student"
          }?`}
      />
    </DashboardLayout>
  );
}

export default Students;