"use client";

import { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import { createPortal } from "react-dom";
import { Scan, X, CheckCircle2, AlertCircle } from "lucide-react";
import { recognizeFace } from "../api/attendanceApi";
import API from "../api/client";
import { Student } from "../types";

interface FaceRecognitionModalProps {
  open: boolean;
  onClose: () => void;
}

export default function FaceRecognitionModal({
  open,
  onClose,
}: FaceRecognitionModalProps) {
  const webcamRef = useRef<Webcam>(null);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [student, setStudent] = useState<Student | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!open || !mounted) return null;

  const capture = async () => {
    try {
      setLoading(true);
      setStudent(null);
      setMessage("");

      const imageSrc = webcamRef.current?.getScreenshot();
      if (!imageSrc) return;

      const blob = await fetch(imageSrc).then((res) => res.blob());
      const file = new File([blob], "capture.jpg", {
        type: "image/jpeg",
      });

      const res = await recognizeFace(file);
      setStudent(res.data.student);
      setMessage(res.data.message || "Face Verified Successfully");
    } catch (err: any) {
      console.error(err);
      setStudent(null);
      setMessage(
        err.response?.data?.detail || "Face Not Recognized in Neural Database"
      );
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl glass-card border border-white/20 dark:border-slate-800 p-6 md:p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30">
              <Scan size={22} className="animate-pulse" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                Neural AI Face Scanner
                <span className="rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-xs font-bold text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                  v2.4 Active
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Deep Biometric Feature Verification & Recognition
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={20} />
          </button>
        </div>

        {/* Camera & Result Body */}
        <div className="grid gap-6 md:grid-cols-2 items-center">
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-black aspect-video flex items-center justify-center">
            <Webcam
              ref={webcamRef}
              audio={false}
              mirrored
              screenshotFormat="image/jpeg"
              className="h-full w-full object-cover"
            />
            {loading && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center text-white gap-2">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent" />
                <span className="text-xs font-bold uppercase tracking-wider">Matching Embeddings...</span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {student ? (
              <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center sm:text-left flex items-center gap-4">
                {student.photo ? (
                  <img
                    src={`${API.defaults.baseURL}/${student.photo}`}
                    alt={student.name}
                    className="h-16 w-16 rounded-2xl object-cover border-2 border-emerald-500"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-2xl bg-emerald-600 text-white font-bold text-2xl flex items-center justify-center">
                    {student.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                    <CheckCircle2 size={16} /> Identity Verified
                  </div>
                  <h4 className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
                    {student.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    ID: {student.roll} • {student.department}
                  </p>
                </div>
              </div>
            ) : message ? (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-3 text-rose-600 dark:text-rose-400 text-sm font-semibold">
                <AlertCircle size={20} className="shrink-0" />
                <span>{message}</span>
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 text-center">
                <Scan size={36} className="mx-auto text-slate-400 mb-2" />
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  Ready to Capture
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Look directly into the camera and press scan
                </p>
              </div>
            )}

            <button
              onClick={capture}
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 py-3.5 font-bold text-white shadow-lg shadow-indigo-500/25 transition hover:scale-[1.01] active:scale-95 disabled:opacity-50"
            >
              {loading ? "Analyzing Frame..." : "Capture & Verify Face"}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
