export type MucDoHoc =
  | "moi_bat_dau"
  | "dang_hoc"
  | "on_tap"
  | "thanh_thao";

export interface MonHocCreateData {
  tenMonHoc: string;
  moTa?: string;
  mucDoHoc: MucDoHoc;
}


export interface CreateMonHocPayload {
  tenMonHoc: string;
  moTa?: string;
  mucDoHoc: "moi_bat_dau" | "dang_hoc" | "on_tap" | "thanh_thao";
}

export interface MonHocResponse {
  maMonHoc: number;
  tenMonHoc: string;
  moTa?: string;
  mucDoHoc: string;
  ngayTao: string;
}

export interface ApiErrorResponse {
  message: string;
  status?: number;
  timestamp?: string;
}