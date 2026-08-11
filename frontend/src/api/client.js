import axios from "axios";

// ==========================================
// API BASE URL
// ==========================================

const defaultBaseURL =
  typeof window !== "undefined" &&
  window.location.hostname === "localhost"
    ? "http://localhost:8000"
    : "http://127.0.0.1:8000";

const baseURL =
  import.meta.env.VITE_API_BASE_URL || defaultBaseURL;

// ==========================================
// Axios Instance
// ==========================================

const API = axios.create({
  baseURL: baseURL,
  timeout: 30000,
});

// ==========================================
// Request Interceptor
// ==========================================

API.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ==========================================
// Response Interceptor
// ==========================================

API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error(
      "API Error:",
      error.response?.status,
      error.response?.data || error.message
    );

    return Promise.reject(error);
  }
);

export default API;