import { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";

import DashboardLayout from "../../layouts/DashboardLayout";
import { recognizeFace } from "../../api/attendanceApi";


// ==========================================
// TEXT TO SPEECH
// ==========================================
const speak = (text) => {
  if (!text || !("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();

  const speech = new SpeechSynthesisUtterance(text);

  speech.lang = "en-US";
  speech.rate = 1;
  speech.pitch = 1;
  speech.volume = 1;

  window.speechSynthesis.speak(speech);
};


// ==========================================
// ATTENDANCE COMPONENT
// ==========================================
function Attendance() {

  // ========================================
  // REFS
  // ========================================
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  // Prevent multiple API requests at same time
  const detectingRef = useRef(false);

  // Timeout reference
  const resultTimeoutRef = useRef(null);


  // ========================================
  // STATES
  // ========================================
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [detecting, setDetecting] = useState(false);

  const [studentData, setStudentData] = useState(null);

  const [result, setResult] = useState("");

  const [scanning, setScanning] = useState(false);

  const [cameraReady, setCameraReady] = useState(false);

  const [loading, setLoading] = useState(false);


  // ========================================
  // LOAD FACE API MODELS
  // ========================================
  const loadModels = async () => {
    try {
      const MODEL_URL = "/models";

      console.log("=================================");
      console.log("Loading Face API Models...");
      console.log("MODEL URL:", MODEL_URL);
      console.log("=================================");

      console.log("1. Loading Tiny Face Detector...");

      await faceapi.nets.tinyFaceDetector.loadFromUri(
        MODEL_URL
      );

      console.log("✓ Tiny Face Detector Loaded");


      console.log("2. Loading Face Landmark 68...");

      await faceapi.nets.faceLandmark68Net.loadFromUri(
        MODEL_URL
      );

      console.log("✓ Face Landmark 68 Loaded");


      console.log("3. Loading Face Recognition...");

      await faceapi.nets.faceRecognitionNet.loadFromUri(
        MODEL_URL
      );

      console.log("✓ Face Recognition Loaded");


      setModelsLoaded(true);

      console.log("=================================");
      console.log("✓ ALL FACE MODELS LOADED");
      console.log("=================================");

    } catch (error) {

      console.error(
        "================================="
      );

      console.error(
        "FACE MODEL LOADING ERROR"
      );

      console.error(error);

      console.error(
        "Message:",
        error?.message
      );

      console.error(
        "================================="
      );

      setModelsLoaded(false);

      setResult(
        "Face recognition models failed to load"
      );
    }
  };
  const detectFace = async () => {
    if (
      !modelsLoaded ||
      !webcamRef.current ||
      !canvasRef.current
    ) {
      return;
    }

    const video = webcamRef.current.video;

    if (!video || video.readyState !== 4) {
      return;
    }

    try {
      const detections = await faceapi
        .detectAllFaces(
          video,
          new faceapi.TinyFaceDetectorOptions()
        )
        .withFaceLandmarks()
        .withFaceDescriptors();

      const displaySize = {
        width: video.videoWidth,
        height: video.videoHeight,
      };

      faceapi.matchDimensions(
        canvasRef.current,
        displaySize
      );

      const resizedDetections =
        faceapi.resizeResults(
          detections,
          displaySize
        );

      const canvas = canvasRef.current;

      const ctx = canvas.getContext("2d");

      ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      faceapi.draw.drawDetections(
        canvas,
        resizedDetections
      );

      faceapi.draw.drawFaceLandmarks(
        canvas,
        resizedDetections
      );

      setDetecting(detections.length > 0);

    } catch (error) {
      console.error(
        "Face Detection Error:",
        error
      );
    }
  };
  useEffect(() => {
    if (!modelsLoaded) return;

    const interval = setInterval(() => {
      detectFace();
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, [modelsLoaded]);


  // ========================================
  // LOAD MODELS ON PAGE LOAD
  // ========================================
  useEffect(() => {

    loadModels();

    return () => {

      if (resultTimeoutRef.current) {
        clearTimeout(resultTimeoutRef.current);
      }

      window.speechSynthesis?.cancel();

    };

  }, []);


  // ========================================
  // CLEAR RESULT
  // ========================================
  const clearResult = (delay = 3000) => {

    if (resultTimeoutRef.current) {
      clearTimeout(resultTimeoutRef.current);
    }

    resultTimeoutRef.current = setTimeout(() => {

      setResult("");
      setStudentData(null);

    }, delay);

  };


  // ========================================
  // CAPTURE IMAGE
  // ========================================
  const capture = async () => {

    // --------------------------------------
    // Don't capture if models not loaded
    // --------------------------------------
    if (!modelsLoaded) {

      console.log(
        "Waiting for face models..."
      );

      return;

    }


    // --------------------------------------
    // Don't capture if camera unavailable
    // --------------------------------------
    if (!webcamRef.current) {

      console.log(
        "Webcam is not ready"
      );

      return;

    }


    // --------------------------------------
    // Prevent duplicate requests
    // --------------------------------------
    if (detectingRef.current) {

      console.log(
        "Previous recognition still running..."
      );

      return;

    }


    // --------------------------------------
    // Get screenshot
    // --------------------------------------
    const imageSrc =
      webcamRef.current.getScreenshot();

    if (!imageSrc) {

      console.log(
        "Screenshot not available"
      );

      return;

    }


    try {

      detectingRef.current = true;

      setLoading(true);


      console.log(
        "Capturing image..."
      );


      // ------------------------------------
      // Convert Base64 → Blob
      // ------------------------------------
      const response = await fetch(imageSrc);

      const blob = await response.blob();


      console.log(
        "Image Blob:",
        blob
      );

      console.log(
        "Blob Size:",
        blob.size
      );


      if (!blob || blob.size === 0) {

        throw new Error(
          "Captured image is empty"
        );

      }


      // ------------------------------------
      // Send image to FastAPI
      // ------------------------------------
      const res = await recognizeFace(
        blob
      );


      console.log(
        "FACE API RESPONSE:",
        res
      );


      // ------------------------------------
      // Validate response
      // ------------------------------------
      if (!res) {

        throw new Error(
          "No response received from server"
        );

      }


      if (!res.data) {

        throw new Error(
          "Server returned empty response"
        );

      }


      console.log(
        "FACE API DATA:",
        res.data
      );


      // ====================================
      // STUDENT DATA
      // ====================================
      const student =
        res.data.student;


      if (!student) {

        throw new Error(
          "Student information not found in response"
        );

      }


      setStudentData(student);


      // ====================================
      // ALREADY MARKED
      // ====================================
      if (
        res.data.message ===
        "Attendance already marked"
      ) {

        setResult(
          "Already Marked"
        );


        speak(
          `Attendance already marked for ${student.name}`
        );


        clearResult(4000);

      }


      // ====================================
      // NEW ATTENDANCE
      // ====================================
      else {

        setResult(
          "Attendance Marked"
        );


        speak(
          `Attendance marked successfully for ${student.name}`
        );


        clearResult(4000);

      }


    } catch (error) {

      console.error(
        "FACE RECOGNITION ERROR:",
        error
      );


      // ------------------------------------
      // Axios response
      // ------------------------------------
      console.error(
        "AXIOS RESPONSE:",
        error?.response
      );


      console.error(
        "AXIOS DATA:",
        error?.response?.data
      );


      // ------------------------------------
      // Backend error message
      // ------------------------------------
      const backendMessage =
        error?.response?.data?.detail;


      const message =
        backendMessage ||
        error?.message ||
        "Face not recognized";


      setStudentData(null);

      setResult(message);


      speak(message);


      clearResult(2500);


    } finally {

      detectingRef.current = false;

      setLoading(false);

    }

  };


  // ========================================
  // START / STOP SCANNING
  // ========================================
  useEffect(() => {

    if (
      !scanning ||
      !modelsLoaded ||
      !cameraReady
    ) {

      return;

    }


    console.log(
      "AI Scanning Started"
    );


    const interval =
      setInterval(() => {

        capture();

      }, 3000);


    return () => {

      clearInterval(interval);

      console.log(
        "AI Scanning Stopped"
      );

    };

  }, [
    scanning,
    modelsLoaded,
    cameraReady
  ]);


  // ========================================
  // START SCAN BUTTON
  // ========================================
  const startScanning = () => {

    if (!modelsLoaded) {

      setResult(
        "Face models are still loading..."
      );

      return;

    }


    if (!cameraReady) {

      setResult(
        "Camera is not ready"
      );

      return;

    }


    setResult("");

    setScanning(true);

  };


  // ========================================
  // STOP SCAN BUTTON
  // ========================================
  const stopScanning = () => {

    setScanning(false);

    detectingRef.current = false;

    setLoading(false);

  };


  // ========================================
  // RETURN UI
  // ========================================
  return (

    <DashboardLayout>

      <div className="space-y-6">


        {/* =================================
            HEADER
        ================================= */}

        <div className="flex items-center justify-between">

          <div>

            <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100">

              Live AI Attendance

            </h1>


            <p className="mt-2 text-slate-500 dark:text-slate-400">

              {modelsLoaded
                ? "AI Camera is ready for face recognition"
                : "Loading AI face recognition models..."}

            </p>

          </div>


          {/* ===============================
              SCAN BUTTON
          =============================== */}

          {!scanning ? (

            <button
              onClick={startScanning}
              disabled={!modelsLoaded || !cameraReady}
              className="rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400 dark:disabled:bg-slate-700"
            >

              Start Scan

            </button>

          ) : (

            <button
              onClick={stopScanning}
              className="rounded-xl bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700"
            >

              Stop Scan

            </button>

          )}

        </div>


        {/* =================================
            MODEL STATUS
        ================================= */}

        <div className="flex flex-wrap gap-3">

          <div
            className={`rounded-xl px-4 py-2 text-sm font-semibold ${modelsLoaded
              ? "bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-400"
              : "bg-yellow-100 dark:bg-yellow-950/60 text-yellow-700 dark:text-yellow-400"
              }`}
          >

            {modelsLoaded
              ? "✓ AI Models Loaded"
              : "⏳ Loading AI Models..."}

          </div>


          <div
            className={`rounded-xl px-4 py-2 text-sm font-semibold ${cameraReady
              ? "bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-400"
              : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400"
              }`}
          >

            {cameraReady
              ? "✓ Camera Ready"
              : "Camera Starting..."}

          </div>


          <div
            className={`rounded-xl px-4 py-2 text-sm font-semibold ${scanning
              ? "bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400"
              : "bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400"
              }`}
          >

            {scanning
              ? "● Scanning"
              : "● Scan Stopped"}

          </div>

        </div>


        {/* =================================
            WEBCAM
        ================================= */}

        <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl">

          <div className="relative">

            <Webcam
              ref={webcamRef}
              audio={false}
              mirrored
              screenshotFormat="image/jpeg"
              screenshotQuality={0.9}
              onUserMedia={() => {

                console.log(
                  "Camera started successfully"
                );

                setCameraReady(true);

              }}
              onUserMediaError={(error) => {

                console.error(
                  "Camera Error:",
                  error
                );

                setCameraReady(false);

                setScanning(false);

                setResult(
                  "Camera permission denied or camera unavailable"
                );

              }}
              className="w-full rounded-3xl"
            />


            {/* =============================
                SCANNING OVERLAY
            ============================= */}

            {scanning && (

              <div className="absolute left-5 top-5 rounded-xl bg-black/60 px-4 py-2 text-sm font-semibold text-white">

                {loading
                  ? "🔍 Recognizing..."
                  : "● AI Scanning"}

              </div>

            )}


            {/* =============================
                MODEL LOADING OVERLAY
            ============================= */}

            {!modelsLoaded && (

              <div className="absolute inset-0 flex items-center justify-center bg-black/50">

                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-4 text-center shadow-xl">

                  <div className="text-lg font-bold text-slate-800 dark:text-slate-100">

                    Loading AI Models

                  </div>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">

                    Please wait...

                  </p>

                </div>

              </div>

            )}


            {/* =============================
                SCAN LINE
            ============================= */}

            {scanning && modelsLoaded && (

              <div className="pointer-events-none absolute left-0 right-0 top-1/2 h-0.5 bg-blue-500 opacity-70 shadow-lg" />

            )}


            {/* =============================
                CANVAS
            ============================= */}

            <canvas
              ref={canvasRef}
              className="absolute inset-0 h-full w-full"
            />

          </div>

        </div>


        {/* =================================
            RESULT MESSAGE
        ================================= */}

        {!studentData && result && (

          <div
            className={`rounded-2xl p-6 text-center text-xl font-bold ${result.toLowerCase().includes("not recognized") ||
              result.toLowerCase().includes("error") ||
              result.toLowerCase().includes("not found")
              ? "bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400"
              : "bg-yellow-100 dark:bg-yellow-950/60 text-yellow-700 dark:text-yellow-400"
              }`}
          >

            {result}

          </div>

        )}


        {/* =================================
            STUDENT CARD
        ================================= */}

        {studentData && (

          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-xl">

            <div className="flex flex-col items-center gap-8 md:flex-row">


              {/* STUDENT PHOTO */}

              <div>

                <img
                  src={
                    studentData.photo
                      ? `${API.defaults.baseURL}/${studentData.photo}`
                      : "/icons.svg"
                  }
                  alt={studentData.name}
                  onError={(e) => {
                    e.currentTarget.src =
                      "/icons.svg";
                  }}
                  className="h-36 w-36 rounded-full border-4 border-blue-500 object-cover shadow-lg"
                />

              </div>


              {/* STUDENT INFORMATION */}

              <div className="space-y-2">

                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">

                  {studentData.name}

                </h2>


                <p className="text-slate-600 dark:text-slate-300">

                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    Roll:
                  </span>{" "}

                  {studentData.roll}

                </p>


                <p className="text-slate-600 dark:text-slate-300">

                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    Department:
                  </span>{" "}

                  {studentData.department}

                </p>


                <p className="text-slate-600 dark:text-slate-300">

                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    Year:
                  </span>{" "}

                  {studentData.year}

                </p>


                <p
                  className={`pt-3 text-xl font-bold ${result === "Attendance Marked"
                    ? "text-green-600 dark:text-green-400"
                    : "text-orange-600 dark:text-orange-400"
                    }`}
                >

                  {result}

                </p>

              </div>

            </div>

          </div>

        )}

      </div>

    </DashboardLayout>

  );

}

export default Attendance;