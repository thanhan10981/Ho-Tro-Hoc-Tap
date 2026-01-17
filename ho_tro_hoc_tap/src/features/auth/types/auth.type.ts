export interface LoginRequest {
  email: string;
  matKhau: string;
}

export interface LoginResponse {
  token: string;
}

export interface RegisterRequest {
  hoTen: string;
  email: string;
  matKhau: string;
  xacNhanMatKhau: string;
  linhVucQuanTam: string;
}

export interface UserMe {
  hoTen: string;
  email: string;
  capBacHoc: number | null;
  linhVucQuanTam: string;
  ngayTao: string;
}
