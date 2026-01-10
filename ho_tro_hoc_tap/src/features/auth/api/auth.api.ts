import axios from "axios";
import type { LoginRequest, LoginResponse, RegisterRequest, UserMe } from "../types/auth.type";
import { getToken } from "../util/token";

const api = axios.create({
  baseURL: "http://localhost:9090/api",
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginApi = async (data: LoginRequest) => {
  const res = await api.post<LoginResponse>("/auth/login", data);
  return res.data;
};

export const registerApi = async (data: RegisterRequest) => {
  await api.post("/auth/register", data);
};

export const getMeApi = async () => {
  const res = await api.get<UserMe>("/users/me");
  return res.data;
};
