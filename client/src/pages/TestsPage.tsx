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

export default function TestsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [groupFilter, setGroupFilter] = useState<
    "all" | "basic" | "professional" | "applied"
  >("all");

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

  const regularSubjects = useMemo(() => {
    return subjects.filter((s) => s.slug !== "general-exam");
  }, [subjects]);

  const filteredSubjects = useMemo(() => {
    return regularSubjects.filter((s) => {
      const matchesSearch =
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.description.toLowerCase().includes(search.toLowerCase());

      const matchesGroup =
        groupFilter === "all" ? true : s.group === groupFilter;

      return matchesSearch && matchesGroup;
    });
  }, [regularSubjects, search, groupFilter]);

  const grouped = useMemo(() => {
    return {
      basic: filteredSubjects.filter((s) => s.group === "basic"),
      professional: filteredSubjects.filter((s) => s.group === "professional"),
      applied: filteredSubjects.filter((s) => s.group === "applied"),
    };
  }, [filteredSubjects]);

  function renderCards(items: Subject[]) {
    if (items.length === 0) {
      return <p className="page-subtext">Пока нет доступных тестов.</p>;
    }

    return (
      <div className="topics-grid">
        {items.map((subject) => (
          <div
            key={subject.id}
            className="topic-card"
            style={{ ["--card-color" as any]: subject.color || "#06b6d4" }}
          >
            <div className="topic-icon">{subject.icon || "📝"}</div>
            <div className="topic-title">{subject.title}</div>
            <div className="topic-desc">
              Пройти тест по дисциплине и проверить уровень знаний
            </div>

            <div className="topic-meta">
              <span className="badge badge-theory">
                📖 {subject._count?.topics ?? 0} тем
              </span>
              <span className="badge badge-test">
                ✏️ {subject._count?.questions ?? 0} вопросов
              </span>
            </div>

            <div className="tests-card-actions">
              <Link to={`/quiz/${subject.slug}`} className="btn-primary">
                Пройти тест
              </Link>

              <Link
                to={`/quiz/${subject.slug}?mode=exam`}
                className="btn-primary"
              >
                Экзамен
              </Link>

              <Link
                to={`/quiz/${subject.slug}?mode=mistakes`}
                className="btn-outline"
              >
                Ошибки
              </Link>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p style={{ color: "crimson" }}>{error}</p>;

  return (
    <div className="section">
      <div className="hero">
        <div className="hero-badge">Раздел тестирования</div>

        <h1>
          Проверяй знания
          <br />
          <span className="highlight">по всем дисциплинам</span>
        </h1>

        <p>
          Выбирай предмет, проходи тестирование и отслеживай свой прогресс в
          личном профиле.
        </p>

        <div className="hero-actions">
          <Link className="btn-primary" to="/exam">
            🎯 Общий экзамен
          </Link>
        </div>
      </div>

      <div className="filters-bar">
        <input
          className="search-input"
          placeholder="Поиск по тестам..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="filter-chips">
          <button
            className={`filter-chip ${groupFilter === "all" ? "active" : ""}`}
            onClick={() => setGroupFilter("all")}
          >
            Все
          </button>

          <button
            className={`filter-chip ${groupFilter === "basic" ? "active" : ""}`}
            onClick={() => setGroupFilter("basic")}
          >
            Базовые
          </button>

          <button
            className={`filter-chip ${
              groupFilter === "professional" ? "active" : ""
            }`}
            onClick={() => setGroupFilter("professional")}
          >
            Профессиональные
          </button>

          <button
            className={`filter-chip ${groupFilter === "applied" ? "active" : ""}`}
            onClick={() => setGroupFilter("applied")}
          >
            Прикладные
          </button>
        </div>
      </div>

      <h3 className="group-title">Базовые дисциплины</h3>
      {renderCards(grouped.basic)}

      <h3 className="group-title">Профессиональные дисциплины</h3>
      {renderCards(grouped.professional)}

      <h3 className="group-title">Прикладные дисциплины</h3>
      {renderCards(grouped.applied)}
    </div>
  );
}