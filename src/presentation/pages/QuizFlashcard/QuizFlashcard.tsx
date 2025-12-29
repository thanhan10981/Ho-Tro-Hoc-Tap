import "../../../styles/QuizFlashcard.css";

export default function QuizFlashcard() {

    const recentQuizzes = [
        {
            title: "Cấu Trúc Dữ Liệu - Mảng",
            questions: 10,
            progress: 80,
            difficulty: "Dễ",
            color: "#3b82f6"
        },
        {
            title: "Thuật Toán Sắp Xếp",
            questions: 15,
            progress: 60,
            difficulty: "Trung bình",
            color: "#f97316"
        },
        {
            title: "Machine Learning Cơ Bản",
            questions: 12,
            progress: 30,
            difficulty: "Khó",
            color: "#dc2626"
        }
    ];

    return (
        <div className="qz-container">

            {/* TITLE */}
            <div className="qz-header">
                <h1>Luyện Tập Thông Minh</h1>
                <p>Chọn phương thức học tập phù hợp với bạn</p>
            </div>

            {/* CARDS */}
            <div className="qz-mode-wrapper">
                <div className="qz-mode-card quiz">
                    <div className="icon">💬</div>
                    <h2>Làm Quiz</h2>
                    <p>
                        Kiểm tra kiến thức với các câu hỏi trắc nghiệm  
                        được tạo tự động từ tài liệu học tập
                    </p>
                    <button>Bắt Đầu</button>
                </div>

                <div className="qz-mode-card flashcard">
                    <div className="icon">📚</div>
                    <h2>Luyện Flashcards</h2>
                    <p>
                        Ghi nhớ kiến thức hiệu quả với hệ thống thẻ ghi nhớ thông minh
                    </p>
                    <button>Bắt Đầu</button>
                </div>
            </div>

            {/* RECENT QUIZ */}
            <h2 className="qz-section-title">Bộ Quiz Gần Đây</h2>

            <div className="qz-grid">
                {recentQuizzes.map((q, i) => (
                    <div key={i} className="qz-item">

                        <div className="qz-thumb" style={{ borderColor: q.color }}>
                            📘
                        </div>

                        <h3>{q.title}</h3>

                        <p className="qz-sub">{q.questions} câu hỏi</p>

                        {/* Progress */}
                        <div className="qz-progress">
                            <div className="bar">
                                <div className="fill" style={{ width: q.progress + "%", background: q.color }}></div>
                            </div>
                            <span>{q.progress}%</span>
                        </div>

                        <div className={`qz-tag ${q.difficulty.replace(" ", "")}`}>

                            {q.difficulty}
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}
