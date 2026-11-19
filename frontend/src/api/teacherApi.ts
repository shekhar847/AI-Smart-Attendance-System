import API from "./client";
import { Teacher } from "../types";

export const getTeachers = () =>
  API.get<Teacher[]>("/teachers/");

export const addTeacher = (data: Partial<Teacher> & { password?: string }) =>
  API.post("/teachers/", data);

export const updateTeacher = (id: number | string, data: Partial<Teacher>) =>
  API.put(`/teachers/${id}`, data);

export const deleteTeacher = (id: number | string) =>
  API.delete(`/teachers/${id}`);

export const uploadTeacherPhoto = (id: number | string, file: File | Blob) => {
  const formData = new FormData();
  formData.append("file", file);
  return API.post(`/teachers/${id}/upload-photo`, formData);
};
