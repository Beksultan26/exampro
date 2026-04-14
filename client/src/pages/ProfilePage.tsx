import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type Attempt = {
  id: string;
  score: number;
  totalQuestions: number;
  subject: {
    title: string;
    slug: string;
  };
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [history, setHistory] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [avatar, setAvatar] = useState<string | null>(
    localStorage.getItem("profileAvatar")
  );

  useEffect(() => {
    async function loadProfile() {
      try {
        const userRes = await api.get("/auth/me");
        setUser(userRes.data);

        const historyRes = await api.get("/quiz/history");
        setHistory(historyRes.data);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Ошибка загрузки профиля");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  function handleLogout() {
    localStorage.removeItem("accessToken");
    window.location.href = "/login";
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setAvatar(result);
      localStorage.setItem("profileAvatar", result);
    };
    reader.readAsDataURL(file);
  }

  const stats = useMemo(() => {
    const totalTests = history.length;

    const totalCorrect = history.reduce((sum, item) => sum + item.score, 0);
    const totalQuestions = history.reduce(
      (sum, item) => sum + item.totalQuestions,
      0
    );

    const averageScore =
      totalTests > 0
        ? Math.round(
            history.reduce(
              (sum, item) => sum + (item.score / item.totalQuestions) * 100,
              0
            ) / totalTests
          )
        : 0;

    const bestResult =
      history.length > 0
        ? Math.max(
            ...history.map((item) =>
              Math.round((item.score / item.totalQuestions) * 100)
            )
          )
        : 0;

    return {
      totalTests,
      totalCorrect,
      totalQuestions,
      averageScore,
      bestResult,
    };
  }, [history]);

  const chartData = useMemo(() => {
    return history
      .slice()
      .reverse()
      .map((attempt, index) => ({
        attempt: index + 1,
        score: Math.round((attempt.score / attempt.totalQuestions) * 100),
      }));
  }, [history]);

  if (loading) {
    return <div className="profile-loading">Загрузка профиля...</div>;
  }

  if (error) {
    return <div className="profile-error">{error}</div>;
  }

  if (!user) {
    return <div className="profile-error">Пользователь не найден</div>;
  }

  return (
    <div className="profile-page">
      <section className="profile-hero">
        <div className="profile-hero-left">
          <div className="profile-avatar-wrap">
            {avatar ? (
              <img src={avatar} alt="Аватар" className="profile-avatar" />
            ) : (
              <div className="profile-avatar profile-avatar-placeholder">
                {user.name?.charAt(0).toUpperCase()}
              </div>
            )}

            <label className="profile-avatar-btn">
              Изменить фото
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                hidden
              />
            </label>
          </div>

          <div className="profile-main-info">
            <div className="profile-role-badge">
              {user.role === "ADMIN" ? "Администратор" : "Студент"}
            </div>

            <h1 className="profile-title">{user.name}</h1>
            <p className="profile-email">{user.email}</p>

            <div className="profile-actions">
              <button onClick={handleLogout} className="profile-logout-btn">
                Выйти
              </button>
            </div>
          </div>
        </div>

        <div className="profile-progress-card">
          <p className="profile-progress-label">Средний результат</p>
          <div className="profile-progress-value">{stats.averageScore}%</div>

          <div className="profile-progress-bar">
            <div
              className="profile-progress-fill"
              style={{ width: `${stats.averageScore}%` }}
            />
          </div>

          <p className="profile-progress-subtext">
            Лучший результат: {stats.bestResult}%
          </p>
        </div>
      </section>

      <section className="profile-stats-grid">
        <div className="profile-stat-card">
          <span className="profile-stat-label">Пройдено тестов</span>
          <strong className="profile-stat-value">{stats.totalTests}</strong>
        </div>

        <div className="profile-stat-card">
          <span className="profile-stat-label">Правильных ответов</span>
          <strong className="profile-stat-value">{stats.totalCorrect}</strong>
        </div>

        <div className="profile-stat-card">
          <span className="profile-stat-label">Всего вопросов</span>
          <strong className="profile-stat-value">{stats.totalQuestions}</strong>
        </div>

        <div className="profile-stat-card">
          <span className="profile-stat-label">Лучший результат</span>
          <strong className="profile-stat-value">{stats.bestResult}%</strong>
        </div>
      </section>

      <section className="profile-history-card">
        <div className="profile-history-header">
          <h2>Прогресс</h2>
          <span>{history.length} попыток</span>
        </div>

        {chartData.length === 0 ? (
          <div className="profile-empty-state">
            <p>Пока нет данных для построения графика.</p>
          </div>
        ) : (
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="attempt" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" domain={[0, 100]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#06b6d4"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

      <section className="profile-history-card">
        <div className="profile-history-header">
          <h2>История попыток</h2>
          <span>{history.length} записей</span>
        </div>

        {history.length === 0 ? (
          <div className="profile-empty-state">
            <p>Пока нет пройденных тестов.</p>
            <Link to="/" className="profile-start-link">
              Перейти к предметам
            </Link>
          </div>
        ) : (
          <div className="profile-history-list">
            {history.map((attempt) => {
              const percent = Math.round(
                (attempt.score / attempt.totalQuestions) * 100
              );

              return (
                <Link
                  key={attempt.id}
                  to={`/result/${attempt.id}`}
                  className="profile-history-item"
                >
                  <div className="profile-history-top">
                    <strong>{attempt.subject.title}</strong>
                    <span className="profile-history-percent">{percent}%</span>
                  </div>

                  <div className="profile-history-bottom">
                    <span>
                      Результат: {attempt.score} / {attempt.totalQuestions}
                    </span>
                    <span>Открыть результат →</span>
                  </div>

                  <div className="profile-history-bar">
                    <div
                      className="profile-history-fill"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}