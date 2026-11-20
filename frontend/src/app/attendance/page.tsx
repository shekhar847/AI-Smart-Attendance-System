"use client";

import { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import ProtectedRoute from "../../components/ProtectedRoute";
import DashboardLayout from "../../layouts/DashboardLayout";
import { recognizeFace } from "../../api/attendanceApi";
import API from "../../api/client";
import { Student } from "../../types";

const speak = (text: string) => {
  if (!text || typeof window === "undefined" || !("speechSynthesis" in window))
    return;
  window.speechSynthesis.cancel();
  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = "en-US";
  speech.rate = 1;
  speech.pitch = 1;
  speech.volume = 1;
  window.speechSynthesis.speak(speech);
};

export default function AttendancePage() {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const isRecognizingRef = useRef(false);
  const detectingRef = useRef(false);
  const resultTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const faceapiRef = useRef<any>(null);

  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [studentData, setStudentData] = useState<Student | null>(null);
  const [result, setResult] = useState("");
  const [scanning, setScanning] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load models on client
  const loadModels = async () => {
    try {
      const faceapi = await import("face-api.js");
      faceapiRef.current = faceapi;
      const MODEL_URL = "/models";

      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      ]);

      setModelsLoaded(true);
    } catch (error: any) {
      console.error("Face model loading error:", error);
      setModelsLoaded(false);
      setResult("Face recognition models failed to load");
    }
  };

  const detectFace = async () => {
    if (!webcamRef.current || !canvasRef.current || !webcamRef.current.video)
      return;
    const video = webcamRef.current.video;
    if (video.readyState !== 4) return;

    try {
      const faceapi = faceapiRef.current;
      if (!faceapi) return;

      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();

      const displaySize = {
        width: video.videoWidth,
        height: video.videoHeight,
      };

      if (!canvasRef.current) return;
      faceapi.matchDimensions(canvasRef.current, displaySize);
      const resizedDetections = faceapi.resizeResults(detections, displaySize);

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      faceapi.draw.drawDetections(canvas, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

      detectingRef.current = detections.length > 0;
    } catch (error) {
      console.error("Face Detection Error:", error);
    }
  };

  useEffect(() => {
    if (!modelsLoaded) return;
    const interval = setInterval(() => {
      detectFace();
    }, 500);
    return () => clearInterval(interval);
  }, [modelsLoaded]);

  useEffect(() => {
    loadModels();
    return () => {
      if (resultTimeoutRef.current) {
        clearTimeout(resultTimeoutRef.current);
      }
      if (typeof window !== "undefined") {
        window.speechSynthesis?.cancel();
      }
    };
  }, []);

  const clearResult = (delay = 3000) => {
    if (resultTimeoutRef.current) {
      clearTimeout(resultTimeoutRef.current);
    }
    resultTimeoutRef.current = setTimeout(() => {
      setResult("");
      setStudentData(null);
    }, delay);
  };

  const capture = async () => {
    if (!modelsLoaded || !webcamRef.current) return;
    if (isRecognizingRef.current) return;
    if (!detectingRef.current) {
      console.log("No face in frame, skipping API call...");
      return;
    }

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    try {
      isRecognizingRef.current = true;
      setLoading(true);

      const response = await fetch(imageSrc);
      const blob = await response.blob();
      if (!blob || blob.size === 0) throw new Error("Captured image is empty");

      // GPS
      let lat: number | null = null;
      let lon: number | null = null;
      try {
        const position: any = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 5000,
          });
        });
        lat = position.coords.latitude;
        lon = position.coords.longitude;
      } catch (err) {
        console.warn("Geolocation skipped:", err);
      }

      const res = await recognizeFace(blob, lat, lon);

      if (!res?.data) throw new Error("Server returned empty response");

      if (res.data.success === false) {
        setStudentData(null);
        setResult(res.data.message || "Face not recognized");
        clearResult(2500);
        return;
      }

      const student = res.data.student;
      if (!student) throw new Error("Student info not found in response");

      setStudentData(student);

      if (res.data.message && res.data.message.toLowerCase().includes("already marked")) {
        setResult("Already Marked Today");
        speak(`Attendance already marked for ${student.name}`);
        clearResult(4000);
      } else {
        setResult(`Attendance Marked: ${student.name}`);
        speak(
          `Attendance marked successfully for ${student.name}.`
        );
        clearResult(4000);
      }
    } catch (error: any) {
      const msg =
        error?.response?.data?.detail || error?.message || "Face not recognized";
      setStudentData(null);
      setResult(msg);
      speak(msg);
      clearResult(2500);
    } finally {
      isRecognizingRef.current = false;
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!scanning || !modelsLoaded || !cameraReady) return;
    const interval = setInterval(() => {
      capture();
    }, 3000);
    return () => clearInterval(interval);
  }, [scanning, modelsLoaded, cameraReady]);

  const startScanning = () => {
    if (!modelsLoaded || !cameraReady) return;
    setResult("");
    setScanning(true);
  };

  const stopScanning = () => {
    setScanning(false);
    isRecognizingRef.current = false;
    detectingRef.current = false;
    setLoading(false);
  };

  return (
    <ProtectedRoute allowedRoles={["admin", "teacher"]}>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">
                Live AI Attendance
              </h1>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {modelsLoaded
                  ? "AI Telemetry is ready. Anti-spoofing neural recognition active."
                  : "Loading AI face recognition model weights..."}
              </p>
            </div>

            {!scanning ? (
              <button
                onClick={startScanning}
                disabled={!modelsLoaded || !cameraReady}
                className="rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Start AI Scan
              </button>
            ) : (
              <button
                onClick={stopScanning}
                className="rounded-xl bg-rose-600 px-6 py-3 font-bold text-white shadow-lg shadow-rose-500/25 transition hover:bg-rose-700"
              >
                Stop Scan
              </button>
            )}
          </div>

          {/* Model Status Badges */}
          <div className="flex flex-wrap gap-3">
            <div
              className={`rounded-xl px-4 py-2 text-xs font-bold ${
                modelsLoaded
                  ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20"
                  : "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-500/20"
              }`}
            >
              {modelsLoaded ? "✓ Neural Models Ready" : "⏳ Loading Weights..."}
            </div>

            <div
              className={`rounded-xl px-4 py-2 text-xs font-bold ${
                cameraReady
                  ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
              }`}
            >
              {cameraReady ? "✓ Camera Online" : "Initializing Video..."}
            </div>

            <div
              className={`rounded-xl px-4 py-2 text-xs font-bold ${
                scanning
                  ? "bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-500/20"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-500"
              }`}
            >
              {scanning ? "● Continuous Scanning" : "● Scan Standby"}
            </div>
          </div>

          {/* Webcam Box */}
          <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-black shadow-2xl relative">
            <Webcam
              ref={webcamRef}
              audio={false}
              mirrored
              screenshotFormat="image/jpeg"
              screenshotQuality={0.9}
              onUserMedia={() => setCameraReady(true)}
              onUserMediaError={() => {
                setCameraReady(false);
                setScanning(false);
                setResult("Camera permission denied or camera device unavailable");
              }}
              className="w-full aspect-video object-cover"
            />

            {scanning && (
              <div className="absolute left-5 top-5 rounded-xl bg-black/70 backdrop-blur-md px-4 py-2 text-xs font-bold text-white flex items-center gap-2 border border-white/20">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
                {loading ? "Matching Biometrics..." : "AI Scanner Running"}
              </div>
            )}

            {!modelsLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                <div className="rounded-2xl glass-card border border-white/20 p-6 text-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent mx-auto mb-3" />
                  <p className="text-base font-bold text-white">Loading Neural Weights</p>
                  <p className="text-xs text-slate-400 mt-1">Downloading tinyFace & landmarks</p>
                </div>
              </div>
            )}

            <canvas ref={canvasRef} className="absolute inset-0 h-full w-full pointer-events-none" />
          </div>

          {/* Result Alert */}
          {!studentData && result && (
            <div
              className={`rounded-2xl p-6 text-center text-lg font-bold shadow-lg ${
                result.toLowerCase().includes("not recognized") ||
                result.toLowerCase().includes("error") ||
                result.toLowerCase().includes("failed")
                  ? "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-500/20"
                  : "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-500/20"
              }`}
            >
              {result}
            </div>
          )}

          {/* Recognized Student Card */}
          {studentData && (
            <div className="rounded-3xl glass-card border border-white/40 dark:border-slate-800 p-8 shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                {studentData.photo ? (
                  <img
                    src={`${API.defaults.baseURL}/${studentData.photo}`}
                    alt={studentData.name}
                    className="h-32 w-32 rounded-3xl border-4 border-emerald-500 object-cover shadow-xl"
                  />
                ) : (
                  <div className="h-32 w-32 rounded-3xl bg-emerald-600 text-white font-extrabold text-4xl flex items-center justify-center shadow-xl">
                    {studentData.name.charAt(0).toUpperCase()}
                  </div>
                )}

                <div className="space-y-1.5 text-center sm:text-left">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    ✓ Verified Biometric Match
                  </div>
                  <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                    {studentData.name}
                  </h2>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                    Roll No: <span className="font-mono text-slate-900 dark:text-white">{studentData.roll}</span> • Dept: <span className="text-slate-900 dark:text-white">{studentData.department}</span> • Year: <span className="text-slate-900 dark:text-white">{studentData.year}</span>
                  </p>
                  <p className="pt-2 text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                    {result}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
