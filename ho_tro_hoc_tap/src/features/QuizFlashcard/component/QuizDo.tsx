import { useState } from "react";
import "./quizdo.css";
export default function QuizDo({ questions }: { questions: any[] }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = submitted
    ? questions.filter(
        (q) => answers[q.maCauHoi] === q.dapAnDung
      ).length
    : 0;

  return (
    <div className="quiz-do">
      <h2 className="quiz-title">📝 Làm bài Quiz</h2>

      {questions.map((q, index) => {
        const userAnswer = answers[q.maCauHoi];

        return (
          <div key={q.maCauHoi} className="quiz-question">
            <h3>
              Câu {index + 1}: {q.noiDung}
            </h3>

            {q.dapAn.map((a: any) => {
              const isSelected = userAnswer === a.maDapAn;
              const isCorrect = submitted && a.maDapAn === q.dapAnDung;
              const isWrong =
                submitted &&
                isSelected &&
                a.maDapAn !== q.dapAnDung;

              return (
                <label
                  key={a.maDapAn}
                  className={`quiz-option
                    ${isSelected ? "selected" : ""}
                    ${isCorrect ? "correct-option" : ""}
                    ${isWrong ? "wrong-option" : ""}
                  `}
                >
                  <input
                    type="radio"
                    name={`q-${q.maCauHoi}`}
                    checked={isSelected}
                    onChange={() =>
                      setAnswers({
                        ...answers,
                        [q.maCauHoi]: a.maDapAn,
                      })
                    }
                    disabled={submitted}
                  />
                  {a.noiDung}
                </label>
              );
            })}

            {submitted && (
              <p
                className={
                  userAnswer === q.dapAnDung
                    ? "correct"
                    : "wrong"
                }
              >
                {userAnswer === q.dapAnDung
                  ? "✔ Đúng"
                  : "✖ Sai"}
              </p>
            )}
          </div>
        );
      })}

      {!submitted ? (
        <button
          className="btn-submit"
          onClick={() => setSubmitted(true)}
        >
          🚀 Nộp bài
        </button>
      ) : (
        <div className="quiz-score">
          🎯 Bạn đúng <strong>{score}</strong> /{" "}
          {questions.length} câu
        </div>
      )}
    </div>
  );
}
