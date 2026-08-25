import API from "./client";

export const loginAdmin = (data) =>
  API.post("/auth/login", data);

export const loginTeacher = (identifier, password) =>
  API.post("/auth/teacher-login", { identifier, password });

export const loginStudent = (identifier, password) =>
  API.post("/auth/student-login", { identifier, password });

export const requestForgotPassword = (email) =>
  API.post("/auth/forgot-password", { email });

export const resetPassword = (email, resetToken, newPassword) =>
  API.post("/auth/reset-password", {
    email,
    reset_token: resetToken,
    new_password: newPassword,
  });