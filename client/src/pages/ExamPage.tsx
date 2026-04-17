import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";

type Option = {
  id: string;
  optionText: string;
};

type Question = {
  id: string;
  questionText: string;
  options: Option[];
  subject?: {
    title: string;
    slug: string;
  };
};

type ExamData = {
  title: string;
  slug: string;
  questions: Question[];
};

export default function ExamPage() {
  const navigate = useNavigate();

  const [exam, setExam] = useState<ExamData | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(1800);

  useEffect(() => {
    async function loadExam() {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const { data } = await api.get("/quiz/exam");
        setExam(data);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Ошибка загрузки экзамена");
      } finally {
        setLoading(false);
      }
    }

    loadExam();
  }, [navigate]);

  const question = useMemo(() => {
    if (!exam) return null;
    return exam.questions[currentIndex] ?? null;
  }, [exam, currentIndex]);

  const progress = useMemo(() => {
    if (!exam || exam.questions.length === 0) return 0;
    return ((currentIndex + 1) / exam.questions.length) * 100;
  }, [exam, currentIndex]);

  useEffect(() => {
    if (!exam) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [exam]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  function handleSelect(optionId: string) {
    if (!question) return;

    if (answers[question.id]) return;

    setAnswers((prev) => ({
      ...prev,
      [question.id]: optionId,
    }));
  }

  function handleNext() {
    if (!exam) return;
    if (currentIndex < exam.questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  }

  async function handleSubmit() {
    if (!exam) return;

    const formattedAnswers = Object.entries(answers).map(
      ([questionId, selectedOptionId]) => ({
        questionId,
        selectedOptionId,
      })
    );

    try {
      setSubmitting(true);

      const { data } = await api.post("/quiz/exam/submit", {
        answers: formattedAnswers,
      });

      navigate(`/result/${data.id}`);
    } catch (err: any) {
      alert(err?.response?.data?.message || "Ошибка отправки экзамена");
    } finally {
      setSubmitting(false);
    }
  }

  function formatTime(sec: number) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p style={{ color: "crimson" }}>{error}</p>;
  if (!exam || !question) return <p>Экзамен не найден</p>;

  return (
    <div className="quiz-card">
      <Link to="/tests" className="back-link">
        ← Назад к тестам
      </Link>

      <h1 className="page-heading">Общий экзамен</h1>

      <div className="exam-timer">⏱ Осталось: {formatTime(timeLeft)}</div>

      <div className="quiz-header">
        <div className="quiz-counter">
          {currentIndex + 1} / {exam.questions.length}
        </div>

        <div className="quiz-progress-bar">
          <div
            className="quiz-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <p className="quiz-status-text">
        Предмет: <strong>{question.subject?.title || "Без предмета"}</strong>
      </p>

      <div className="quiz-dots">
        {exam.questions.map((q, i) => {
          const isCurrent = i === currentIndex;
          const isAnswered = Boolean(answers[q.id]);

          return (
            <button
              key={q.id}
              type="button"
              className={`quiz-dot ${isCurrent ? "current" : ""} ${
                isAnswered ? "answered" : ""
              }`}
              onClick={() => setCurrentIndex(i)}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      <div className="quiz-question">{question.questionText}</div>

      <div className="quiz-options">
        {question.options.map((option) => (
          <button
            key={option.id}
            type="button"
            className={`quiz-option ${
              answers[question.id] === option.id ? "selected" : ""
            }`}
            onClick={() => handleSelect(option.id)}
          >
            {option.optionText}
          </button>
        ))}
      </div>

      <div className="quiz-actions">
        {currentIndex < exam.questions.length - 1 ? (
          <button type="button" className="btn-primary" onClick={handleNext}>
            Далее
          </button>
        ) : (
          <button
            type="button"
            className="btn-primary"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Отправка..." : "Завершить экзамен"}
          </button>
        )}
      </div>
    </div>
  );
}