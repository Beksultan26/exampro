import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "./api";

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

  useEffect(() => {
    async function load() {
      const { data } = await api.get(`/subjects/${slug}`);
      setSubject(data);
      setLoading(false);
    }

    load();
  }, [slug]);

  if (loading) return <p>Загрузка...</p>;
  if (!subject) return <p>Предмет не найден</p>;

  return (
    <div>
      <h1>{subject.title}</h1>

      <p style={{ color: "#64748b", marginBottom: "20px" }}>
        {subject.description}
      </p>

      <h2>Темы</h2>

      <div style={{ display: "grid", gap: "12px", marginTop: "12px" }}>
        {subject.topics.map((topic) => (
          <Link
            key={topic.id}
            to={`/topic/${topic.slug}`}
            style={{
              background: "#fff",
              padding: "16px",
              borderRadius: "12px",
              textDecoration: "none",
              color: "#0f172a",
              boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            }}
          >
            {topic.order}. {topic.title}
          </Link>
        ))}
      </div>

      <div style={{ marginTop: "30px" }}>
        <Link
          to={`/quiz/${subject.slug}`}
          style={{
            padding: "12px 20px",
            background: "#2563eb",
            color: "white",
            borderRadius: "8px",
            textDecoration: "none",
          }}
        >
          Пройти тест ({subject._count.questions} вопросов)
        </Link>
      </div>
    </div>
  );
}