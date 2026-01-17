import { useEffect, useState } from "react";
import "../../../styles/QuizFlashcard.css";
import CreateFlashcardSetModal from "../../../features/QuizFlashcard/component/CreateFlashcardSetModal";
import FlashcardDetail from "../../../features/QuizFlashcard/component/FlashcardDetail";
import CreateQuizTopicModal from "../../../features/QuizFlashcard/component/CreateQuizTopicModal";
import {
  getMyQuizzes,
  type QuizResponse,
} from "../../../features/QuizFlashcard/api/quizApi";
import { useNavigate } from "react-router-dom";


type FlashcardSet = {
  maBoFlashcard: number;
  tenBo: string;
  moTa?: string;
  soLuongFlashcard: number;
};

export default function QuizFlashcard() {
  const [openFlashcard, setOpenFlashcard] = useState(false);
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([]);
  const [loadingSets, setLoadingSets] = useState<boolean>(false);
  const [selectedSet, setSelectedSet] = useState<FlashcardSet | null>(null);
  const [openQuizModal, setOpenQuizModal] = useState(false);
  const [quizSets, setQuizSets] = useState<QuizResponse[]>([]);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  type ToastType = "success" | "error";
 const navigate = useNavigate();
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const fetchFlashcardSets = async () => {
      try {
        setLoadingSets(true);

        const token = localStorage.getItem("token");
        if (!token) throw new Error("Chưa đăng nhập");

        const res = await fetch("http://localhost:9090/api/flashcard-sets", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Không lấy được bộ flashcard");

        const data: FlashcardSet[] = await res.json();
        setFlashcardSets(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingSets(false);
      }
    };

    fetchFlashcardSets();
  }, []);
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoadingQuiz(true);
        const data = await getMyQuizzes();
        setQuizSets(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingQuiz(false);
      }
    };

    fetchQuizzes();
  }, []);

  return (
    <div className="qz-container">
      {/* HEADER */}
      <div className="qz-header">
        <h1>Luyện Tập Thông Minh</h1>
        <p>Chọn phương thức học tập phù hợp với bạn</p>
      </div>

      {/* CARDS */}
      <div className="qz-mode-wrapper">
        <div className="qz-mode-card quiz">
          <div className="icon">
            <img src="/quiz.svg" alt="quiz" />
          </div>
          <h2>Làm Quiz</h2>
          <p>Kiểm tra kiến thức với các câu hỏi trắc nghiệm</p>
          <button
            className="start-btn start-btn--quiz"
            onClick={() => setOpenQuizModal(true)}
          >
            Bắt đầu
          </button>
        </div>

        <div className="qz-mode-card flashcard">
          <div className="icon">
            <img src="/flashcard.svg" alt="flashcard" />
          </div>
          <h2>Luyện Flashcards</h2>
          <p>Ghi nhớ kiến thức hiệu quả với hệ thống thẻ ghi nhớ</p>

          <button
            className="start-btn start-btn--flashcard"
            onClick={() => setOpenFlashcard(true)}
          >
            Bắt đầu
          </button>
        </div>
      </div>

      {/* MODAL */}
      {openFlashcard && (
        <CreateFlashcardSetModal onClose={() => setOpenFlashcard(false)} />
      )}
      {openQuizModal && (
        <CreateQuizTopicModal
          onClose={() => setOpenQuizModal(false)}
          onNotify={showToast}
          onSubmit={(data) => {
            console.log("Submit quiz topic:", data);
          }}
        />
      )}

      {/* RECENT QUIZ */}
      <h2 className="qz-section-title">Bộ Quiz Gần Đây</h2>

      {loadingQuiz ? (
        <p>Đang tải quiz...</p>
      ) : quizSets.length === 0 ? (
        <div className="qz-empty">
          <h3>Bạn chưa có bộ quiz nào</h3>
          <p>Hãy tạo bộ quiz đầu tiên để bắt đầu luyện tập 🎯</p>
          <button
            className="start-btn start-btn--quiz"
            onClick={() => setOpenQuizModal(true)}
          >
            Tạo quiz ngay
          </button>
        </div>
      ) : (
        <div className="qz-grid">
          {quizSets.map((q) => (
            <div
              key={q.maQuiz}
              className="qz-item"
              onClick={() => navigate(`/quiz/${q.maQuiz}`)}
              style={{ cursor: "pointer" }}
            >
              <div className="qz-thumb" style={{ borderColor: "#10b981" }}>
                <img src="/quiz.svg" alt="quiz" />
              </div>

              <h3>{q.tenQuiz}</h3>
              <p className="qz-sub">{q.moTa || "Không có mô tả"}</p>

              <div className="qz-tag De">Quiz</div>
            </div>
          ))}
        </div>
      )}

      <h2 className="qz-section-title">Bộ Flashcard Của Bạn</h2>

      {loadingSets ? (
        <p>Đang tải bộ flashcard...</p>
      ) : flashcardSets.length === 0 ? (
        <div className="qz-empty flashcard-empty">
          <img src="/empty-flashcard.svg" alt="empty flashcard" />
          <h3>Bạn chưa có bộ flashcard nào</h3>
          <p>Hãy tạo bộ flashcard đầu tiên để bắt đầu học tập 📘</p>
          <button
            className="start-btn start-btn--flashcard"
            onClick={() => setOpenFlashcard(true)}
          >
            Tạo flashcard ngay
          </button>
        </div>
      ) : (
        <div className="qz-grid">
          {flashcardSets.map((set) => (
            <div
              key={set.maBoFlashcard}
              className="qz-item"
              onClick={() => setSelectedSet(set)}
              style={{ cursor: "pointer" }}
            >
              <div className="qz-thumb" style={{ borderColor: "#f97316" }}>
                <img src="/flashcard.svg" alt="flashcard" />
              </div>

              <h3>{set.tenBo}</h3>
              <p className="qz-sub">{set.moTa || "Không có mô tả"}</p>
              <p className="qz-count">📘 {set.soLuongFlashcard} flashcard</p>
              <div className="qz-tag Trungbinh">Flashcard</div>
            </div>
          ))}

          {selectedSet && (
            <FlashcardDetail
              flashcardSet={selectedSet}
              onClose={() => setSelectedSet(null)}
            />
          )}
          {toast && (
            <div className={`toast toast-${toast.type}`}>{toast.message}</div>
          )}
        </div>
      )}
    </div>
  );
}
