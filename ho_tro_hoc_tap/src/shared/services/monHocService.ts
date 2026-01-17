//monHocService.ts

import axios from "../utils/axios"
import type { CreateMonHocPayload, MonHocResponse } from "../types/monHoc";



export const createMonHoc = async (
  payload: CreateMonHocPayload
): Promise<MonHocResponse> => {
  const res = await axios.post("/api/mon-hoc", payload);
  return res.data;
};

export const getMyMonHoc = async (): Promise<MonHocResponse[]> => {
  const res = await axios.get("/api/mon-hoc/me");
  return res.data;
};
