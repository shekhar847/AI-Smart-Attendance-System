import API from "./client";

export const getSummary = () =>
  API.get("/reports/summary");

export const getDailyReport = () =>
  API.get("/reports/daily");

export const getDateRangeReport = (fromDate, toDate) =>
  API.get("/reports/date-range", {
    params: {
      from_date: fromDate,
      to_date: toDate,
    },
  });

export const getMonthlyReport = () =>
  API.get("/reports/monthly");

export const getBestStudent = () =>
  API.get("/reports/best-student");