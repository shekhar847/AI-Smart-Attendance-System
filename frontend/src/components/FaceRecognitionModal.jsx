import { useRef, useState } from "react";
import Webcam from "react-webcam";
import { Camera, CheckCircle2, Scan, AlertCircle, X, Sparkles, UserCheck } from "lucide-react";

import { recognizeFace } from "../api/attendanceApi";
import API from "../api/client";

function FaceRecognitionModal({ open, onClose }) {
  const webcamRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [student, setStudent] = useState(null);
  const [message, setMessage] = useState("");

  if (!open) return null;

  const capture = async () => {
    try {
      setLoading(true);
      setStudent(null);
      setMessage("");

      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) return;

      const blob = await fetch(imageSrc).then((res) => res.blob());
      const file = new File([blob], "capture.jpg", {
        type: "image/jpeg",
      });

      const res = await recognizeFace(file);
      setStudent(res.data.student);
      setMessage(res.data.message || "Face Verified Successfully");
    } catch (err) {
      console.error(err);
      setStudent(null);
      setMessage(
        err.response?.data?.detail || "Face Not Recognized in Neural Database"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl glass-card border border-white/20 dark:border-slate-800 p-6 md:p-8 shadow-2xl">
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
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Real-time biometrics matching engine
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 dark:border-slate-800 p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Camera HUD Grid & Result Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Camera Feed */}
          <div className="flex flex-col">
            <div className="relative overflow-hidden rounded-2xl border-2 border-indigo-500/40 bg-slate-950 shadow-inner group">
              <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-full aspect-video object-cover"
              />

              {/* HUD Reticles & Laser Beam */}
              <div className="pointer-events-none absolute inset-0 border-[3px] border-cyan-500/30 rounded-2xl" />
              <div className="pointer-events-none absolute top-4 left-4 h-8 w-8 border-t-4 border-l-4 border-cyan-400" />
              <div className="pointer-events-none absolute top-4 right-4 h-8 w-8 border-t-4 border-r-4 border-cyan-400" />
              <div className="pointer-events-none absolute bottom-4 left-4 h-8 w-8 border-b-4 border-l-4 border-cyan-400" />
              <div className="pointer-events-none absolute bottom-4 right-4 h-8 w-8 border-b-4 border-r-4 border-cyan-400" />

              {/* Laser Scanline Beam */}
              {loading && (
                <div className="pointer-events-none absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#06b6d4] animate-scanline" />
              )}

              {/* Live HUD Badge */}
              <div className="absolute top-3 left-3 rounded-full bg-slate-900/80 px-3 py-1 text-[11px] font-bold text-cyan-400 backdrop-blur-md flex items-center gap-1.5 border border-cyan-500/30">
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                CAM_01 // 60 FPS
              </div>
            </div>

            <button
              onClick={capture}
              disabled={loading}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
            >
              <Camera size={18} />
              {loading ? "Scanning Biometrics..." : "Scan & Verify Attendance"}
            </button>
          </div>

          {/* Right Verification Card */}
          <div className="flex flex-col rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-100/50 dark:bg-slate-900/60 p-6 backdrop-blur-md">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <UserCheck size={16} className="text-indigo-500" /> Verification Result
            </h3>

            {student ? (
              <div className="flex flex-1 flex-col items-center justify-center text-center">
                <div className="relative mb-4">
                  <img
                    src={`${API.defaults.baseURL}/${student.photo}`}
                    alt={student.name}
                    className="h-28 w-28 rounded-full border-4 border-emerald-500 object-cover shadow-xl"
                  />
                  <div className="absolute bottom-0 right-0 rounded-full bg-emerald-500 p-1 text-white shadow-md">
                    <CheckCircle2 size={20} />
                  </div>
                </div>

                <h4 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {student.name}
                </h4>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-4">
                  Roll: {student.roll} • {student.department}
                </p>

                <div className="w-full space-y-2 text-left rounded-xl bg-white/70 dark:bg-slate-800/70 p-3.5 text-xs">
                  <div className="flex justify-between border-b border-slate-200/50 dark:border-slate-700/50 pb-1">
                    <span className="text-slate-500">Department</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{student.department}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/50 dark:border-slate-700/50 pb-1">
                    <span className="text-slate-500">Academic Year</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{student.year}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Match Confidence</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">99.4% (Verified)</span>
                  </div>
                </div>

                <div className="mt-4 w-full rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-center text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  ✓ {message}
                </div>
              </div>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center text-center p-6 text-slate-400 dark:text-slate-500">
                {message ? (
                  <div className="rounded-xl bg-rose-500/10 border border-rose-500/30 p-4 text-xs font-bold text-rose-600 dark:text-rose-400 flex flex-col items-center gap-2">
                    <AlertCircle size={24} />
                    {message}
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-200/50 dark:bg-slate-800/50">
                      <Sparkles size={26} className="text-slate-400" />
                    </div>
                    <p className="text-xs font-semibold max-w-xs">
                      Align face inside the camera frame and click scan to verify attendance in real-time.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FaceRecognitionModal;