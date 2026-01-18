import { useState } from "react";
import AIQuestionModal from "./AIQuestionModal";
import "./QuizEmpty.css";
type Props = {
  maQuiz: number;
};

export default function QuizEmptyState({ maQuiz }: Props) {
  const [openAI, setOpenAI] = useState(false);

  return (
    <>
      <div className="quiz-empty">
        <h2>Bộ quiz này chưa có câu hỏi</h2>
        <p>Bạn có thể tạo câu hỏi thủ công hoặc dùng AI hỗ trợ 🤖</p>

        <button className="btn-ai" onClick={() => setOpenAI(true)}>
          ✨ Tạo câu hỏi bằng AI
        </button>
      </div>

      {openAI && (
        <AIQuestionModal
          maQuiz={maQuiz}
          onClose={() => setOpenAI(false)}
        />
      )}
    </>
  );
}
