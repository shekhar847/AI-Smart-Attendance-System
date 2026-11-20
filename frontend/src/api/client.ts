import axios, { AxiosInstance } from "axios";

const DEFAULT_PUBLIC_BACKEND =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://removing-gore-quarters-suits.trycloudflare.com";

export const getBaseURL = (): string => {
  if (typeof window !== "undefined") {
    const isRemote =
      window.location.hostname !== "localhost" &&
      window.location.hostname !== "127.0.0.1";
    const customUrl = localStorage.getItem("backend_api_url");

    if (customUrl && customUrl.trim()) {
      const trimmed = customUrl.trim().replace(/\/+$/, "");
      // If accessing remotely (e.g. mobile on Vercel) and localhost, vercel.app or old dead tunnel is saved, purge it!
      if (
        isRemote &&
        (trimmed.includes("localhost") ||
          trimmed.includes("127.0.0.1") ||
          trimmed.includes("vercel.app") ||
          trimmed.includes("serveousercontent.com"))
      ) {
        localStorage.removeItem("backend_api_url");
        return DEFAULT_PUBLIC_BACKEND;
      }
      if (trimmed.includes("vercel.app") || trimmed.includes("serveousercontent.com")) {
        localStorage.removeItem("backend_api_url");
      } else {
        return trimmed;
      }
    }
    return isRemote ? DEFAULT_PUBLIC_BACKEND : (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000");
  }
  return DEFAULT_PUBLIC_BACKEND;
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

      const customUrl = localStorage.getItem("backend_api_url");
      if (customUrl && customUrl.trim()) {
        const trimmed = customUrl.trim().replace(/\/+$/, "");
        if (
          isRemote &&
          (trimmed.includes("localhost") ||
            trimmed.includes("127.0.0.1") ||
            trimmed.includes("vercel.app") ||
            trimmed.includes("serveousercontent.com"))
        ) {
          config.baseURL = DEFAULT_PUBLIC_BACKEND;
        } else if (!trimmed.includes("vercel.app") && !trimmed.includes("serveousercontent.com")) {
          config.baseURL = trimmed;
        }
      } else if (isRemote) {
        config.baseURL = DEFAULT_PUBLIC_BACKEND;
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
