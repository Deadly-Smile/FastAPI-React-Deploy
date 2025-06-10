import axios, { getAuthToken, remoreToken } from "../../lib/axios";
import { setAuthToken } from "../../lib/axios";

export async function loginUser(data: { username: string; password: string }) {
  const params = new URLSearchParams();
  params.append("username", data.username);
  params.append("password", data.password);

  const res = await axios.post("/token", params, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  const token = res.data.access_token;
  setAuthToken(token);

  return res.data;
}

export async function registerUser(data: {
  username: string;
  email: string;
  password: string;
}) {
  return axios.post("/register", data);
}

export async function getUser() {
  return axios.get("/users/me");
}

export async function getUserInitially(): Promise<{
  id: number;
  username: string;
  email: string;
  is_active: boolean;
} | null> {
  const token = getAuthToken();
  if (!token) return null;

  try {
    const res = await getUser();
    return res.data;
  } catch (err) {
    console.log("User is not logged in");
    remoreToken();
    return null;
  }
}
