import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { X, ChevronDown } from "lucide-react";
import * as faceapi from "face-api.js";
import API from "../api/client";

const PREDEFINED_DEPTS = ["MCA", "B.Tech", "BCA", "MBA", "BBA"];

const CustomSelect = ({ label, value, options, onChange, error, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative" ref={selectRef}>
      <label className="mb-2 block text-xs font-semibold text-slate-700 dark:text-slate-300">
        {label}
      </label>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full cursor-pointer rounded-xl border bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 px-4 py-2.5 text-sm outline-none transition flex justify-between items-center ${
          error ? "border-red-500" : isOpen ? "border-blue-600 ring-1 ring-blue-600" : "border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600"
        }`}
      >
        <span className={value ? "truncate" : "text-slate-400 truncate"}>{value || placeholder}</span>
        <ChevronDown size={18} className={`text-slate-400 flex-shrink-0 transition-transform duration-200 ${isOpen ? "-rotate-180" : ""}`} />
      </div>
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg max-h-60 overflow-auto">
          {options.map((opt, i) => (
            <div 
              key={i} 
              onClick={() => { onChange(opt.value); setIsOpen(false); }}
              className={`px-4 py-2.5 text-sm cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 ${value === opt.value ? "bg-blue-50 dark:bg-slate-700 text-blue-600 font-medium" : ""}`}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

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
  const [isOtherDept, setIsOtherDept] = useState(false);
  const [customDept, setCustomDept] = useState("");
  const [appendPhoto, setAppendPhoto] = useState(true);
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
    if (!open) {
      return;
    }

    if (student) {
      const dept = student.department || "";
      const isCustom = dept && !PREDEFINED_DEPTS.includes(dept);
      setIsOtherDept(isCustom);
      setCustomDept(isCustom ? dept : "");

      setForm({
        name: student.name || "",
        roll: student.roll || "",
        department: isCustom ? "Other" : dept,
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

      setIsOtherDept(false);
      setCustomDept("");
      setPhoto(null);
      setPhotoPreview(null);
    }

    setErrors({});
  }, [student, open]);

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
          new faceapi.TinyFaceDetectorOptions({ inputSize: 608, scoreThreshold: 0.3 })
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

  const handleSave = () => {
    const newErrors = {};

    const finalDept = form.department === "Other" ? customDept : form.department;

    if (!form.name.trim()) newErrors.name = "Full Name is required";
    if (!form.roll.trim()) newErrors.roll = "Student ID is required";
    if (!finalDept.trim()) newErrors.department = "Department is required";
    if (!form.year.trim()) newErrors.year = "Semester is required";
    if (!student && !photo) newErrors.photo = "Student photo is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    onSave({
      ...form,
      department: finalDept,
      id: student?.id,
      photo: photo,
      appendPhoto,
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
              placeholder=""
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              error={errors.name}
            />

            <Input
              label="Student ID *"
              placeholder=""
              value={form.roll}
              onChange={(e) => setForm({ ...form, roll: e.target.value })}
              error={errors.roll}
            />

            <div>
              <CustomSelect
                label="Department *"
                placeholder="Select Department"
                value={form.department}
                onChange={(val) => {
                  setForm({ ...form, department: val, year: "" }); // Reset semester on dept change
                  setIsOtherDept(val === "Other");
                  if (val !== "Other") setCustomDept("");
                }}
                error={errors.department}
                options={[
                  ...PREDEFINED_DEPTS.map(d => ({ label: d, value: d })),
                  { label: "Other (Add Custom)", value: "Other" }
                ]}
              />
              {isOtherDept && (
                <input
                  type="text"
                  placeholder="Enter Course/Department Name"
                  value={customDept}
                  onChange={(e) => setCustomDept(e.target.value)}
                  className="mt-3 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-600 dark:text-slate-100"
                />
              )}
              {errors.department && <p className="mt-1 text-xs text-red-500">{errors.department}</p>}
            </div>

            <div>
              <CustomSelect
                label="Semester *"
                placeholder="Select Semester"
                value={form.year}
                onChange={(val) => setForm({ ...form, year: val })}
                error={errors.year}
                options={Array.from({ length: 
                  form.department === "MCA" || form.department === "MBA" ? 4 :
                  form.department === "BCA" || form.department === "BBA" ? 6 : 
                  8 // Default or B.Tech
                }, (_, i) => ({ label: `Semester ${i + 1}`, value: `Semester ${i + 1}` }))}
              />
            </div>

            <Input
              label="Student Email"
              placeholder=""
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              error={errors.email}
            />

            <Input
              label="Roll Number"
              placeholder=""
              type="text"
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
              placeholder=""
              value={form.parent_name}
              onChange={(e) => setForm({ ...form, parent_name: e.target.value })}
            />

            <Input
              label="Parent Phone / WhatsApp Number *"
              placeholder=""
              value={form.parent_phone}
              onChange={(e) => setForm({ ...form, parent_phone: e.target.value })}
            />

            <Input
              label="Parent Email Address"
              placeholder=""
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
          {student && student.photo && photo && (
            <div className="mt-3 flex items-center gap-2">
              <input
                type="checkbox"
                id="appendPhoto"
                checked={appendPhoto}
                onChange={(e) => setAppendPhoto(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="appendPhoto" className="text-sm text-slate-700 dark:text-slate-300">
                Keep previous face profile (Append new photo instead of replacing)
              </label>
            </div>
          )}
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