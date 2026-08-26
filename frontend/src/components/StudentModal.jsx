import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import API from "../api/client";

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
    parent_name: "",
    parent_phone: "",
    parent_email: "",
    password: "",
  });

  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) {
      return;
    }

    if (student) {
      setForm({
        name: student.name || "",
        roll: student.roll || "",
        department: student.department || "",
        year: student.year || "",
        email: student.email || "",
        parent_name: student.parent_name || "",
        parent_phone: student.parent_phone || "",
        parent_email: student.parent_email || "",
        password: "",
      });

      setPhoto(null);

      if (student.photo) {
        setPhotoPreview(`${API.defaults.baseURL}/${student.photo}`);
      } else {
        setPhotoPreview(null);
      }
    } else {
      setForm({
        name: "",
        roll: "",
        department: "",
        year: "",
        email: "",
        parent_name: "",
        parent_phone: "",
        parent_email: "",
        password: "",
      });

      setPhoto(null);
      setPhotoPreview(null);
    }

    setErrors({});
  }, [student, open]);

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        photo: "Please select a valid image file.",
      }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        photo: "Image size must be less than 5 MB.",
      }));
      return;
    }

    setPhoto(file);
    const previewUrl = URL.createObjectURL(file);
    setPhotoPreview(previewUrl);

    setErrors((prev) => ({
      ...prev,
      photo: "",
    }));
  };

  const handleSave = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Full Name is required";
    if (!form.roll.trim()) newErrors.roll = "Roll Number is required";
    if (!form.department.trim()) newErrors.department = "Department is required";
    if (!form.year.trim()) newErrors.year = "Year is required";
    if (!student && !photo) newErrors.photo = "Student photo is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    onSave({
      ...form,
      id: student?.id,
      photo: photo,
    });
  };

  const handleClose = () => {
    setErrors({});
    setPhoto(null);
    setPhotoPreview(null);
    onClose();
  };

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 overflow-y-auto">
      <div className="my-auto max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-3xl glass-card border border-white/40 dark:border-slate-800 p-6 md:p-7 shadow-2xl transition-all">
        {/* HEADER */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {student ? "Edit Student & Parent Details" : "Add New Student"}
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Fill student academic information and parent contact details for automated alerts.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="rounded-xl p-2 text-slate-600 dark:text-slate-400 transition hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
          >
            <X size={24} />
          </button>
        </div>

        {/* SECTION 1: ACADEMIC DETAILS */}
        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-3">
            Academic Information
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Student Full Name *"
              placeholder="Rahul Kumar"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              error={errors.name}
            />

            <Input
              label="Roll Number *"
              placeholder="CS101"
              value={form.roll}
              onChange={(e) => setForm({ ...form, roll: e.target.value })}
              error={errors.roll}
            />

            <div>
              <label className="mb-2 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Department *
              </label>
              <select
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                className={`w-full rounded-xl border bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 px-4 py-2.5 text-sm outline-none transition ${
                  errors.department ? "border-red-500" : "border-slate-300 dark:border-slate-700 focus:border-blue-600"
                }`}
              >
                <option value="">Select Department</option>
                <option value="BCA">BCA</option>
                <option value="B.Tech">B.Tech</option>
                <option value="MCA">MCA</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Information Technology">Information Technology</option>
              </select>
              {errors.department && <p className="mt-1 text-xs text-red-500">{errors.department}</p>}
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Year *
              </label>
              <select
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                className={`w-full rounded-xl border bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 px-4 py-2.5 text-sm outline-none transition ${
                  errors.year ? "border-red-500" : "border-slate-300 dark:border-slate-700 focus:border-blue-600"
                }`}
              >
                <option value="">Select Year</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="Final Year">Final Year</option>
              </select>
              {errors.year && <p className="mt-1 text-xs text-red-500">{errors.year}</p>}
            </div>

            <Input
              label="Student Email"
              placeholder="rahul@gmail.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              error={errors.email}
            />

            <Input
              label="Portal Password"
              placeholder={student ? "Leave blank to keep unchanged" : "Default: Roll Number"}
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              error={errors.password}
            />
          </div>
        </div>

        {/* SECTION 2: PARENT & SMS/WHATSAPP ALERT DETAILS */}
        <div className="mb-6 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 p-4 border border-blue-100 dark:border-blue-900/50">
          <h3 className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 mb-3 flex items-center gap-1.5">
            <span>📲 Parent Contact for Automated SMS/WhatsApp Alerts</span>
          </h3>
          <div className="grid gap-4 md:grid-cols-3">
            <Input
              label="Parent / Guardian Name"
              placeholder="Ramesh Kumar"
              value={form.parent_name}
              onChange={(e) => setForm({ ...form, parent_name: e.target.value })}
            />

            <Input
              label="Parent Phone / WhatsApp Number *"
              placeholder="+91 9876543210"
              value={form.parent_phone}
              onChange={(e) => setForm({ ...form, parent_phone: e.target.value })}
            />

            <Input
              label="Parent Email Address"
              placeholder="parent@gmail.com"
              value={form.parent_email}
              onChange={(e) => setForm({ ...form, parent_email: e.target.value })}
            />
          </div>
        </div>

        {/* PHOTO UPLOAD */}
        <div>
          <label className="mb-2 block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Student Photo (Required for AI Face Recognition)
          </label>
          <label
            className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-6 transition ${
              errors.photo
                ? "border-red-400 bg-red-50 dark:bg-red-950/40"
                : "border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30"
            }`}
          >
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="Student Preview"
                className="mb-3 h-28 w-28 rounded-full border-4 border-blue-500 object-cover shadow-lg"
              />
            ) : (
              <div className="text-3xl">📷</div>
            )}

            <h3 className="mt-2 text-center text-xs font-semibold text-slate-700 dark:text-slate-300">
              {photo ? photo.name : student?.photo ? "Current Student Photo" : "Upload Student Photo"}
            </h3>
            <p className="mt-1 text-center text-[11px] text-slate-500 dark:text-slate-400">
              Click to browse or drag & drop (JPG, PNG — Max 5 MB)
            </p>

            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
          </label>
          {errors.photo && <p className="mt-2 text-xs font-medium text-red-500">{errors.photo}</p>}
        </div>

        {/* BUTTONS */}
        <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-xl border border-slate-300 dark:border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2.5 text-sm font-medium text-white shadow-lg hover:from-blue-700 hover:to-indigo-700"
          >
            {student ? "Update Student" : "Save Student"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

function Input({ label, placeholder, value, onChange, error, type = "text" }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3.5 py-2.5 text-sm outline-none transition ${
          error ? "border-red-500 focus:border-red-500" : "border-slate-300 dark:border-slate-700 focus:border-blue-600"
        }`}
      />
      {error && <p className="mt-1 text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
}

export default StudentModal;