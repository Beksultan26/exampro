import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { api } from "../api";

type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string | null;
};

type Attempt = {
  id: string;
  score: number;
  totalQuestions: number;
  createdAt: string;
  subject?: {
    title: string;
    slug: string;
  };
};

function getInitial(name?: string) {
  return (name || "U").trim().charAt(0).toUpperCase();
}

function formatDate(value: string) {
  const date = new Date(value);
  return date.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function calcPercent(score: number, total: number) {
  if (!total) return 0;
  return Math.round((score / total) * 100);
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [name, setName] = useState("");
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const [profileRes, historyRes] = await Promise.all([
          api.get("/profile"),
          api.get("/quiz/history"),
        ]);

        const profileData = profileRes.data;
        const attemptsData = Array.isArray(historyRes.data) ? historyRes.data : [];

        setProfile(profileData);
        setName(profileData?.name || "");
        setAttempts(attemptsData);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Не удалось загрузить профиль");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const stats = useMemo(() => {
    const totalAttempts = attempts.length;

    if (!totalAttempts) {
      return {
        attempts: 0,
        average: 0,
        best: 0,
        correct: 0,
        total: 0,
      };
    }

    const percents = attempts.map((item) =>
      calcPercent(item.score, item.totalQuestions)
    );

    const average = Math.round(
      percents.reduce((sum, item) => sum + item, 0) / totalAttempts
    );

    const best = Math.max(...percents);
    const correct = attempts.reduce((sum, item) => sum + item.score, 0);
    const total = attempts.reduce((sum, item) => sum + item.totalQuestions, 0);

    return {
      attempts: totalAttempts,
      average,
      best,
      correct,
      total,
    };
  }, [attempts]);

  async function handleSave(e: FormEvent) {
    e.preventDefault();

    if (!profile) return;
    if (!name.trim()) {
      setError("Введите имя");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const { data } = await api.put("/profile", {
        name: name.trim(),
      });

      setProfile(data);
      setName(data?.name || "");
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...(JSON.parse(localStorage.getItem("user") || "{}")),
          ...data,
        })
      );

      setMessage("Профиль сохранён");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Не удалось сохранить профиль");
    } finally {
      setSaving(false);
    }
  }

  async function handlePhotoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setError("");
      setMessage("");

      const formData = new FormData();
      formData.append("avatar", file);

      const { data } = await api.post("/profile/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setProfile((prev) =>
        prev
          ? {
              ...prev,
              avatarUrl: data?.avatarUrl || prev.avatarUrl,
            }
          : prev
      );

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...(JSON.parse(localStorage.getItem("user") || "{}")),
          avatarUrl: data?.avatarUrl || "",
        })
      );

      setMessage("Фото обновлено");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Не удалось обновить фото");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.clear();
    window.location.href = "/login";
  }

  if (loading) {
    return <div className="profile-page"><p>Загрузка...</p></div>;
  }

  if (error && !profile) {
    return (
      <div className="profile-page">
        <p style={{ color: "crimson" }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      {message && <div className="profile-alert success">{message}</div>}
      {error && <div className="profile-alert error">{error}</div>}

      <section className="profile-hero-card">
        <div className="profile-left">
          <div className="profile-avatar-wrap">
            {profile?.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt="Аватар"
                className="profile-avatar-image"
              />
            ) : (
              <div className="profile-avatar-fallback">
                {getInitial(profile?.name)}
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            style={{ display: "none" }}
          />

          <button
            type="button"
            className="profile-outline-button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? "Загрузка..." : "Изменить фото"}
          </button>
        </div>

        <div className="profile-right">
          <div className="profile-heading-row">
            <div>
              <h1 className="profile-title">Профиль</h1>
              <p className="profile-subtitle">
                Управление личными данными и просмотр результатов тестирования
              </p>
            </div>
          </div>

          <form onSubmit={handleSave} className="profile-form">
            <div className="profile-field">
              <label>Имя</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Введите имя"
              />
            </div>

            <div className="profile-field">
              <label>Email</label>
              <input value={profile?.email || ""} disabled />
            </div>

            <div className="profile-field">
              <label>Роль</label>
              <input value={profile?.role || ""} disabled />
            </div>

            <div className="profile-actions">
              <button type="submit" className="profile-primary-button" disabled={saving}>
                {saving ? "Сохранение..." : "Сохранить"}
              </button>

              <button
                type="button"
                className="profile-danger-button"
                onClick={handleLogout}
              >
                Выйти
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="profile-stats-grid">
        <div className="profile-stat-card">
          <div className="profile-stat-label">Попыток</div>
          <div className="profile-stat-value">{stats.attempts}</div>
        </div>

        <div className="profile-stat-card">
          <div className="profile-stat-label">Средний результат</div>
          <div className="profile-stat-value">{stats.average}%</div>
        </div>

        <div className="profile-stat-card">
          <div className="profile-stat-label">Лучший результат</div>
          <div className="profile-stat-value">{stats.best}%</div>
        </div>

        <div className="profile-stat-card">
          <div className="profile-stat-label">Правильных ответов</div>
          <div className="profile-stat-value">
            {stats.correct} / {stats.total}
          </div>
        </div>
      </section>

      <section className="profile-history-card">
        <div className="profile-history-head">
          <div>
            <h2>История попыток</h2>
            <p>Все пройденные тесты и экзамены</p>
          </div>
        </div>

        {attempts.length === 0 ? (
          <div className="profile-empty-state">
            Пока нет пройденных тестов.
          </div>
        ) : (
          <div className="profile-history-list">
            {attempts.map((attempt) => {
              const percent = calcPercent(attempt.score, attempt.totalQuestions);

              return (
                <div key={attempt.id} className="profile-history-item">
                  <div className="profile-history-main">
                    <div className="profile-history-subject">
                      {attempt.subject?.title || "Без названия"}
                    </div>
                    <div className="profile-history-date">
                      {formatDate(attempt.createdAt)}
                    </div>
                  </div>

                  <div className="profile-history-meta">
                    <div className="profile-history-score">
                      {attempt.score} / {attempt.totalQuestions}
                    </div>
                    <div className="profile-history-badge">
                      {percent}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}