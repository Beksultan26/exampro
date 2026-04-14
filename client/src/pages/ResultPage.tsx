import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api";

type Attempt = {
  id: string;
  score: number;
  totalQuestions: number;
  subject: {
    title: string;
    slug: string;
  };
  answers: Array<{
    id: string;
    isCorrect: boolean;
    question: {
      questionText: string;
      explanation: string | null;
    };
    selectedOption: {
      optionText: string;
    };
  }>;
};

export default function ResultPage() {
  const { id } = useParams();
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadResult() {
      try {
        const { data } = await api.get(`/quiz/attempt/${id}`);
        setAttempt(data);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Ошибка загрузки результата");
      } finally {
        setLoading(false);
      }
    }

    loadResult();
  }, [id]);

  const wrongAnswersCount = useMemo(() => {
    if (!attempt) return 0;
    return attempt.answers.filter((a) => !a.isCorrect).length;
  }, [attempt]);

  const percent = useMemo(() => {
    if (!attempt || attempt.totalQuestions === 0) return 0;
    return Math.round((attempt.score / attempt.totalQuestions) * 100);
  }, [attempt]);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p style={{ color: "crimson" }}>{error}</p>;
  if (!attempt) return <p>Результат не найден</p>;

  return (
    <div className="result-grid">
      <div className="result-card">
        <h1 style={{ marginTop: 0 }}>Результат теста</h1>
        <h2>{attempt.subject.title}</h2>

        <div className="result-score">
          {attempt.score} / {attempt.totalQuestions}
        </div>

        <p className="page-subtext">Процент выполнения: {percent}%</p>
        <p className="page-subtext">Ошибок: {wrongAnswersCount}</p>

        <div className="result-actions">
          <Link to={`/subject/${attempt.subject.slug}`} className="btn-outline">
            К предмету
          </Link>

          <Link to="/profile" className="btn-primary">
            В профиль
          </Link>

          {wrongAnswersCount > 0 && (
            <Link
              to={`/quiz/${attempt.subject.slug}?mode=mistakes`}
              className="btn-outline"
            >
              Работа над ошибками
            </Link>
          )}
        </div>
      </div>

      {attempt.answers.map((answer, index) => (
        <div
          key={answer.id}
          className={`result-card result-answer ${
            answer.isCorrect ? "correct" : "wrong"
          }`}
        >
          <h3 style={{ marginTop: 0 }}>
            {index + 1}. {answer.question.questionText}
          </h3>

          <p>
            <strong>Ваш ответ:</strong> {answer.selectedOption.optionText}
          </p>

          <p>
            <strong>Статус:</strong> {answer.isCorrect ? "Верно" : "Неверно"}
          </p>

          {answer.question.explanation && (
            <div className="quiz-explanation">
              <strong>Пояснение:</strong> {answer.question.explanation}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}