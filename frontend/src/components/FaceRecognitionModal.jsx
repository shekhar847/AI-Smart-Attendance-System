import { useRef, useState } from "react";
import Webcam from "react-webcam";

import { recognizeFace } from "../api/attendanceApi";

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

      const blob = await fetch(imageSrc).then((res) => res.blob());

      const file = new File(
        [blob],
        "capture.jpg",
        {
          type: "image/jpeg",
        }
      );

      const res = await recognizeFace(file);

      setStudent(res.data.student);

      setMessage(res.data.message);

    } catch (err) {
      console.error(err);

      setStudent(null);

      setMessage(
        err.response?.data?.detail ||
          "Face Not Recognized"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">

      <div className="w-full max-w-3xl rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-2xl text-slate-800 dark:text-slate-100">

        <div className="mb-6 flex items-center justify-between">

          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            AI Face Recognition
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 px-4 py-2"
          >
            Close
          </button>

        </div>

        <div className="grid grid-cols-2 gap-8">

          <div>

            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="rounded-2xl"
            />

            <button
              onClick={capture}
              disabled={loading}
              className="mt-5 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 transition"
            >
              {loading
                ? "Recognizing..."
                : "Capture & Recognize"}
            </button>

          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-6">

            <h3 className="mb-4 text-xl font-bold text-slate-900 dark:text-slate-100">
              Recognition Result
            </h3>

            {student ? (
              <>

                <img
                  src={`http://127.0.0.1:8000/${student.photo}`}
                  alt=""
                  className="mx-auto mb-4 h-40 w-40 rounded-full object-cover"
                />

                <p className="text-slate-700 dark:text-slate-300">
                  <b className="text-slate-900 dark:text-slate-100">Name :</b> {student.name}
                </p>

                <p className="text-slate-700 dark:text-slate-300">
                  <b className="text-slate-900 dark:text-slate-100">Roll :</b> {student.roll}
                </p>

                <p className="text-slate-700 dark:text-slate-300">
                  <b className="text-slate-900 dark:text-slate-100">Department :</b> {student.department}
                </p>

                <p className="text-slate-700 dark:text-slate-300">
                  <b className="text-slate-900 dark:text-slate-100">Year :</b> {student.year}
                </p>

                <div className="mt-5 rounded-xl bg-green-100 dark:bg-green-950/60 p-3 text-center font-semibold text-green-700 dark:text-green-400">
                  {message}
                </div>

              </>
            ) : (

              <div className="flex h-full items-center justify-center text-center text-slate-500 dark:text-slate-400">
                {message || "Capture image to recognize student"}
              </div>

            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default FaceRecognitionModal;