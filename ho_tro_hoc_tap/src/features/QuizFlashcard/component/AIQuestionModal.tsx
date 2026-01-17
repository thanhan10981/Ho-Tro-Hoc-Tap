import { useState } from "react";
import "./AIQuestionModal.css";

type Props = {
  maQuiz: number;
  onClose: () => void;
};

export default function AIQuestionModal({ maQuiz, onClose }: Props) {
  const [topic, setTopic] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState("easy");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
        if (!token) throw new Error("Chưa đăng nhập");
  const handleGenerate = async () => {
    debugger
  if (!topic) {
    alert("Vui lòng nhập chủ đề");
    return;
  }

  setLoading(true);

  try {
    const res = await fetch("http://localhost:9090/api/quiz-ai/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        maQuiz,
        topic,
        numQuestions,
        difficulty,
      }),
    });

    if (!res.ok) {
      throw new Error("API lỗi");
    }

    alert("✨ AI đã tạo câu hỏi thành công");
    onClose();

  } catch (err) {
    console.error("AI error:", err);
    alert("Tạo câu hỏi bằng AI thất bại");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="ai-overlay">
      <div className="ai-modal">
        <h2>✨ Tạo câu hỏi bằng AI</h2>

        <label>Chủ đề / nội dung</label>
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="VD: Stack trong cấu trúc dữ liệu"
        />

        <label>Số lượng câu hỏi</label>
        <input
          type="number"
          min={1}
          max={20}
          value={numQuestions}
          onChange={(e) => setNumQuestions(Number(e.target.value))}
        />

        <label>Độ khó</label>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="easy">Dễ</option>
          <option value="medium">Trung bình</option>
          <option value="hard">Khó</option>
        </select>

        <div className="ai-actions">
          <button className="btn-cancel" onClick={onClose}>
            Hủy
          </button>
          <button className="btn-generate" onClick={handleGenerate}>
            {loading ? "Đang tạo..." : "Tạo bằng AI"}
          </button>
        </div>
      </div>
    </div>
  );
}
