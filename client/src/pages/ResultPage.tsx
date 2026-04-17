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

  const resultLabel = useMemo(() => {
    if (percent >= 85) return "Отличный результат";
    if (percent >= 60) return "Хороший результат";
    if (percent >= 40) return "Есть над чем поработать";
    return "Нужно повторить тему";
  }, [percent]);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p style={{ color: "crimson" }}>{error}</p>;
  if (!attempt) return <p>Результат не найден</p>;

  return (
    <div className="result-page">
      <div className="result-hero">
        <div className="result-badge">{resultLabel}</div>

        <h1 className="result-title">Результат теста</h1>
        <h2 className="result-subject">{attempt.subject.title}</h2>

        <div className="result-circle">
          <span>{percent}%</span>
        </div>

        <div className="result-summary">
          <div className="result-stat">
            <span>Правильных ответов</span>
            <strong>
              {attempt.score} / {attempt.totalQuestions}
            </strong>
          </div>

          <div className="result-stat">
            <span>Ошибок</span>
            <strong>{wrongAnswersCount}</strong>
          </div>
        </div>

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

      <div className="result-details">
        <h2>Разбор ответов</h2>

        <div className="result-list">
          {attempt.answers.map((answer, index) => (
            <div
              key={answer.id}
              className={`result-item ${answer.isCorrect ? "correct" : "wrong"}`}
            >
              <div className="result-item-top">
                <div className="result-number">{index + 1}</div>
                <div className="result-question-block">
                  <h3>{answer.question.questionText}</h3>
                  <p className="result-user-answer">
                    <strong>Ваш ответ:</strong> {answer.selectedOption.optionText}
                  </p>
                  <p className={`result-status ${answer.isCorrect ? "ok" : "bad"}`}>
                    {answer.isCorrect ? "Верно" : "Неверно"}
                  </p>
                </div>
              </div>

              {answer.question.explanation && (
                <div className="result-explanation">
                  <strong>Пояснение:</strong> {answer.question.explanation}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}