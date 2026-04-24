import { useEffect, useMemo, useState, type FormEvent } from "react";
import { api } from "../api";

type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type Attempt = {
  id: string;
  score: number;
  totalQuestions: number;
  createdAt: string;
  subject?: {
    title: string;
  };
};

function calcPercent(score: number, total: number) {
  if (!total) return 0;
  return Math.round((score / total) * 100);
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [name, setName] = useState("");
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const [p, h] = await Promise.all([
        api.get("/profile"),
        api.get("/quiz/history"),
      ]);

      setProfile(p.data);
      setName(p.data.name);
      setAttempts(h.data);
    }

    load();
  }, []);

  const stats = useMemo(() => {
    const total = attempts.length;

    if (!total)
      return { attempts: 0, avg: 0, best: 0, correct: 0, totalQ: 0 };

    const percents = attempts.map((a) =>
      calcPercent(a.score, a.totalQuestions)
    );

    return {
      attempts: total,
      avg: Math.round(percents.reduce((a, b) => a + b, 0) / total),
      best: Math.max(...percents),
      correct: attempts.reduce((s, a) => s + a.score, 0),
      totalQ: attempts.reduce((s, a) => s + a.totalQuestions, 0),
    };
  }, [attempts]);

  async function save(e: FormEvent) {
    e.preventDefault();
    setSaving(true);

    const res = await api.put("/profile", { name });
    setProfile(res.data);

    setSaving(false);
  }

  function logout() {
    localStorage.clear();
    window.location.href = "/login";
  }

  return (
    <div className="profile-page">

      {/* TOP CARD */}
      <section className="profile-hero-card">
        <div className="profile-left">
          <div className="profile-avatar-fallback">
            {profile?.name?.[0] || "U"}
          </div>
        </div>

        <div className="profile-right">
          <h1 className="profile-title">Профиль</h1>

          <form onSubmit={save} className="profile-form">
            <div className="profile-field">
              <label>Имя</label>
              <input value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="profile-field">
              <label>Email</label>
              <input value={profile?.email || ""} disabled />
            </div>

            <div className="profile-field">
              <label>Роль</label>
              <input value={profile?.role || ""} disabled />
            </div>

            {/* 🔥 КНОПКИ */}
            <div className="profile-actions">
              <button className="profile-primary-button" disabled={saving}>
                {saving ? "..." : "Сохранить"}
              </button>

              <a href="/mistakes" className="profile-outline-button">
                Мои ошибки
              </a>

              <button
                type="button"
                className="profile-danger-button"
                onClick={logout}
              >
                Выйти
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* STATS */}
      <section className="profile-stats-grid">
        <div className="profile-stat-card">
          <div>Попыток</div>
          <h2>{stats.attempts}</h2>
        </div>

        <div className="profile-stat-card">
          <div>Средний</div>
          <h2>{stats.avg}%</h2>
        </div>

        <div className="profile-stat-card">
          <div>Лучший</div>
          <h2>{stats.best}%</h2>
        </div>

        <div className="profile-stat-card">
          <div>Ответы</div>
          <h2>{stats.correct}/{stats.totalQ}</h2>
        </div>
      </section>
    </div>
  );
}