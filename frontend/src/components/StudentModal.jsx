import { useState, useEffect } from "react";
import { X } from "lucide-react";

function StudentModal({
  open,
  onClose,
  onSave,
  student,
}) {
  const [form, setForm] = useState({
    name: "",
    roll: "",
    department: "",
    year: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  useEffect(() => {
    if (student) {
      setForm({
        name: student.name || "",
        roll: student.roll || "",
        department: student.course || "",
        year: student.year || "",
        email: student.email || "",
        phone: student.phone || "",
      });
    } else {
      setForm({
        name: "",
        roll: "",
        department: "",
        year: "",
        email: "",
        phone: "",
      });
    }
  }, [student, open]);

  const handleSave = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Full Name is required";
    }

    if (!form.roll.trim()) {
      newErrors.roll = "Roll Number is required";
    }

    if (!form.department.trim()) {
      newErrors.department = "Department is required";
    }

    if (!form.year.trim()) {
      newErrors.year = "Year is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    onSave({
      ...form,
      id: student?.id,
    });

    setForm({
      name: "",
      roll: "",
      department: "",
      year: "",
      email: "",
      phone: "",
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-8 shadow-2xl">

        {/* Header */}

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              {student ? "Edit Student" : "Add New Student"}
            </h2>

            <p className="mt-1 text-slate-500">
              Fill the student details below.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 hover:bg-slate-100"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}

        <div className="grid gap-5 md:grid-cols-2">

          <Input
            label="Full Name"
            placeholder="Rahul Kumar"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            error={errors.name}
          />

          <Input
            label="Roll Number"
            placeholder="CS101"
            value={form.roll}
            onChange={(e) =>
              setForm({ ...form, roll: e.target.value })
            }
            error={errors.roll}
          />

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Department
            </label>

            <select
              value={form.department}
              onChange={(e) =>
                setForm({
                  ...form,
                  department: e.target.value,
                })
              }
              className={`w-full rounded-xl border px-4 py-3 outline-none transition-all ${errors.department
                ? "border-red-500"
                : "border-slate-300 focus:border-blue-600"
                }`}
            >
              <option value="">Select Department</option>
              <option value="BCA">BCA</option>
              <option value="B.Tech">B.Tech</option>
              <option value="MCA">MCA</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Information Technology">Information Technology</option>
            </select>

            {errors.department && (
              <p className="mt-2 text-sm text-red-500">
                {errors.department}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Year
            </label>

            <select
              value={form.year}
              onChange={(e) =>
                setForm({
                  ...form,
                  year: e.target.value,
                })
              }
              className={`w-full rounded-xl border px-4 py-3 outline-none transition-all ${errors.year
                ? "border-red-500"
                : "border-slate-300 focus:border-blue-600"
                }`}
            >
              <option value="">Select Year</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="Final Year">Final Year</option>
            </select>

            {errors.year && (
              <p className="mt-2 text-sm text-red-500">
                {errors.year}
              </p>
            )}
          </div>

          <Input
            label="Email"
            placeholder="rahul@gmail.com"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            error={errors.email}
          />

          <Input
            label="Phone"
            placeholder="+91 9876543210"
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
            error={errors.phone}
          />

        </div>

        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Student Photo
          </label>

          <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-10 transition hover:border-blue-500 hover:bg-blue-50">
            <div className="text-5xl">📷</div>

            <h3 className="mt-3 font-semibold text-slate-700">
              Upload Student Photo
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Click to browse or drag & drop
            </p>

            <input
              type="file"
              className="hidden"
            />
          </label>
        </div>

        {/* Buttons */}

        <div className="mt-8 flex justify-end gap-3">

          <button
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-6 py-3 font-medium hover:bg-slate-100"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
          >
            {student ? "Update Student" : "Save Student"}
          </button>

        </div>

      </div>
    </div>
  );
}

function Input({
  label,
  placeholder,
  value,
  onChange,
  error,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full rounded-xl border px-4 py-3 outline-none transition-all ${error
          ? "border-red-500 focus:border-red-500"
          : "border-slate-300 focus:border-blue-600"
          }`}
      />

      {error && (
        <p className="mt-2 text-sm font-medium text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

export default StudentModal;