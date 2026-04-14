import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { api } from "./api";

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

  const [subject, setSubject] = useState<QuizSubject | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadQuiz() {
      try {
        const { data } = await api.get(`/quiz/by-subject/${slug}`);
        setSubject(data);
      } catch (err: any) {
        setError(err?.message || "Ошибка загрузки теста");
      } finally {
        setLoading(false);
      }
    }

    loadQuiz();
  }, [slug]);

  function handleSelect(questionId: string, optionId: string) {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  }

  async function handleSubmit() {
    if (!subject) return;

    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("Сначала войдите в аккаунт");
      navigate("/login");
      return;
    }

    const formattedAnswers = Object.entries(answers).map(([questionId, selectedOptionId]) => ({
      questionId,
      selectedOptionId,
    }));

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

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p style={{ color: "crimson" }}>{error}</p>;
  if (!subject) return <p>Тест не найден</p>;

  return (
    <div>
      <Link to={`/subject/${subject.slug}`}>← Назад к предмету</Link>

      <h1 style={{ marginTop: "16px", marginBottom: "24px" }}>
        Тест: {subject.title}
      </h1>

      <div style={{ display: "grid", gap: "20px" }}>
        {subject.questions.map((question, index) => (
          <div
            key={question.id}
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "16px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            }}
          >
            <h3 style={{ marginTop: 0 }}>
              {index + 1}. {question.questionText}
            </h3>

            <div style={{ display: "grid", gap: "10px", marginTop: "12px" }}>
              {question.options.map((option) => (
                <label
                  key={option.id}
                  style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "flex-start",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="radio"
                    name={question.id}
                    checked={answers[question.id] === option.id}
                    onChange={() => handleSelect(question.id, option.id)}
                  />
                  <span>{option.optionText}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={submitting}
        style={{
          marginTop: "24px",
          padding: "14px 22px",
          borderRadius: "10px",
          border: "none",
          background: "#2563eb",
          color: "#fff",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        {submitting ? "Отправка..." : "Завершить тест"}
      </button>
    </div>
  );
}