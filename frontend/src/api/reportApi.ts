import API from "./client";
import { ReportSummary, DailyReportItem, MonthlyReportItem, Student } from "../types";

export const getSummary = () =>
  API.get<ReportSummary>("/reports/summary");

export const getDailyReport = () =>
  API.get<DailyReportItem[]>("/reports/daily");

export const getDateRangeReport = (fromDate: string, toDate: string) =>
  API.get("/reports/date-range", {
    params: {
      from_date: fromDate,
      to_date: toDate,
    },
  });

export const getMonthlyReport = () =>
  API.get<MonthlyReportItem[]>("/reports/monthly");

export const getBestStudent = () =>
  API.get<Student | null>("/reports/best-student");
