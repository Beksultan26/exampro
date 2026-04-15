import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

type Subject = {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon?: string | null;
  color?: string | null;
  group: string;
  _count: {
    topics: number;
    questions: number;
  };
};

export default function HomePage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSubjects() {
      try {
        const { data } = await api.get("/subjects");
        setSubjects(data);
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Ошибка загрузки предметов"
        );
      } finally {
        setLoading(false);
      }
    }

    loadSubjects();
  }, []);

  const grouped = useMemo(() => {
    return {
      basic: subjects.filter((s) => s.group === "basic"),
      professional: subjects.filter((s) => s.group === "professional"),
      applied: subjects.filter((s) => s.group === "applied"),
    };
  }, [subjects]);

  const totalQuestions = useMemo(() => {
    return subjects.reduce((sum, item) => sum + (item._count?.questions ?? 0), 0);
  }, [subjects]);

  const totalTopics = useMemo(() => {
    return subjects.reduce((sum, item) => sum + (item._count?.topics ?? 0), 0);
  }, [subjects]);

  function renderCards(items: Subject[]) {
    if (items.length === 0) {
      return <p className="page-subtext">Пока нет доступных дисциплин.</p>;
    }

    return (
      <div className="topics-grid">
        {items.map((subject) => (
          <Link
            key={subject.id}
            to={`/subject/${subject.slug}`}
            className="topic-card"
            style={{ ["--card-color" as any]: subject.color || "#06b6d4" }}
          >
            <div className="topic-icon">{subject.icon || "📘"}</div>
            <div className="topic-title">{subject.title}</div>
            <div className="topic-desc">{subject.description}</div>

            <div className="topic-meta">
              <span className="badge badge-theory">
                📖 {subject._count?.topics ?? 0} тем
              </span>
              <span className="badge badge-test">
                ✏️ {subject._count?.questions ?? 0} вопросов
              </span>
            </div>
          </Link>
        ))}
      </div>
    );
  }

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p style={{ color: "crimson" }}>{error}</p>;

  return (
    <div>
      <div className="hero">
        <div className="hero-badge">Подготовка к экзаменам</div>

        <h1>
          Освой ИТ-дисциплины
          <br />
          <span className="highlight">раз и навсегда</span>
        </h1>

        <p>
          Теория, тесты и практика по дисциплинам IT-специальности. Всё, что
          нужно для подготовки к экзаменам и проверке знаний в одном месте.
        </p>

        <div className="hero-actions">
          <Link className="btn-primary" to="/tests">
            Начать обучение
          </Link>
          <Link className="btn-outline" to="/theory">
            Изучить теорию
          </Link>
        </div>

        <div className="stats-row">
          <div className="stat">
            <div className="stat-num">{subjects.length}</div>
            <div className="stat-label">Дисциплин</div>
          </div>

          <div className="stat">
            <div className="stat-num">{totalTopics}</div>
            <div className="stat-label">Тем</div>
          </div>

          <div className="stat">
            <div className="stat-num">{totalQuestions}</div>
            <div className="stat-label">Вопросов</div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <div className="section-label">Разделы</div>
          <div className="section-title">Выбери тему для изучения</div>
        </div>

        <h3 className="group-title">Базовые дисциплины</h3>
        {renderCards(grouped.basic)}

        <h3 className="group-title">Профессиональные дисциплины</h3>
        {renderCards(grouped.professional)}

        <h3 className="group-title">Прикладные дисциплины</h3>
        {renderCards(grouped.applied)}
      </div>
      <footer className="site-footer">
  <div className="footer-content">
    <h3>ExamPrep PRO</h3>
    <p>
      Платформа для подготовки к экзаменам по IT-дисциплинам
    </p>
  </div>

  <div className="footer-bottom">
    © 2026 ExamPrep PRO
  </div>
</footer>
    </div>
  );
}