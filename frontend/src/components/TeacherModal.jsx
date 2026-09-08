import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

function TeacherModal({ open, onClose, onSave, teacher }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    employee_id: "",
    department: "",
    designation: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) return;

    if (teacher) {
      setForm({
        name: teacher.name || "",
        email: teacher.email || "",
        employee_id: teacher.employee_id || "",
        department: teacher.department || "",
        designation: teacher.designation || "",
        password: "",
      });
    } else {
      setForm({
        name: "",
        email: "",
        employee_id: "",
        department: "",
        designation: "",
        password: "",
      });
    }

    setErrors({});
  }, [teacher, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (!form.employee_id.trim()) newErrors.employee_id = "Employee ID is required";
    if (!form.department.trim()) newErrors.department = "Department is required";
    if (!form.designation.trim()) newErrors.designation = "Designation is required";
    if (!teacher && !form.password.trim()) newErrors.password = "Password is required for new teachers";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave(form);
    }
  };

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {teacher ? "Edit Teacher" : "Add New Teacher"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form id="teacher-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                  errors.name ? "border-red-500" : "border-slate-200 dark:border-slate-700"
                }`}
                placeholder="Enter teacher's name"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                  errors.email ? "border-red-500" : "border-slate-200 dark:border-slate-700"
                }`}
                placeholder="Enter email address"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Employee ID
                </label>
                <input
                  type="text"
                  name="employee_id"
                  value={form.employee_id}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                    errors.employee_id ? "border-red-500" : "border-slate-200 dark:border-slate-700"
                  }`}
                  placeholder="e.g. FAC001"
                />
                {errors.employee_id && <p className="text-red-500 text-xs mt-1">{errors.employee_id}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                    errors.department ? "border-red-500" : "border-slate-200 dark:border-slate-700"
                  }`}
                  placeholder="e.g. Computer Science"
                />
                {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Designation
                </label>
                <input
                  type="text"
                  name="designation"
                  value={form.designation}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                    errors.designation ? "border-red-500" : "border-slate-200 dark:border-slate-700"
                  }`}
                  placeholder="e.g. Assistant Professor"
                />
                {errors.designation && <p className="text-red-500 text-xs mt-1">{errors.designation}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Password {teacher && "(Leave blank to keep)"}
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                    errors.password ? "border-red-500" : "border-slate-200 dark:border-slate-700"
                  }`}
                  placeholder="Enter password"
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 bg-slate-50 dark:bg-slate-800/30">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="teacher-form"
            className="px-5 py-2.5 rounded-xl font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
          >
            {teacher ? "Update Teacher" : "Save Teacher"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default TeacherModal;
