import API from "./client";

export const changePassword = (data: {
  email: string;
  current_password?: string;
  new_password?: string;
  [key: string]: any;
}) => API.put("/admin/change-password", data);
