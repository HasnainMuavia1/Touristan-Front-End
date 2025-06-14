import axios from "axios";

// Create an axios instance with default config
const api = axios.create({
  baseURL: "http://localhost:8000/api", // Replace with your actual API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the auth token in all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
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
