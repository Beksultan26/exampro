import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api";

type Topic = {
  id: string;
  title: string;
  slug: string;
  order: number;
};

type Subject = {
  id: string;
  title: string;
  slug: string;
  description: string;
  topics: Topic[];
  _count: {
    questions: number;
  };
};

export default function SubjectPage() {
  const { slug } = useParams();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSubject() {
      try {
        const { data } = await api.get(`/subjects/${slug}`);
        setSubject(data);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Ошибка загрузки предмета");
      } finally {
        setLoading(false);
      }
    }

    loadSubject();
  }, [slug]);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p style={{ color: "crimson" }}>{error}</p>;
  if (!subject) return <p>Предмет не найден</p>;

  const isGeneralExam = subject.slug === "general-exam";

  return (
    <div className="page-card">
      <Link to="/" className="back-link">
        ← Назад на главную
      </Link>

      <h1 className="page-heading">{subject.title}</h1>
      <p className="page-subtext">{subject.description}</p>

      {!isGeneralExam && (
        <div className="section">
          <div className="section-label">Темы</div>
          <div className="section-title">Изучение теории</div>

          <div className="topic-list">
            {subject.topics.map((topic) => (
              <Link
                key={topic.id}
                to={`/topic/${topic.slug}`}
                className="topic-link-card"
              >
                {topic.order}. {topic.title}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: "2rem" }}>
        {isGeneralExam ? (
          <Link to="/exam" className="btn-primary">
            Начать общий экзамен
          </Link>
        ) : (
          <Link to={`/quiz/${subject.slug}`} className="btn-primary">
            Пройти тест ({subject._count.questions} вопросов)
          </Link>
        )}
      </div>
    </div>
  );
}