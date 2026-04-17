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

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.clear();
    window.location.href = "/login";
  }

  // 📊 статистика
  const stats = useMemo(() => {
    if (history.length === 0) {
      return {
        attempts: 0,
        avg: 0,
        best: 0,
        correct: 0,
        total: 0,
      };
    }

    let totalScore = 0;
    let totalQuestions = 0;
    let best = 0;

    history.forEach((a) => {
      const percent = (a.score / a.totalQuestions) * 100;
      totalScore += percent;
      totalQuestions += a.totalQuestions;
      if (percent > best) best = percent;
    });

    return {
      attempts: history.length,
      avg: Math.round(totalScore / history.length),
      best: Math.round(best),
      correct: history.reduce((s, a) => s + a.score, 0),
      total: totalQuestions,
    };
  }, [history]);

  if (error) return <p style={{ color: "crimson" }}>{error}</p>;
  if (!user) return <p>Загрузка...</p>;

  return (
    <div className="profile-page">
      {/* 👤 профиль */}
      <div className="profile-card">
        <h1>Профиль</h1>
        <p><strong>Имя:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Роль:</strong> {user.role}</p>

        <button className="btn-danger" onClick={handleLogout}>
          Выйти
        </button>
      </div>

      {/* 📊 статистика */}
      <div className="stats-grid">
        <div className="stat-card">
          <span>Попыток</span>
          <strong>{stats.attempts}</strong>
        </div>

        <div className="stat-card">
          <span>Средний результат</span>
          <strong>{stats.avg}%</strong>
        </div>

        <div className="stat-card">
          <span>Лучший результат</span>
          <strong>{stats.best}%</strong>
        </div>

        <div className="stat-card">
          <span>Правильных ответов</span>
          <strong>{stats.correct} / {stats.total}</strong>
        </div>
      </div>

      {/* 📜 история */}
      <div className="history-card">
        <h2>История попыток</h2>

        {history.length === 0 ? (
          <p>Пока нет пройденных тестов.</p>
        ) : (
          <div className="history-list">
            {history.map((attempt) => {
              const percent = Math.round(
                (attempt.score / attempt.totalQuestions) * 100
              );

              return (
                <Link
                  key={attempt.id}
                  to={`/result/${attempt.id}`}
                  className="history-item"
                >
                  <strong>{attempt.subject.title}</strong>

                  <div>
                    Результат: {attempt.score} / {attempt.totalQuestions}
                  </div>

                  <div className="history-meta">
                    {percent}% • {new Date(attempt.createdAt).toLocaleString()}
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