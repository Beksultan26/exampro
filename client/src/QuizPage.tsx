import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "./api";

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
        setError(err?.message || "Ошибка загрузки темы");
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
    <div>
      <Link to={`/subject/${topic.subject.slug}`}>← Назад к предмету</Link>

      <h1 style={{ marginTop: "16px" }}>
        {topic.subject.icon} {topic.title}
      </h1>

      <p style={{ color: "#64748b", marginBottom: "24px" }}>
        Предмет: {topic.subject.title}
      </p>

      <div
        style={{
          background: "#fff",
          padding: "24px",
          borderRadius: "16px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          lineHeight: 1.7,
          whiteSpace: "pre-line",
        }}
      >
        {topic.content}
      </div>
    </div>
  );
}