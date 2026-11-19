import API from "./client";
import { Student } from "../types";

export const getStudents = () =>
  API.get<Student[]>("/students/");

export const addStudent = (data: Partial<Student> & { password?: string }) =>
  API.post("/students/", data);

export const updateStudent = (id: number | string, data: Partial<Student>) =>
  API.put(`/students/${id}`, data);

export const deleteStudent = (id: number | string) =>
  API.delete(`/students/${id}`);

export const getStudentAttendance = (id: number | string) =>
  API.get(`/students/${id}/attendance`);

export const uploadStudentPhoto = (id: number | string, file: File | Blob) => {
  const formData = new FormData();
  formData.append("file", file);
  return API.post(`/students/${id}/upload-photo`, formData);
};

export const uploadStudentsBulk = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return API.post("/students/bulk-upload", formData);
};
