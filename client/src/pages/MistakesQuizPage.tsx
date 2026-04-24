import { useEffect, useMemo, useState } from "react";
import { api } from "../api";

type Option = {
  id: string;
  optionText: string;
  isCorrect: boolean;
};

type Question = {
  id: string;
  questionText: string;
  explanation?: string | null;
  options: Option[];
};

export default function MistakesQuizPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/quiz/mistakes-quiz")
      .then((res) => setQuestions(res.data))
      .finally(() => setLoading(false));
  }, []);

  const score = useMemo(() => {
    return questions.reduce((sum, q) => {
      const selectedId = selected[q.id];
      const option = q.options.find((o) => o.id === selectedId);
      return option?.isCorrect ? sum + 1 : sum;
    }, 0);
  }, [questions, selected]);

  if (loading) return <div className="quiz-page-wrap">Загрузка...</div>;

  if (questions.length === 0) {
    return (
      <div className="quiz-page-wrap">
        <div className="quiz-card">
          <h1>Ошибок нет 🎉</h1>
          <p>Сначала пройди тесты, чтобы появились вопросы для повторения.</p>
          <a href="/tests" className="btn-primary">К тестам</a>
        </div>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="quiz-page-wrap">
        <div className="quiz-card">
          <h1>Результат повторения</h1>
          <div className="result-score">
            {score} / {questions.length}
          </div>

          <div className="result-actions">
            <button
              className="btn-primary"
              onClick={() => {
                setSelected({});
                setCurrent(0);
                setFinished(false);
              }}
            >
              Повторить ещё раз
            </button>

            <a href="/profile" className="btn-outline">
              В профиль
            </a>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[current];
  const selectedId = selected[question.id];

  return (
    <div className="quiz-page-wrap">
      <div className="quiz-card">
        <a href="/profile" className="back-link">← Назад в профиль</a>

        <div className="quiz-topbar">
          <div>
            <h1 className="quiz-title">Повтор ошибок</h1>
            <p className="quiz-subtitle">
              Вопрос {current + 1} из {questions.length}
            </p>
          </div>

          <div className="quiz-counter-badge">
            {current + 1}/{questions.length}
          </div>
        </div>

        <div className="quiz-question-box">
          <div className="quiz-question-label">Вопрос</div>
          <div className="quiz-question">{question.questionText}</div>
        </div>

        <div className="quiz-options">
          {question.options.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`quiz-option ${selectedId === option.id ? "selected" : ""}`}
              onClick={() =>
                setSelected((prev) => ({
                  ...prev,
                  [question.id]: option.id,
                }))
              }
            >
              {option.optionText}
            </button>
          ))}
        </div>

        <div className="quiz-actions">
          <button
            className="btn-outline"
            disabled={current === 0}
            onClick={() => setCurrent((prev) => prev - 1)}
          >
            Назад
          </button>

          {current === questions.length - 1 ? (
            <button
              className="btn-primary"
              disabled={!selectedId}
              onClick={() => setFinished(true)}
            >
              Завершить
            </button>
          ) : (
            <button
              className="btn-primary"
              disabled={!selectedId}
              onClick={() => setCurrent((prev) => prev + 1)}
            >
              Далее
            </button>
          )}
        </div>
      </div>
    </div>
  );
}