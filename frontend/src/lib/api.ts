import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api", // Your original baseURL
});

// Interceptor to add the auth token to every request
api.interceptors.request.use(
  (config) => {
    // Check if window is defined to safely access localStorage in Next.js (client-side only)
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
