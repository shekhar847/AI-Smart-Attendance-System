import API from "./client";

// ==========================================
// Get All Attendance
// ==========================================

export const getAttendance = () => {
  return API.get("/attendance/");
};

// ==========================================
// Manual Attendance
// ==========================================

export const markAttendance = (data) => {
  return API.post("/attendance/", data);
};

// ==========================================
// AI Face Recognition
// ==========================================

export const recognizeFace = (imageFile) => {
  const formData = new FormData();

  formData.append("file", imageFile, "capture.jpg");

  console.log("Sending face image...");
  console.log("Image size:", imageFile?.size);

  return API.post(
    "/attendance/recognize",
    formData
  );
};