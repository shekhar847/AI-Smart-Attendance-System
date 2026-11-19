"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { X, ChevronDown, Camera, Upload, CheckCircle2, AlertCircle } from "lucide-react";
import API from "../api/client";
import { Student } from "../types";

const PREDEFINED_DEPTS = ["MCA", "B.Tech", "BCA", "MBA", "BBA"];

interface CustomSelectProps {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (val: string) => void;
  error?: string;
  placeholder?: string;
}

const CustomSelect = ({
  label,
  value,
  options,
  onChange,
  error,
  placeholder,
}: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
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
          error
            ? "border-red-500"
            : isOpen
            ? "border-blue-600 ring-1 ring-blue-600"
            : "border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600"
        }`}
      >
        <span className={value ? "truncate" : "text-slate-400 truncate"}>
          {value || placeholder}
        </span>
        <ChevronDown
          size={18}
          className={`text-slate-400 flex-shrink-0 transition-transform duration-200 ${
            isOpen ? "-rotate-180" : ""
          }`}
        />
      </div>
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg max-h-60 overflow-auto">
          {options.map((opt, i) => (
            <div
              key={i}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={`px-4 py-2.5 text-sm cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 ${
                value === opt.value
                  ? "bg-blue-50 dark:bg-slate-700 text-blue-600 font-medium"
                  : ""
              }`}
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

interface StudentModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<Partial<Student>, "photo"> & { photo?: File; password?: string }) => void;
  student: Student | null;
}

export default function StudentModal({
  open,
  onClose,
  onSave,
  student,
}: StudentModalProps) {
  const [mounted, setMounted] = useState(false);
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

  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isOtherDept, setIsOtherDept] = useState(false);
  const [customDept, setCustomDept] = useState("");
  const [isDetectingFace, setIsDetectingFace] = useState(false);
  const [faceDetectionStatus, setFaceDetectionStatus] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
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
      if (student.department && !PREDEFINED_DEPTS.includes(student.department)) {
        setIsOtherDept(true);
        setCustomDept(student.department);
      } else {
        setIsOtherDept(false);
        setCustomDept("");
      }
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
    setFaceDetectionStatus(null);
  }, [open, student]);

  if (!open || !mounted) return null;

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhoto(file);
    const url = URL.createObjectURL(file);
    setPhotoPreview(url);

    // Run client-side face verification check
    try {
      setIsDetectingFace(true);
      const faceapi = await import("face-api.js");
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      const img = await faceapi.bufferToImage(file);
      const detection = await faceapi.detectSingleFace(
        img,
        new faceapi.TinyFaceDetectorOptions()
      );

      if (detection) {
        setFaceDetectionStatus("Face detected and verified!");
      } else {
        setFaceDetectionStatus("Warning: No clear human face detected in this photo.");
      }
    } catch (err) {
      console.warn("Face detection preview check skipped:", err);
      setFaceDetectionStatus("Photo selected.");
    } finally {
      setIsDetectingFace(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.roll.trim()) newErrors.roll = "Student ID / Roll number is required";

    const finalDept = isOtherDept ? customDept.trim() : form.department;
    if (!finalDept) newErrors.department = "Department is required";
    if (!form.year.trim()) newErrors.year = "Year / Semester is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      ...form,
      department: finalDept,
      ...(photo ? { photo } : {}),
    });
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="my-auto max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white dark:bg-[#0e1422] border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/60 dark:border-slate-800/60">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {student ? "Edit Student Enrollment" : "Enroll New Student"}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Biometric Facial Identification & Academic Records
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Photo & Biometrics Section */}
          <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50">
            <div className="relative h-24 w-24 shrink-0 rounded-2xl border-2 border-dashed border-blue-500 bg-white dark:bg-slate-900 overflow-hidden flex items-center justify-center shadow-inner">
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <Camera size={32} className="text-slate-400" />
              )}
            </div>

            <div className="flex-1 space-y-2 text-center sm:text-left">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#c8f135] px-4 py-2 text-xs font-bold text-slate-950 shadow-md shadow-[#c8f135]/25 hover:bg-[#b5e028] transition">
                <Upload size={14} />
                <span>Upload Face Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Frontal face view with good lighting is recommended for 99%+ recognition accuracy.
              </p>
              {isDetectingFace && (
                <p className="text-xs text-cyan-600 font-semibold animate-pulse">
                  Scanning face features...
                </p>
              )}
              {faceDetectionStatus && (
                <p
                  className={`text-xs font-semibold ${
                    faceDetectionStatus.includes("Warning")
                      ? "text-amber-500"
                      : "text-emerald-500"
                  }`}
                >
                  {faceDetectionStatus}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Full Name *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-blue-600"
              />
              {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Student ID / Roll No. *
              </label>
              <input
                type="text"
                value={form.roll}
                onChange={(e) => setForm({ ...form, roll: e.target.value })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-blue-600 font-mono"
              />
              {errors.roll && <p className="mt-1 text-xs text-rose-500">{errors.roll}</p>}
            </div>

            <div>
              <CustomSelect
                label="Department *"
                value={isOtherDept ? "Other" : form.department}
                options={[
                  ...PREDEFINED_DEPTS.map((d) => ({ label: d, value: d })),
                  { label: "Other", value: "Other" },
                ]}
                onChange={(val) => {
                  if (val === "Other") {
                    setIsOtherDept(true);
                  } else {
                    setIsOtherDept(false);
                    setForm({ ...form, department: val });
                  }
                }}
                placeholder="Select Department"
                error={errors.department}
              />
              {isOtherDept && (
                <input
                  type="text"
                  value={customDept}
                  onChange={(e) => setCustomDept(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-blue-600"
                />
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Year / Semester *
              </label>
              <input
                type="text"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-blue-600"
              />
              {errors.year && <p className="mt-1 text-xs text-rose-500">{errors.year}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Student Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Parent / Guardian Phone
              </label>
              <input
                type="tel"
                value={form.parent_phone}
                onChange={(e) => setForm({ ...form, parent_phone: e.target.value })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Parent Name
              </label>
              <input
                type="text"
                value={form.parent_name}
                onChange={(e) => setForm({ ...form, parent_name: e.target.value })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Account Password
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200/60 dark:border-slate-800/60">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 dark:border-slate-700 px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-[#c8f135] px-6 py-2.5 text-sm font-bold text-slate-950 shadow-lg shadow-[#c8f135]/25 transition hover:bg-[#b5e028] active:scale-95"
            >
              {student ? "Update Student" : "Complete Registration"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
