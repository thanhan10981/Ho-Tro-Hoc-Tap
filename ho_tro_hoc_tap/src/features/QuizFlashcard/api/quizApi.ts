export type CreateQuizPayload = {
  maMonHoc: number;
  tenQuiz: string;
  moTa?: string;
};

export type QuizResponse = {
  maQuiz: number;
  tenQuiz: string;
  moTa?: string;
  maMonHoc: number;
};

const API_URL = "http://localhost:9090/api/quizzes";

export async function createQuiz(payload: CreateQuizPayload) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Chưa đăng nhập");

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Tạo quiz thất bại");
  }

  return res.json();
}

export async function getMyQuizzes(): Promise<QuizResponse[]> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Chưa đăng nhập");

  const res = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Không lấy được quiz");
  }

  return res.json();
}
