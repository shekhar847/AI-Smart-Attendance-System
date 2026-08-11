import API from "./client";

export const loginAdmin = (data) =>
  API.post("/auth/login", data);

export const requestForgotPassword = (email) =>
  API.post("/auth/forgot-password", { email });

export const resetPassword = (email, resetToken, newPassword) =>
  API.post("/auth/reset-password", {
    email,
    reset_token: resetToken,
    new_password: newPassword,
  });