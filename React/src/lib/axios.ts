import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://anik-api.onrender.com",
  withCredentials: true,
});

let authToken: string | null = null;

export function setAuthToken(token: string) {
  authToken = token;
  if (token) {
    instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("auth_token", token);
  } else {
    delete instance.defaults.headers.common["Authorization"];
    localStorage.removeItem("auth_token");
  }
}

export function getAuthToken(): string | null {
  const token = localStorage.getItem("auth_token");
  if (token) {
    instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    authToken = token;
  } else {
    delete instance.defaults.headers.common["Authorization"];
    authToken = null;
  }
  return authToken;
}

export function remoreToken() {
  delete instance.defaults.headers.common["Authorization"];
  localStorage.removeItem("auth_token");
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
