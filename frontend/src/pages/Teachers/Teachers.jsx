import { useEffect, useState } from "react";

import DashboardLayout from "../../layouts/DashboardLayout";

import { getTeachers } from "../../api/teacherApi";

function Teachers() {

  const [teachers, setTeachers] = useState([]);

  const loadTeachers = async () => {
    try {
      const res = await getTeachers();
      setTeachers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadTeachers();
  }, []);

  return (
    <DashboardLayout>

      <h1 className="text-4xl font-bold mb-8 text-slate-900 dark:text-slate-100">
        Teachers
      </h1>

      <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl">
        <table className="w-full text-slate-800 dark:text-slate-100">

          <thead>

            <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 text-left">

              <th className="p-4">Name</th>

              <th className="p-4">Email</th>

              <th className="p-4">Faculty ID</th>

              <th className="p-4">Department</th>

              <th className="p-4">Designation</th>

            </tr>

          </thead>

          <tbody>

            {teachers.map((teacher) => (

              <tr key={teacher.id} className="border-t border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">

                <td className="p-4 font-semibold text-slate-900 dark:text-slate-100">{teacher.name}</td>

                <td className="p-4 text-slate-600 dark:text-slate-300">{teacher.email}</td>

                <td className="p-4 text-slate-600 dark:text-slate-300">{teacher.employee_id}</td>

                <td className="p-4 text-slate-600 dark:text-slate-300">{teacher.department}</td>

                <td className="p-4 text-slate-600 dark:text-slate-300">{teacher.designation}</td>

              </tr>

            ))}

          </tbody>

        </table>
      </div>

    </DashboardLayout>
  );
}

export default Teachers;