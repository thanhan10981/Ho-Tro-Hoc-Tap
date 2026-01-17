export interface CreateFlashcardSetPayload {
  maMonHoc: number;
  tenBo: string;
  moTa?: string;
}

export async function createFlashcardSet(
  payload: CreateFlashcardSetPayload
) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Chưa đăng nhập");
  }

  const response = await fetch(
    "http://localhost:9090/api/flashcard-sets",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    throw new Error("Tạo bộ flashcard thất bại");
  }

  return response.json(); 
}
