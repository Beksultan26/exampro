import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { api } from "../api";

type Option = {
  id: string;
  optionText: string;
};

type Question = {
  id: string;
  questionText: string;
  options: Option[];
};

type QuizSubject = {
  title: string;
  slug: string;
  questions: Question[];
};

export default function QuizPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const mode = searchParams.get("mode") || "normal";
  const isMistakesMode = mode === "mistakes";

  const [subject, setSubject] = useState<QuizSubject | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadQuiz() {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const { data } = await api.get(`/quiz/by-subject/${slug}`, {
          params: { mode },
        });

        setSubject(data);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Ошибка загрузки теста");
      } finally {
        setLoading(false);
      }
    }

    loadQuiz();
  }, [slug, mode, navigate]);

  function handleSelect(optionId: string) {
    if (!question) return;

    setAnswers((prev) => ({
      ...prev,
      [question.id]: optionId,
    }));
  }

  function handleNext() {
    if (!subject) return;
    if (currentIndex < subject.questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  }

  function handlePrev() {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }

  async function handleSubmit() {
    if (!subject) return;

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const formattedAnswers = Object.entries(answers).map(
      ([questionId, selectedOptionId]) => ({
        questionId,
        selectedOptionId,
      })
    );

    try {
      setSubmitting(true);

      const { data } = await api.post("/quiz/submit", {
        subjectSlug: subject.slug,
        answers: formattedAnswers,
      });

      navigate(`/result/${data.id}`);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Ошибка отправки теста");
    } finally {
      setSubmitting(false);
    }
  }

  const question = subject?.questions[currentIndex] ?? null;
  const totalQuestions = subject?.questions.length ?? 0;
  const currentQuestionNumber = currentIndex + 1;
  const progressPercent =
    totalQuestions > 0 ? Math.round((currentQuestionNumber / totalQuestions) * 100) : 0;

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p style={{ color: "crimson" }}>{error}</p>;
  if (!subject || !question) return <p>Тест не найден</p>;

  return (
    <div className="quiz-page-wrap">
      <div className="quiz-card">
        <Link to={`/subject/${subject.slug}`} className="back-link">
          ← Назад к предмету
        </Link>

        <div className="quiz-topbar">
          <div>
            <h1 className="page-heading" style={{ marginBottom: 8 }}>
              {isMistakesMode ? `Работа над ошибками: ${subject.title}` : `Тест: ${subject.title}`}
            </h1>
            <p className="quiz-subtitle">
              Вопрос {currentQuestionNumber} из {totalQuestions}
            </p>
          </div>

          <div className="quiz-counter-badge">{progressPercent}%</div>
        </div>

        <div className="quiz-progress-bar">
          <div
            className="quiz-progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="quiz-dots">
          {subject.questions.map((q, index) => {
            const isCurrent = index === currentIndex;
            const isAnswered = Boolean(answers[q.id]);

            return (
              <button
                key={q.id}
                type="button"
                className={`quiz-dot ${isCurrent ? "current" : ""} ${
                  isAnswered ? "answered" : ""
                }`}
                onClick={() => setCurrentIndex(index)}
              >
                {index + 1}
              </button>
            );
          })}
        </div>

        <div className="quiz-question-box">
          <div className="quiz-question-label">Вопрос</div>
          <div className="quiz-question">{question.questionText}</div>
        </div>

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
          <button
            type="button"
            className="btn-outline"
            onClick={handlePrev}
            disabled={currentIndex === 0}
          >
            Назад
          </button>

          {currentIndex < totalQuestions - 1 ? (
            <button
              type="button"
              className="btn-primary"
              onClick={handleNext}
              disabled={!answers[question.id]}
            >
              Далее
            </button>
          ) : (
            <button
              type="button"
              className="btn-primary"
              onClick={handleSubmit}
              disabled={submitting || !answers[question.id]}
            >
              {submitting ? "Отправка..." : "Завершить"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}