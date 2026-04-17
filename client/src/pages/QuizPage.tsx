import { useEffect, useMemo, useState } from "react";
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
  const isExamMode = mode === "exam";
  const isMistakesMode = mode === "mistakes";

  const [subject, setSubject] = useState<QuizSubject | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(600);

  useEffect(() => {
    async function loadQuiz() {
      try {
        const token = localStorage.getItem("token"); // ✅ FIX

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

  useEffect(() => {
    if (!isExamMode) return;

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
  }, [isExamMode]);

  const question = useMemo(() => {
    if (!subject) return null;
    return subject.questions[currentIndex] ?? null;
  }, [subject, currentIndex]);


  function handleSelect(optionId: string) {
    if (!question) return;

    if (isExamMode && answers[question.id]) return;

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
    if (isExamMode) return;

    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }

  async function handleSubmit() {
    if (!subject) return;

    const token = localStorage.getItem("token"); // ✅ FIX
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
      alert(err?.response?.data?.message || "Ошибка отправки теста");
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
  if (!subject || !question) return <p>Тест не найден</p>;

  return (
    <div className="quiz-card">
      <Link to={`/subject/${subject.slug}`} className="back-link">
        ← Назад к предмету
      </Link>

      <h1 className="page-heading">
        {isExamMode
          ? `Экзамен: ${subject.title}`
          : isMistakesMode
          ? `Работа над ошибками: ${subject.title}`
          : `Тест: ${subject.title}`}
      </h1>

      {isExamMode && (
        <div className="exam-timer">⏱ Осталось: {formatTime(timeLeft)}</div>
      )}

      <div className="quiz-question">{question.questionText}</div>

      <div className="quiz-options">
        {question.options.map((option) => (
          <button
            key={option.id}
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
        <button onClick={handlePrev}>Назад</button>
        {currentIndex < subject.questions.length - 1 ? (
          <button onClick={handleNext}>Далее</button>
        ) : (
          <button onClick={handleSubmit}>
            {submitting ? "Отправка..." : "Завершить"}
          </button>
        )}
      </div>
    </div>
  );
}