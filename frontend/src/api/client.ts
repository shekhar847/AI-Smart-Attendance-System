import axios, { AxiosInstance } from "axios";

export const getBaseURL = (): string => {
  const defaultPublicUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://f4775e4a32b0dff5-152-59-86-176.serveousercontent.com";

  if (typeof window !== "undefined") {
    const isRemote =
      window.location.hostname !== "localhost" &&
      window.location.hostname !== "127.0.0.1";
    const customUrl = localStorage.getItem("backend_api_url");

    if (customUrl && customUrl.trim()) {
      const trimmed = customUrl.trim().replace(/\/+$/, "");
      // If accessing remotely (e.g. mobile on Vercel) and localhost or vercel.app is saved, purge it!
      if (isRemote && (trimmed.includes("localhost") || trimmed.includes("vercel.app"))) {
        localStorage.removeItem("backend_api_url");
        return defaultPublicUrl;
      }
      if (trimmed.includes("vercel.app")) {
        localStorage.removeItem("backend_api_url");
      } else {
        return trimmed;
      }
    }
    return isRemote
      ? defaultPublicUrl
      : process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
  }
  return defaultPublicUrl;
};

const API: AxiosInstance = axios.create({
  baseURL: getBaseURL(),
  timeout: 30000,
});

API.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const isRemote =
        window.location.hostname !== "localhost" &&
        window.location.hostname !== "127.0.0.1";
      const defaultPublicUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL ||
        "https://f4775e4a32b0dff5-152-59-86-176.serveousercontent.com";

      const customUrl = localStorage.getItem("backend_api_url");
      if (customUrl && customUrl.trim()) {
        const trimmed = customUrl.trim().replace(/\/+$/, "");
        if (isRemote && (trimmed.includes("localhost") || trimmed.includes("vercel.app"))) {
          config.baseURL = defaultPublicUrl;
        } else if (!trimmed.includes("vercel.app")) {
          config.baseURL = trimmed;
        }
      } else if (isRemote) {
        config.baseURL = defaultPublicUrl;
      }

      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("access_token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined") {
      console.error(
        "API Error:",
        error.response?.status,
        error.response?.data || error.message
      );
    }
    return Promise.reject(error);
  }
);

export default API;
