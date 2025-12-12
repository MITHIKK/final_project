import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "https://final-project-1-1iyh.onrender.com";
const API = axios.create({
    baseURL: `${BASE}/api`,
});

// Add token to every request
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default API;
