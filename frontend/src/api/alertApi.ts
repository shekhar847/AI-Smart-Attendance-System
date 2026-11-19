import API from "./client";
import { AlertSettingsData } from "../types";

export const getAlertSettings = () =>
  API.get<AlertSettingsData>("/alerts/settings");

export const updateAlertSettings = (data: Partial<AlertSettingsData>) =>
  API.put("/alerts/settings", data);

export const triggerAlertsNow = () =>
  API.post("/alerts/trigger-now");

export const testSendAlert = (data: {
  phone: string;
  channel: string;
  message?: string;
}) => API.post("/alerts/test", data);

export const getAlertLogs = (studentId: number | string | null = null) =>
  API.get("/alerts/logs", { params: studentId ? { student_id: studentId } : {} });
