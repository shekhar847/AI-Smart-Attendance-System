import API from "./client";

export const getAlertSettings = () =>
  API.get("/alerts/settings");

export const updateAlertSettings = (data) =>
  API.put("/alerts/settings", data);

export const triggerAlertsNow = () =>
  API.post("/alerts/trigger-now");

export const testSendAlert = (data) =>
  API.post("/alerts/test", data);

export const getAlertLogs = (studentId = null) =>
  API.get("/alerts/logs", { params: studentId ? { student_id: studentId } : {} });
