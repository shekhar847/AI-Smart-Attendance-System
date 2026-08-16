import { useEffect, useState } from "react";

import {
  Plus,
  Download,
  Edit,
  Trash2,
} from "lucide-react";

import { getAttendance } from "../../api/attendanceApi";

import {
  getStudents,
  addStudent,
  updateStudent,
  deleteStudent,
  getStudentAttendance,
  uploadStudentPhoto,
} from "../../api/studentApi";

import DashboardLayout from "../../layouts/DashboardLayout";
import PageTitle from "../../components/PageTitle";
import StudentModal from "../../components/StudentModal";
import DeleteModal from "../../components/DeleteModal";
import AttendanceHistoryModal from "../../components/AttendanceHistoryModal";


// ==========================================
// BACKEND URL
// ==========================================

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


// ==========================================
// STUDENTS COMPONENT
// ==========================================

function Students() {

  const [students, setStudents] = useState([]);

  const [attendance, setAttendance] = useState([]);

  const [search, setSearch] = useState("");

  const [openModal, setOpenModal] = useState(false);

  const [editingStudent, setEditingStudent] =
    useState(null);

  const [deleteOpen, setDeleteOpen] =
    useState(false);

  const [selectedStudent, setSelectedStudent] =
    useState(null);

  const [historyOpen, setHistoryOpen] =
    useState(false);

  const [attendanceHistory, setAttendanceHistory] =
    useState(null);


  // ==========================================
  // LOAD STUDENTS
  // ==========================================

  const loadStudents = async () => {

    try {

      const studentRes = await getStudents();

      setStudents(studentRes.data || []);


      // Attendance separately load karo
      try {

        const attendanceRes =
          await getAttendance();

        setAttendance(
          attendanceRes.data || []
        );

      } catch (attendanceError) {

        console.error(
          "Attendance Load Error:",
          attendanceError
        );

        setAttendance([]);

      }

    } catch (error) {

      console.error(
        "Load Students Error:",
        error
      );

      console.error(
        "Response:",
        error.response
      );

      console.error(
        "Data:",
        error.response?.data
      );

      alert(
        error.response?.data?.detail ||
        "Unable to load students"
      );

    }

  };


  // ==========================================
  // LOAD ON PAGE OPEN
  // ==========================================

  useEffect(() => {

    loadStudents();

  }, []);


  // ==========================================
  // ADD / UPDATE STUDENT
  // ==========================================

  const handleSaveStudent = async (student) => {

    try {

      let studentId;


      // ========================================
      // ADD STUDENT
      // ========================================

      if (!student.id) {

        console.log(
          "Creating new student..."
        );

        const response = await addStudent({

          name: student.name,

          email: student.email,

          roll: student.roll,

          department: student.department,

          year: student.year,

        });


        studentId = response.data.id;


        console.log(
          "Student created successfully:",
          studentId
        );

      }


      // ========================================
      // UPDATE STUDENT
      // ========================================

      else {

        studentId = student.id;


        console.log(
          "Updating student:",
          studentId
        );


        await updateStudent(
          student.id,
          {

            name: student.name,

            email: student.email,

            roll: student.roll,

            department: student.department,

            year: student.year,

          }
        );


        console.log(
          "Student updated successfully"
        );

      }


      // ========================================
      // UPLOAD PHOTO
      // ========================================

      if (student.photo) {

        console.log(
          "Uploading student photo..."
        );

        console.log(
          "Student ID:",
          studentId
        );

        console.log(
          "Photo:",
          student.photo.name
        );


        const photoResponse =
          await uploadStudentPhoto(
            studentId,
            student.photo
          );


        console.log(
          "Photo uploaded successfully:",
          photoResponse.data
        );

      } else {

        console.log(
          "No new photo selected"
        );

      }


      // ========================================
      // REFRESH STUDENT LIST
      // ========================================

      await loadStudents();


      // ========================================
      // CLOSE MODAL
      // ========================================

      setEditingStudent(null);

      setOpenModal(false);


      console.log(
        "Student save process completed"
      );

    } catch (error) {

      console.error(
        "================================"
      );

      console.error(
        "SAVE STUDENT ERROR:",
        error
      );

      console.error(
        "RESPONSE:",
        error.response
      );

      console.error(
        "DATA:",
        error.response?.data
      );

      console.error(
        "================================"
      );


      const message =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message ||
        "Failed to save student";


      alert(message);

    }

  };


  // ==========================================
  // DELETE STUDENT
  // ==========================================

  const handleDelete = async () => {

    try {

      if (!selectedStudent) {
        return;
      }


      console.log(
        "Deleting student:",
        selectedStudent.id
      );


      await deleteStudent(
        selectedStudent.id
      );


      await loadStudents();


      setDeleteOpen(false);

      setSelectedStudent(null);


      console.log(
        "Student deleted successfully"
      );

    } catch (error) {

      console.error(
        "Delete Student Error:",
        error
      );

      console.error(
        "Response:",
        error.response
      );

      console.error(
        "Data:",
        error.response?.data
      );


      alert(
        error.response?.data?.detail ||
        "Failed to delete student"
      );

    }

  };


  // ==========================================
  // ATTENDANCE HISTORY
  // ==========================================

  const handleViewHistory = async (
    studentId
  ) => {

    try {

      const response =
        await getStudentAttendance(
          studentId
        );


      setAttendanceHistory(
        response.data
      );


      setHistoryOpen(true);

    } catch (error) {

      console.error(
        "Attendance History Error:",
        error
      );


      console.error(
        "Response:",
        error.response
      );


      alert(
        error.response?.data?.detail ||
        "Unable to load attendance history"
      );

    }

  };


  // ==========================================
  // TODAY STATUS
  // ==========================================

  const getStatus = (studentId) => {

    const today =
      new Date()
        .toISOString()
        .split("T")[0];


    const found =
      attendance.find(
        (item) =>
          item.student_id === studentId &&
          item.date === today
      );


    return found
      ? "Present"
      : "Absent";

  };


  // ==========================================
  // SEARCH
  // ==========================================

  const filteredStudents =
    students.filter((student) => {

      const searchText =
        search.toLowerCase().trim();


      const name =
        student.name
          ?.toLowerCase() || "";


      const roll =
        student.roll
          ?.toLowerCase() || "";


      return (
        name.includes(searchText) ||
        roll.includes(searchText)
      );

    });


  // ==========================================
  // PHOTO URL
  // ==========================================

  const getPhotoUrl = (photo) => {

    if (!photo) {
      return null;
    }


    // Windows path ko Linux/web path mein convert
    let cleanPath =
      photo.replace(/\\/g, "/");


    // Agar database mein:
    // uploads/students/file.jpg
    // stored hai
    if (cleanPath.startsWith("uploads/")) {

      return `${API_BASE_URL}/${cleanPath}`;

    }


    // Agar database mein:
    // students/file.jpg
    // stored hai
    if (cleanPath.startsWith("students/")) {

      return `${API_BASE_URL}/uploads/${cleanPath}`;

    }


    // Agar sirf filename stored ho
    return `${API_BASE_URL}/uploads/${cleanPath}`;

  };


  // ==========================================
  // UI
  // ==========================================

  return (

    <DashboardLayout>

      {/* ========================================
          PAGE TITLE
      ======================================== */}

      <PageTitle
        title="Students"
        subtitle="Manage all students from one place."
      >

        <div
          className="
            flex
            flex-wrap
            items-center
            gap-3
          "
        >

          {/* TOTAL STUDENTS */}

          <div
            className="
              rounded-xl
              border
              border-blue-100
              dark:border-blue-950
              bg-blue-50
              dark:bg-blue-950/40
              px-4
              py-3
            "
          >

            <p
              className="
                text-xs
                font-medium
                uppercase
                tracking-wide
                text-blue-600
                dark:text-blue-400
              "
            >
              Total Students
            </p>


            <h3
              className="
                text-xl
                font-bold
                text-slate-900
                dark:text-slate-100
              "
            >
              {students.length}
            </h3>

          </div>


          {/* EXPORT */}

          <button
            type="button"
            className="
              flex
              items-center
              gap-2
              rounded-xl
              border
              border-slate-200
              dark:border-slate-800
              bg-white
              dark:bg-slate-800
              text-slate-700
              dark:text-slate-200
              px-5
              py-3
              font-medium
              transition
              hover:-translate-y-0.5
              hover:bg-slate-50
              dark:hover:bg-slate-700
              hover:shadow-md
            "
          >

            <Download size={18} />

            Export

          </button>


          {/* ADD STUDENT */}

          <button
            type="button"
            onClick={() => {

              setEditingStudent(null);

              setOpenModal(true);

            }}
            className="
              flex
              items-center
              gap-2
              rounded-xl
              bg-gradient-to-r
              from-blue-600
              to-cyan-500
              px-6
              py-3
              font-medium
              text-white
              shadow-lg
              transition
              hover:-translate-y-0.5
              hover:shadow-xl
            "
          >

            <Plus size={18} />

            Add Student

          </button>

        </div>

      </PageTitle>


      {/* ========================================
          SEARCH
      ======================================== */}

      <div
        className="
          mb-6
          flex
          items-center
          justify-between
        "
      >

        <input
          type="text"
          placeholder="Search by name or roll number..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="
            w-full
            max-w-md
            rounded-xl
            border
            border-slate-300
            dark:border-slate-700
            bg-white
            dark:bg-slate-800
            text-slate-800
            dark:text-slate-100
            placeholder-slate-400
            dark:placeholder-slate-500
            px-4
            py-3
            outline-none
            transition
            focus:border-blue-600
          "
        />

      </div>


      {/* ========================================
          STUDENT TABLE
      ======================================== */}

      <div
        className="
          mt-8
          overflow-hidden
          rounded-3xl
          border
          border-slate-200
          dark:border-slate-800
          bg-white
          dark:bg-slate-900
          shadow-xl
        "
      >

        <div
          className="overflow-x-auto"
        >

          <table
            className="
              w-full
              border-separate
              border-spacing-y-1
            "
          >

            {/* TABLE HEADER */}

            <thead
              className="
                bg-gradient-to-r
                from-slate-50
                to-slate-100
                dark:from-slate-800
                dark:to-slate-800/80
              "
            >

              <tr
                className="
                  text-left
                  text-slate-600
                  dark:text-slate-300
                "
              >

                <th className="px-6 py-4">
                  Student
                </th>

                <th className="px-6 py-4">
                  Roll No
                </th>

                <th className="px-6 py-4">
                  Course
                </th>

                <th className="px-6 py-4">
                  Year
                </th>

                <th className="px-6 py-4">
                  Status
                </th>

                <th
                  className="
                    px-6
                    py-4
                    text-center
                  "
                >
                  Action
                </th>

              </tr>

            </thead>


            {/* TABLE BODY */}

            <tbody>

              {filteredStudents.length === 0 ? (

                <tr>

                  <td
                    colSpan="6"
                    className="
                      px-6
                      py-12
                      text-center
                      text-slate-500
                      dark:text-slate-400
                    "
                  >

                    {search
                      ? "No students found for your search."
                      : "No students found."}

                  </td>

                </tr>

              ) : (

                filteredStudents.map(
                  (student) => {

                    const photoUrl =
                      getPhotoUrl(
                        student.photo
                      );


                    return (

                      <tr
                        key={student.id}
                        className="
                          border-t
                          border-slate-100
                          dark:border-slate-800
                          transition-all
                          duration-300
                          hover:bg-blue-50/40
                          dark:hover:bg-slate-800/60
                        "
                      >

                        {/* ==================================
                            STUDENT
                        ================================== */}

                        <td
                          className="
                            px-6
                            py-5
                          "
                        >

                          <div
                            className="
                              flex
                              items-center
                              gap-4
                            "
                          >

                            {/* PHOTO */}

                            <div
                              className="
                                h-12
                                w-12
                                shrink-0
                                overflow-hidden
                                rounded-full
                                border
                                border-slate-200
                                dark:border-slate-700
                                bg-slate-100
                                dark:bg-slate-800
                              "
                            >

                              {photoUrl ? (

                                <img
                                  src={photoUrl}
                                  alt={student.name}
                                  className="
                                    h-full
                                    w-full
                                    object-cover
                                  "
                                  onError={(e) => {

                                    console.error(
                                      "Student image failed:",
                                      photoUrl
                                    );


                                    e.currentTarget.style.display =
                                      "none";

                                  }}
                                />

                              ) : (

                                <div
                                  className="
                                    flex
                                    h-full
                                    w-full
                                    items-center
                                    justify-center
                                    bg-gradient-to-r
                                    from-blue-600
                                    to-cyan-500
                                    font-bold
                                    text-white
                                  "
                                >

                                  {student.name
                                    ?.charAt(0)
                                    .toUpperCase()}

                                </div>

                              )}

                            </div>


                            {/* NAME + EMAIL */}

                            <div>

                              <h3
                                onClick={() =>
                                  handleViewHistory(
                                    student.id
                                  )
                                }
                                className="
                                  cursor-pointer
                                  font-semibold
                                  text-blue-600
                                  dark:text-blue-400
                                  hover:underline
                                "
                              >

                                {student.name}

                              </h3>


                              <p
                                className="
                                  text-sm
                                  text-slate-500
                                  dark:text-slate-400
                                "
                              >

                                {student.email ||
                                  "No Email"}

                              </p>

                            </div>

                          </div>

                        </td>


                        {/* ==================================
                            ROLL
                        ================================== */}

                        <td
                          className="
                            px-6
                            py-5
                            text-slate-700
                            dark:text-slate-300
                          "
                        >

                          {student.roll}

                        </td>


                        {/* ==================================
                            DEPARTMENT
                        ================================== */}

                        <td
                          className="
                            px-6
                            py-5
                            text-slate-700
                            dark:text-slate-300
                          "
                        >

                          {student.department}

                        </td>


                        {/* ==================================
                            YEAR
                        ================================== */}

                        <td
                          className="
                            px-6
                            py-5
                            text-slate-700
                            dark:text-slate-300
                          "
                        >

                          {student.year}

                        </td>


                        {/* ==================================
                            STATUS
                        ================================== */}

                        <td
                          className="
                            px-6
                            py-5
                          "
                        >

                          <span
                            className={`
                              rounded-full
                              px-3
                              py-1
                              text-sm
                              font-medium
                              ${
                                getStatus(
                                  student.id
                                ) === "Present"
                                  ? "bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-400"
                                  : "bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400"
                              }
                            `}
                          >

                            {getStatus(
                              student.id
                            )}

                          </span>

                        </td>


                        {/* ==================================
                            ACTIONS
                        ================================== */}

                        <td
                          className="
                            px-6
                            py-5
                          "
                        >

                          <div
                            className="
                              flex
                              justify-center
                              gap-3
                            "
                          >

                            {/* EDIT */}

                            <button
                              type="button"
                              onClick={() => {

                                setEditingStudent(
                                  student
                                );

                                setOpenModal(
                                  true
                                );

                              }}
                              className="
                                rounded-lg
                                p-2
                                text-blue-600
                                dark:text-blue-400
                                hover:bg-blue-50
                                dark:hover:bg-blue-950/40
                              "
                              title="Edit Student"
                            >

                              <Edit size={18} />

                            </button>


                            {/* DELETE */}

                            <button
                              type="button"
                              onClick={() => {

                                setSelectedStudent(
                                  student
                                );

                                setDeleteOpen(
                                  true
                                );

                              }}
                              className="
                                rounded-lg
                                p-2
                                text-red-600
                                dark:text-red-400
                                hover:bg-red-50
                                dark:hover:bg-red-950/40
                              "
                              title="Delete Student"
                            >

                              <Trash2 size={18} />

                            </button>

                          </div>

                        </td>

                      </tr>

                    );

                  }
                )

              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* ========================================
          STUDENT MODAL
      ======================================== */}

      <StudentModal
        open={openModal}

        onClose={() => {

          setOpenModal(false);

          setEditingStudent(null);

        }}

        onSave={handleSaveStudent}

        student={editingStudent}
      />


      {/* ========================================
          DELETE MODAL
      ======================================== */}

      <DeleteModal
        open={deleteOpen}

        onClose={() => {

          setDeleteOpen(false);

          setSelectedStudent(null);

        }}

        onConfirm={handleDelete}

        title="Delete Student"

        message={`
          Are you sure you want to delete
          ${selectedStudent?.name || "this student"}?
        `}
      />


      {/* ========================================
          ATTENDANCE HISTORY
      ======================================== */}

      <AttendanceHistoryModal
        open={historyOpen}

        onClose={() =>
          setHistoryOpen(false)
        }

        data={attendanceHistory}
      />

    </DashboardLayout>

  );

}

export default Students;