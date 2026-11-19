import API from "./client";
import { DashboardStats } from "../types";

export const getDashboard = () =>
  API.get<DashboardStats>("/dashboard/");
