export interface MonHoc {
  maMonHoc: number;
  tenMonHoc: string;
}

export async function getMyMonHoc(): Promise<MonHoc[]> {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Chưa đăng nhập");
  }

  const res = await fetch("http://localhost:9090/api/mon-hoc/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Không lấy được danh sách môn học");
  }

  return res.json();
}
