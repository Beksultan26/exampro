import { useEffect, useMemo, useState } from "react";
import { api } from "../api";
import { Link } from "react-router-dom";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

type Attempt = {
  id: string;
  score: number;
  totalQuestions: number;
  createdAt: string;
  subject: {
    title: string;
    slug: string;
  };
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [history, setHistory] = useState<Attempt[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const userRes = await api.get("/auth/me");
        setUser(userRes.data);

        const historyRes = await api.get("/quiz/history");
        setHistory(historyRes.data);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Ошибка загрузки профиля");
      }
    }

    loadProfile();
  }, []);

  const totalAttempts = history.length;

  const totalCorrectAnswers = useMemo(() => {
    return history.reduce((sum, attempt) => sum + attempt.score, 0);
  }, [history]);

  const totalQuestionsAnswered = useMemo(() => {
    return history.reduce((sum, attempt) => sum + attempt.totalQuestions, 0);
  }, [history]);

  const averagePercent = useMemo(() => {
    if (history.length === 0) return 0;

    const totalPercent = history.reduce((sum, attempt) => {
      if (attempt.totalQuestions === 0) return sum;
      return sum + (attempt.score / attempt.totalQuestions) * 100;
    }, 0);

    return Math.round(totalPercent / history.length);
  }, [history]);

  const bestResult = useMemo(() => {
    if (history.length === 0) return 0;

    return Math.max(
      ...history.map((attempt) =>
        attempt.totalQuestions === 0
          ? 0
          : Math.round((attempt.score / attempt.totalQuestions) * 100)
      )
    );
  }, [history]);

  function formatDate(date: string) {
    return new Date(date).toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.clear();
    window.location.href = "/login";
  }

  if (error) {
    return <p style={{ color: "crimson" }}>{error}</p>;
  }

  if (!user) {
    return <p>Загрузка...</p>;
  }

  return (
    <div style={{ display: "grid", gap: "24px" }}>
      <div
        style={{
          maxWidth: "900px",
          background: "#fff",
          padding: "24px",
          borderRadius: "16px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ marginBottom: "16px" }}>Профиль</h1>

        <div style={{ display: "grid", gap: "8px", marginBottom: "20px" }}>
          <p><strong>Имя:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Роль:</strong> {user.role}</p>
          <p><strong>Дата регистрации:</strong> {formatDate(user.createdAt)}</p>
        </div>

        <button
          onClick={handleLogout}
          style={{
            marginTop: "8px",
            padding: "12px 16px",
            borderRadius: "10px",
            border: "none",
            background: "#ef4444",
            color: "#fff",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Выйти
        </button>
      </div>

      <div
        style={{
          maxWidth: "900px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "16px",
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "16px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ fontSize: "14px", color: "#64748b" }}>Попыток</div>
          <div style={{ fontSize: "32px", fontWeight: 700 }}>{totalAttempts}</div>
        </div>

        <div
          style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "16px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ fontSize: "14px", color: "#64748b" }}>Средний результат</div>
          <div style={{ fontSize: "32px", fontWeight: 700 }}>{averagePercent}%</div>
        </div>

        <div
          style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "16px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ fontSize: "14px", color: "#64748b" }}>Лучший результат</div>
          <div style={{ fontSize: "32px", fontWeight: 700 }}>{bestResult}%</div>
        </div>

        <div
          style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "16px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ fontSize: "14px", color: "#64748b" }}>Правильных ответов</div>
          <div style={{ fontSize: "32px", fontWeight: 700 }}>
            {totalCorrectAnswers} / {totalQuestionsAnswered}
          </div>
        </div>
      </div>

      <div
        style={{
          maxWidth: "900px",
          background: "#fff",
          padding: "24px",
          borderRadius: "16px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: "16px" }}>История попыток</h2>

        {history.length === 0 ? (
          <p>Пока нет пройденных тестов.</p>
        ) : (
          <div style={{ display: "grid", gap: "12px" }}>
            {history.map((attempt) => {
              const percent =
                attempt.totalQuestions > 0
                  ? Math.round((attempt.score / attempt.totalQuestions) * 100)
                  : 0;

              return (
                <Link
                  key={attempt.id}
                  to={`/result/${attempt.id}`}
                  style={{
                    textDecoration: "none",
                    color: "#0f172a",
                    padding: "16px",
                    borderRadius: "12px",
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    display: "grid",
                    gap: "6px",
                  }}
                >
                  <strong style={{ fontSize: "17px" }}>
                    {attempt.subject.title}
                  </strong>

                  <div>Результат: {attempt.score} / {attempt.totalQuestions}</div>
                  <div>Процент: {percent}%</div>
                  <div style={{ color: "#64748b", fontSize: "14px" }}>
                    Дата: {formatDate(attempt.createdAt)}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}