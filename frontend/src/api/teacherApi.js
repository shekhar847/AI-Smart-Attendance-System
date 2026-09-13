import API from "./client";

export const getTeachers = () => API.get("/teachers/");
export const addTeacher = (data) => API.post("/teachers/", data);
export const updateTeacher = (id, data) =>
  API.put(`/teachers/${id}`, data);
export const deleteTeacher = (id) =>
  API.delete(`/teachers/${id}`);

export const uploadTeacherPhoto = (id, file) => {
  const formData = new FormData();
  formData.append("file", file);
  return API.post(`/teachers/${id}/upload-photo`, formData);
};