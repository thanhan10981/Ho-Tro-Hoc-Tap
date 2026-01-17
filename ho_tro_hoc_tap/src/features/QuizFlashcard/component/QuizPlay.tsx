import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getQuizQuestions } from "../api/quizQuestionApi";
import QuizDo from "./QuizDo";
import QuizEmptyState from "./QuizEmptyState";

export default function QuizPlay() {
  const { maQuiz } = useParams();
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await getQuizQuestions(Number(maQuiz));
        setQuestions(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [maQuiz]);

  if (loading) return <p>Đang tải câu hỏi...</p>;

  if (questions.length === 0) {
    return <QuizEmptyState maQuiz={Number(maQuiz)} />;
  }

  return <QuizDo questions={questions} />;
}
