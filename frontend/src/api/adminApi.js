import API from "./client";

export const changePassword = (data) =>
  API.put("/admin/change-password", data);