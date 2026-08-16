import API from "./client";

export const getStudents = () =>
  API.get("/students/");

export const addStudent = (data) =>
  API.post("/students/", data);

export const updateStudent = (id, data) =>
  API.put(`/students/${id}`, data);

export const deleteStudent = (id) =>
  API.delete(`/students/${id}`);

export const getStudentAttendance = (id) =>
  API.get(`/students/${id}/attendance`);

export const uploadStudentPhoto = (id, file) => {
  const formData = new FormData();

  formData.append("file", file);

  return API.post(
    `/students/${id}/upload-photo`,
    formData
  );
};