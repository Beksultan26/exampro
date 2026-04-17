import { useEffect, useState } from "react";
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
          maxWidth: "700px",
          background: "#fff",
          padding: "24px",
          borderRadius: "16px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ marginBottom: "16px" }}>Профиль</h1>
        <p><strong>Имя:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Роль:</strong> {user.role}</p>

        <button
          onClick={handleLogout}
          style={{
            marginTop: "20px",
            padding: "12px 16px",
            borderRadius: "10px",
            border: "none",
            background: "#ef4444",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Выйти
        </button>
      </div>

      <div
        style={{
          maxWidth: "700px",
          background: "#fff",
          padding: "24px",
          borderRadius: "16px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <h2 style={{ marginTop: 0 }}>История попыток</h2>

        {history.length === 0 ? (
          <p>Пока нет пройденных тестов.</p>
        ) : (
          <div style={{ display: "grid", gap: "12px" }}>
            {history.map((attempt) => (
              <Link
                key={attempt.id}
                to={`/result/${attempt.id}`}
                style={{
                  textDecoration: "none",
                  color: "#0f172a",
                  padding: "14px",
                  borderRadius: "12px",
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                }}
              >
                <strong>{attempt.subject.title}</strong>
                <div>
                  Результат: {attempt.score} / {attempt.totalQuestions}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}