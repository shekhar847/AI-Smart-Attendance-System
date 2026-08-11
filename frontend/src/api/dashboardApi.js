import API from "./client";

export const getDashboard = () =>
  API.get("/dashboard/");