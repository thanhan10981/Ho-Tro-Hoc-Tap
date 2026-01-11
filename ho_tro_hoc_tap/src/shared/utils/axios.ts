//utils/axios.ts

import axios from "axios";
import { getToken } from "../../features/auth/util/token";

const instance = axios.create({
  baseURL: "http://localhost:9090",
});

instance.interceptors.request.use((config) => {
  const token = getToken(); // ✅ dùng chung
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
