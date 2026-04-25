import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { api } from "../api";

type UserProfile = {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  avatarUrl?: string | null;
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

function getLocalUser(): UserProfile {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    return {};
  }
}

function extractUser(data: any): UserProfile {
  return (
    data?.user ||
    data?.profile?.user ||
    data?.profile ||
    data?.data?.user ||
    data?.data ||
    data ||
    {}
  );
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>({});
  const [name, setName] = useState("");
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      setLoading(true);

      const localUser = getLocalUser();
      let serverUser: UserProfile = {};

      try {
        const meRes = await api.get("/auth/me");
        serverUser = extractUser(meRes.data);
      } catch {
        try {
          const profileRes = await api.get("/profile");
          serverUser = extractUser(profileRes.data);
        } catch {
          serverUser = {};
        }
      }

      const mergedUser: UserProfile = {
        ...localUser,
        ...serverUser,
      };

      setProfile(mergedUser);
      setName(mergedUser.name || "");

      try {
        const historyRes = await api.get("/quiz/history");
        const history = Array.isArray(historyRes.data)
          ? historyRes.data
          : historyRes.data?.attempts || historyRes.data?.data || [];

        setAttempts(history);
      } catch {
        setAttempts([]);
      }
    } catch (error) {
      console.error("Profile load error:", error);
    } finally {
      setLoading(false);
    }
  }

  const stats = useMemo(() => {
    if (!attempts.length) {
      return {
        attempts: 0,
        avg: 0,
        best: 0,
        correct: 0,
        totalQ: 0,
      };
    }

    const percents = attempts.map((a) =>
      calcPercent(a.score, a.totalQuestions)
    );

    return {
      attempts: attempts.length,
      avg: Math.round(percents.reduce((a, b) => a + b, 0) / attempts.length),
      best: Math.max(...percents),
      correct: attempts.reduce((s, a) => s + a.score, 0),
      totalQ: attempts.reduce((s, a) => s + a.totalQuestions, 0),
    };
  }, [attempts]);

  async function save(e: FormEvent) {
    e.preventDefault();

    try {
      setSaving(true);

      let updated: UserProfile = {
        ...profile,
        name,
      };

      try {
        const res = await api.put("/profile", { name });
        updated = {
          ...updated,
          ...extractUser(res.data),
        };
      } catch {
        console.warn("Profile update saved only locally");
      }

      setProfile(updated);
      localStorage.setItem("user", JSON.stringify(updated));
      alert("Профиль сохранён");
    } catch {
      alert("Ошибка сохранения профиля");
    } finally {
      setSaving(false);
    }
  }

  async function uploadAvatar(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      setUploading(true);

      const res = await api.post("/profile/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const avatarUrl = res.data.avatarUrl;

      const updated = {
        ...profile,
        avatarUrl,
      };

      setProfile(updated);
      localStorage.setItem("user", JSON.stringify(updated));
    } catch (error) {
      console.error("Avatar upload error:", error);
      alert("Ошибка загрузки фото");
    } finally {
      setUploading(false);
    }
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.clear();
    window.location.href = "/login";
  }

  if (loading) {
    return (
      <div className="profile-page">
        <section className="profile-hero-card">
          <h1 className="profile-title">Загрузка...</h1>
        </section>
      </div>
    );
  }

  const displayName = name || profile.name || "";
  const displayEmail = profile.email || "";
  const displayRole = profile.role || "STUDENT";

  return (
    <div className="profile-page">
      <section className="profile-hero-card">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "14px",
            minWidth: "170px",
          }}
        >
          <div className="profile-avatar-fallback">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt="avatar"
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            ) : (
              displayName?.[0]?.toUpperCase() || "U"
            )}
          </div>

          <label
            style={{
              display: "inline-block",
              padding: "10px 16px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #7c5cff, #23c4ff)",
              color: "white",
              fontWeight: 700,
              cursor: "pointer",
              fontSize: "14px",
              textAlign: "center",
            }}
          >
            {uploading ? "Загрузка..." : "Загрузить фото"}
            <input
              type="file"
              accept="image/*"
              hidden
              disabled={uploading}
              onChange={uploadAvatar}
            />
          </label>
        </div>

        <div className="profile-right">
          <h1 className="profile-title">Профиль</h1>

          <form onSubmit={save} className="profile-form">
            <div className="profile-field">
              <label>Имя</label>
              <input
                value={displayName}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ваше имя"
              />
            </div>

            <div className="profile-field">
              <label>Email</label>
              <input value={displayEmail} disabled />
            </div>

            <div className="profile-field">
              <label>Роль</label>
              <input value={displayRole} disabled />
            </div>

            <div className="profile-actions">
              <button className="profile-primary-button" disabled={saving}>
                {saving ? "Сохранение..." : "Сохранить"}
              </button>

              <a href="/mistakes" className="profile-outline-button">
                Мои ошибки
              </a>

              <a href="/mistakes-quiz" className="profile-outline-button">
                Повторить ошибки
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
          <h2>
            {stats.correct}/{stats.totalQ}
          </h2>
        </div>
      </section>
    </div>
  );
}