import { useEffect, useState } from "react";
import { api } from "../api";

type Mistake = {
  id: string;
  question: string;
  explanation?: string;
  selected?: string;
  correct?: string;
};

export default function MistakesPage() {
  const [data, setData] = useState<Mistake[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/quiz/mistakes")
      .then(res => setData(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="profile-page">Загрузка...</div>;

  return (
    <div className="profile-page">
      <h1>❌ Мои ошибки</h1>

      {data.length === 0 ? (
        <p>Нет ошибок 🎉</p>
      ) : (
        <div className="attempt-answers-list">
          {data.map((item, i) => (
            <div key={item.id} className="attempt-answer-card wrong">
              
              <div className="attempt-answer-number">
                Вопрос {i + 1}
              </div>

              <div className="attempt-question-text">
                {item.question}
              </div>

              <div className="attempt-answer-block">
                <span className="attempt-answer-label">Твой ответ:</span>
                <div className="attempt-answer-value">
                  {item.selected || "нет"}
                </div>
              </div>

              <div className="attempt-answer-block">
                <span className="attempt-answer-label">Правильный:</span>
                <div className="attempt-answer-value correct-text">
                  {item.correct}
                </div>
              </div>

              {item.explanation && (
                <div className="attempt-answer-block">
                  <span className="attempt-answer-label">Пояснение:</span>
                  <div className="attempt-answer-value">
                    {item.explanation}
                  </div>
                </div>
              )}

            </div>
          ))}
        </div>
      )}
    </div>
  );
}