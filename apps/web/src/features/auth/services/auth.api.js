import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  withCredentials: true,
});

function getError(error) {
  return error.response?.data?.error?.message || error.response?.data?.message || error.message || "Request failed";
}

export async function register({ username, email, password }) {
  try {
    return (await api.post("/api/auth/register", { username, email, password })).data;
  } catch (error) { throw new Error(getError(error)); }
}

export async function login({ email, password }) {
  try {
    return (await api.post("/api/auth/login", { email, password })).data;
  } catch (error) { throw new Error(getError(error)); }
}

export async function logout() {
  try { return (await api.post("/api/auth/logout")).data; }
  catch (error) { throw new Error(getError(error)); }
}

export async function getMe() {
  try { return (await api.get("/api/auth/get-me")).data; }
  catch (error) { throw new Error(getError(error)); }
}
