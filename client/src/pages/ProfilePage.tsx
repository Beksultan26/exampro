import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
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

type AttemptAnswer = {
  id: string;
  isCorrect: boolean;
  question: {
    questionText: string;
    explanation?: string | null;
    options: {
      id: string;
      optionText: string;
      isCorrect: boolean;
    }[];
  };
  selectedOption?: {
    id: string;
    optionText: string;
  } | null;
};

type AttemptDetails = {
  id: string;
  score: number;
  totalQuestions: number;
  createdAt: string;
  subject?: {
    title: string;
    slug: string;
  };
  answers: AttemptAnswer[];
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
  const [selectedAttempt, setSelectedAttempt] =
    useState<AttemptDetails | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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
        const attemptsData = Array.isArray(historyRes.data)
          ? historyRes.data
          : [];

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

  const progressData = useMemo(() => {
    return [...attempts].reverse().map((item, index) => ({
      name: `#${index + 1}`,
      percent: calcPercent(item.score, item.totalQuestions),
      subject: item.subject?.title || "Без названия",
    }));
  }, [attempts]);

  const subjectStats = useMemo(() => {
    const map: Record<string, { total: number; correct: number }> = {};

    attempts.forEach((item) => {
      const key = item.subject?.title || "Без названия";

      if (!map[key]) {
        map[key] = { total: 0, correct: 0 };
      }

      map[key].total += item.totalQuestions;
      map[key].correct += item.score;
    });

    return Object.entries(map).map(([subject, data]) => ({
      subject,
      percent: calcPercent(data.correct, data.total),
    }));
  }, [attempts]);

  const pieData = useMemo(
    () => [
      { name: "Правильные", value: stats.correct },
      { name: "Ошибки", value: Math.max(stats.total - stats.correct, 0) },
    ],
    [stats.correct, stats.total]
  );

  async function handleSave(e: FormEvent) {
    e.preventDefault();

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

      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({ ...currentUser, ...data }));

      setMessage("Профиль сохранён");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Не удалось сохранить профиль");
    } finally {
      setSaving(false);
    }
  }

  async function openAttemptDetails(attemptId: string) {
    try {
      setDetailsLoading(true);
      setError("");

      const { data } = await api.get(`/quiz/attempt/${attemptId}`);
      setSelectedAttempt(data);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Не удалось загрузить детали попытки"
      );
    } finally {
      setDetailsLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.clear();
    window.location.href = "/login";
  }

  if (loading) {
    return (
      <div className="profile-page">
        <p>Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      {message && <div className="profile-alert success">{message}</div>}
      {error && <div className="profile-alert error">{error}</div>}

      <section className="profile-hero-card">
        <div className="profile-left">
          <div className="profile-avatar-fallback">
            {getInitial(profile?.name)}
          </div>
        </div>
        <a href="/mistakes" className="profile-primary-button">
  Мои ошибки
</a>

        <div className="profile-right">
          <h1 className="profile-title">Профиль</h1>
          <p className="profile-subtitle">
            Здесь можно увидеть результаты, ошибки и прогресс по тестам
          </p>

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
              <button
                type="submit"
                className="profile-primary-button"
                disabled={saving}
              >
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

      {attempts.length > 0 && (
        <section className="profile-charts-grid">
          <div className="profile-chart-card">
            <h2>Прогресс по попыткам</h2>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="percent"
                  name="Результат %"
                  stroke="#7c6cf2"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="profile-chart-card">
            <h2>Результаты по предметам</h2>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={subjectStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="percent" name="Средний результат %" fill="#38bdf8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="profile-chart-card">
            <h2>Правильные и ошибки</h2>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  label
                >
                  <Cell fill="#22c55e" />
                  <Cell fill="#fb7185" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      <section className="profile-history-card">
        <div className="profile-history-head">
          <div>
            <h2>История попыток</h2>
            <p>Нажми на попытку, чтобы увидеть ошибки и правильные ответы</p>
          </div>
        </div>

        {attempts.length === 0 ? (
          <div className="profile-empty-state">Пока нет пройденных тестов.</div>
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
                    <div className="profile-history-badge">{percent}%</div>
                    <button
                      type="button"
                      className="profile-details-button"
                      onClick={() => openAttemptDetails(attempt.id)}
                    >
                      Подробнее
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {detailsLoading && (
        <section className="profile-history-card" style={{ marginTop: 24 }}>
          <div className="profile-empty-state">Загрузка деталей попытки...</div>
        </section>
      )}

      {selectedAttempt && (
        <section className="profile-history-card" style={{ marginTop: 24 }}>
          <div className="profile-history-head">
            <div>
              <h2>Разбор попытки</h2>
              <p>
                {selectedAttempt.subject?.title || "Без названия"} ·{" "}
                {formatDate(selectedAttempt.createdAt)}
              </p>
            </div>

            <button
              type="button"
              className="profile-close-button"
              onClick={() => setSelectedAttempt(null)}
            >
              Закрыть
            </button>
          </div>

          <div className="attempt-summary">
            Результат: {selectedAttempt.score} /{" "}
            {selectedAttempt.totalQuestions} (
            {calcPercent(selectedAttempt.score, selectedAttempt.totalQuestions)}
            %)
          </div>

          <div className="attempt-answers-list">
            {selectedAttempt.answers.map((answer, index) => {
              const correctOption = answer.question.options.find(
                (o) => o.isCorrect
              );

              return (
                <div
                  key={answer.id}
                  className={`attempt-answer-card ${
                    answer.isCorrect ? "correct" : "wrong"
                  }`}
                >
                  <div className="attempt-answer-top">
                    <div className="attempt-answer-number">
                      Вопрос {index + 1}
                    </div>
                    <div
                      className={`attempt-answer-status ${
                        answer.isCorrect ? "correct" : "wrong"
                      }`}
                    >
                      {answer.isCorrect ? "Верно" : "Ошибка"}
                    </div>
                  </div>

                  <div className="attempt-question-text">
                    {answer.question.questionText}
                  </div>

                  <div className="attempt-answer-block">
                    <span className="attempt-answer-label">Твой ответ:</span>
                    <div className="attempt-answer-value">
                      {answer.selectedOption?.optionText || "Ответ не выбран"}
                    </div>
                  </div>

                  {!answer.isCorrect && (
                    <div className="attempt-answer-block">
                      <span className="attempt-answer-label">
                        Правильный ответ:
                      </span>
                      <div className="attempt-answer-value correct-text">
                        {correctOption?.optionText || "Не найден"}
                      </div>
                    </div>
                  )}

                  {answer.question.explanation && (
                    <div className="attempt-answer-block">
                      <span className="attempt-answer-label">Пояснение:</span>
                      <div className="attempt-answer-value">
                        {answer.question.explanation}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}