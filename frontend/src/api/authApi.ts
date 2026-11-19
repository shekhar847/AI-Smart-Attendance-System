import API from "./client";

export const loginAdmin = (data: { email: string; password: string }) =>
  API.post("/auth/login", data);

export const loginTeacher = (identifier: string, password: string) =>
  API.post("/auth/teacher-login", { identifier, password });

export const loginStudent = (identifier: string, password: string) =>
  API.post("/auth/student-login", { identifier, password });

export const requestForgotPassword = (email: string) =>
  API.post("/auth/forgot-password", { email });

export const resetPassword = (
  email: string,
  resetToken: string,
  newPassword: string
) =>
  API.post("/auth/reset-password", {
    email,
    reset_token: resetToken,
    new_password: newPassword,
  });
