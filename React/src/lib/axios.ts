import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://anik-api.onrender.com",
  withCredentials: true,
});

let authToken: string | null = null;

export function setAuthToken(token: string) {
  authToken = token;
}

instance.interceptors.request.use(
  (config) => {
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
