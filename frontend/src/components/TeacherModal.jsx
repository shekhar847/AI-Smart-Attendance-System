import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import * as faceapi from "face-api.js";
import API from "../api/client";

function TeacherModal({ open, onClose, onSave, teacher }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    employee_id: "",
    department: "",
    designation: "",
    password: "",
  });

  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isDetectingFace, setIsDetectingFace] = useState(false);
  const [faceapiLoaded, setFaceapiLoaded] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
        setFaceapiLoaded(true);
      } catch (err) {
        console.error("Error loading faceapi models in modal:", err);
      }
    };
    if (open && !faceapiLoaded) {
      loadModels();
    }
  }, [open, faceapiLoaded]);

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
      
      setPhoto(null);
      if (teacher.photo) {
        setPhotoPreview(`${API.defaults.baseURL}/${teacher.photo}`);
      } else {
        setPhotoPreview(null);
      }
    } else {
      setForm({
        name: "",
        email: "",
        employee_id: "",
        department: "",
        designation: "",
        password: "",
      });
      setPhoto(null);
      setPhotoPreview(null);
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

  const handlePhotoChange = async (e) => {
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

    if (faceapiLoaded) {
      setIsDetectingFace(true);
      try {
        const previewUrl = URL.createObjectURL(file);
        const img = new Image();
        img.src = previewUrl;
        
        await new Promise((resolve) => {
          img.onload = resolve;
        });

        const detections = await faceapi.detectAllFaces(
          img,
          new faceapi.TinyFaceDetectorOptions()
        );

        if (detections.length === 0) {
          setErrors((prev) => ({
            ...prev,
            photo: "Invalid photo: No face detected. Please upload a clear face photo.",
          }));
          setIsDetectingFace(false);
          setPhoto(null);
          setPhotoPreview(null);
          return;
        }

        if (detections.length > 1) {
          setErrors((prev) => ({
            ...prev,
            photo: "Multiple faces detected. Please upload a solo passport-size photo.",
          }));
          setIsDetectingFace(false);
          setPhoto(null);
          setPhotoPreview(null);
          return;
        }

        setPhoto(file);
        setPhotoPreview(previewUrl);
        setErrors((prev) => ({ ...prev, photo: "" }));
      } catch (err) {
        console.error("Face detection failed:", err);
        // Fallback
        setPhoto(file);
        setPhotoPreview(URL.createObjectURL(file));
        setErrors((prev) => ({ ...prev, photo: "" }));
      } finally {
        setIsDetectingFace(false);
      }
    } else {
      setPhoto(file);
      const previewUrl = URL.createObjectURL(file);
      setPhotoPreview(previewUrl);
      setErrors((prev) => ({
        ...prev,
        photo: "",
      }));
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
    // if (!teacher && !photo) newErrors.photo = "Teacher photo is required"; // Optional or required? Let's make it optional for now, or match student
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave({
        ...form,
        id: teacher?.id,
        photo: photo
      });
    }
  };

  const handleClose = () => {
    setErrors({});
    setPhoto(null);
    setPhotoPreview(null);
    onClose();
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
            onClick={handleClose}
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

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Teacher Photo
              </label>
              <label
                className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-6 transition ${
                  errors.photo
                    ? "border-red-400 bg-red-50 dark:bg-red-950/40"
                    : "border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                }`}
              >
                {isDetectingFace ? (
                  <div className="flex flex-col items-center justify-center h-28 w-28 text-blue-500 mb-3">
                    <svg className="animate-spin h-8 w-8 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-xs font-semibold">Scanning...</span>
                  </div>
                ) : photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Teacher Preview"
                    className="mb-3 h-28 w-28 rounded-full border-4 border-blue-500 object-cover shadow-lg"
                  />
                ) : (
                  <div className="text-3xl">📷</div>
                )}

                <h3 className="mt-2 text-center text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {photo ? photo.name : teacher?.photo ? "Current Photo" : "Upload Photo"}
                </h3>
                <p className="mt-1 text-center text-[11px] text-slate-500 dark:text-slate-400">
                  Click to browse or drag & drop (JPG, PNG — Max 5 MB)
                </p>

                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
              </label>
              {errors.photo && <p className="mt-2 text-xs font-medium text-red-500">{errors.photo}</p>}
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 bg-slate-50 dark:bg-slate-800/30">
          <button
            type="button"
            onClick={handleClose}
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
