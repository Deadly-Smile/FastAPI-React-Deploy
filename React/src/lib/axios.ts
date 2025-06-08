import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.REACT_APP_API_URL || "http://localhost:8000",
  withCredentials: true,
});

console.log(import.meta.env.REACT_APP_API_URL);
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
