export async function getQuizQuestions(maQuiz: number) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Chưa đăng nhập");

  const res = await fetch(
    `http://localhost:9090/api/quizzes/${maQuiz}/questions`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Không lấy được câu hỏi quiz");
  }

  return res.json();
}
