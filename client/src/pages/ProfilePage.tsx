import { useEffect, useMemo, useRef, useState } from "react";
import { api } from "../api";
import { Link } from "react-router-dom";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string | null;
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
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const userRes = await api.get("/auth/me");
        setUser(userRes.data);
        setName(userRes.data.name);

        const historyRes = await api.get("/quiz/history");
        setHistory(historyRes.data);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Ошибка загрузки профиля");
      }
    }

    loadProfile();
  }, []);

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

    let totalPercent = 0;
    let best = 0;
    let correct = 0;
    let total = 0;

    history.forEach((a) => {
      const percent = a.totalQuestions ? (a.score / a.totalQuestions) * 100 : 0;
      totalPercent += percent;
      if (percent > best) best = percent;
      correct += a.score;
      total += a.totalQuestions;
    });

    return {
      attempts: history.length,
      avg: Math.round(totalPercent / history.length),
      best: Math.round(best),
      correct,
      total,
    };
  }, [history]);

  async function handleSaveProfile() {
    try {
      setSaving(true);
      const { data } = await api.put("/profile/update", { name });
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
    } catch (err: any) {
      setError(err?.response?.data?.message || "Ошибка обновления профиля");
    } finally {
      setSaving(false);
    }
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("avatar", file);

      const { data } = await api.post("/profile/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
    } catch (err: any) {
      setError(err?.response?.data?.message || "Ошибка загрузки фото");
    } finally {
      setUploading(false);
    }
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
    <div className="profile-page">
      <div className="profile-card profile-top">
        <div className="profile-header">
          <div className="profile-avatar-wrap">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt="avatar"
                className="profile-avatar"
              />
            ) : (
              <div className="profile-avatar profile-avatar-placeholder">
                {user.name?.charAt(0).toUpperCase()}
              </div>
            )}

            <button
              className="btn-outline"
              type="button"
              onClick={() => fileInputRef.current?.click()}
            >
              {uploading ? "Загрузка..." : "Изменить фото"}
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleAvatarChange}
            />
          </div>

          <div className="profile-info-block">
            <h1>Профиль</h1>

            <label className="profile-label">Имя</label>
            <input
              className="profile-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <label className="profile-label">Email</label>
            <div className="profile-static">{user.email}</div>

            <label className="profile-label">Роль</label>
            <div className="profile-static">{user.role}</div>

            <div className="profile-buttons">
              <button className="btn-primary" onClick={handleSaveProfile}>
                {saving ? "Сохранение..." : "Сохранить"}
              </button>

              <button className="btn-danger" onClick={handleLogout}>
                Выйти
              </button>
            </div>
          </div>
        </div>
      </div>

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
                  <div>Результат: {attempt.score} / {attempt.totalQuestions}</div>
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