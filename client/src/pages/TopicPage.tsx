import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api";

type Topic = {
  id: string;
  title: string;
  slug: string;
  content: string;
  subject: {
    title: string;
    slug: string;
    icon: string;
  };
};

export default function TopicPage() {
  const { slug } = useParams();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTopic() {
      try {
        const { data } = await api.get(`/topics/${slug}`);
        setTopic(data);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Ошибка загрузки темы");
      } finally {
        setLoading(false);
      }
    }

    loadTopic();
  }, [slug]);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p style={{ color: "crimson" }}>{error}</p>;
  if (!topic) return <p>Тема не найдена</p>;

  return (
    <div className="page-card">
      <Link to={`/subject/${topic.subject.slug}`} className="back-link">
        ← Назад к предмету
      </Link>

      <h1 className="page-heading">
        {topic.subject.icon} {topic.title}
      </h1>

      <p className="page-subtext">Предмет: {topic.subject.title}</p>

      <div
        className="page-card"
        style={{
          marginTop: "1.5rem",
          lineHeight: 1.8,
          whiteSpace: "pre-line",
          background: "rgba(255,255,255,0.03)",
        }}
      >
        {topic.content}
      </div>

      <div style={{ marginTop: "1.5rem" }}>
        <Link to={`/quiz/${topic.subject.slug}`} className="btn-primary">
          Перейти к тесту
        </Link>
      </div>
    </div>
  );
}