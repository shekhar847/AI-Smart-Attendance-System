import API from "./client";
import { AttendanceRecord } from "../types";

export const getAttendance = () => {
  return API.get<AttendanceRecord[]>("/attendance/");
};

export const markAttendance = (data: {
  student_id: number;
  status?: string;
  emotion_status?: string;
}) => {
  return API.post("/attendance/", data);
};

export const recognizeFace = (
  imageFile: Blob | File,
  latitude?: number | null,
  longitude?: number | null
) => {
  const formData = new FormData();
  formData.append("file", imageFile, "capture.jpg");
  if (latitude !== null && latitude !== undefined) {
    formData.append("latitude", String(latitude));
  }
  if (longitude !== null && longitude !== undefined) {
    formData.append("longitude", String(longitude));
  }

  return API.post<{
    success: boolean;
    message: string;
    student?: any;
    emotion_status?: string;
    status?: string;
  }>("/attendance/recognize", formData);
};
