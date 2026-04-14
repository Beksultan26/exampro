import { useEffect, useState } from "react";
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

type Question = {
  id: string;
  questionText: string;
  explanation?: string | null;
};

type Topic = {
  id: string;
  title: string;
  content: string;
  order: number;
};

export default function AdminPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSlug, setSelectedSlug] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);

  const [subjectForm, setSubjectForm] = useState({
    title: "",
    slug: "",
    description: "",
    icon: "📘",
    color: "#06b6d4",
    group: "basic",
  });

  const [questionForm, setQuestionForm] = useState({
    subjectSlug: "",
    questionText: "",
    explanation: "",
    options: [
      { optionText: "", isCorrect: true },
      { optionText: "", isCorrect: false },
      { optionText: "", isCorrect: false },
      { optionText: "", isCorrect: false },
    ],
  });

  const [topicForm, setTopicForm] = useState({
    subjectSlug: "",
    title: "",
    content: "",
  });

  async function loadSubjects() {
    try {
      const { data } = await api.get("/admin/subjects");
      setSubjects(data);
    } catch (err: any) {
      setMessage(err?.response?.data?.message || "Ошибка загрузки предметов");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSubjects();
  }, []);

  async function handleCreateSubject(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    try {
      await api.post("/admin/subjects", subjectForm);

      setSubjectForm({
        title: "",
        slug: "",
        description: "",
        icon: "📘",
        color: "#06b6d4",
        group: "basic",
      });

      setMessage("Предмет успешно добавлен");
      loadSubjects();
    } catch (err: any) {
      setMessage(err?.response?.data?.message || "Ошибка создания предмета");
    }
  }

  async function handleUpdateSubject() {
    if (!editingSubject) return;

    try {
      await api.put(`/admin/subjects/${editingSubject.id}`, {
        title: editingSubject.title,
        slug: editingSubject.slug,
        description: editingSubject.description,
        icon: editingSubject.icon,
        color: editingSubject.color,
        group: editingSubject.group,
      });

      setMessage("Предмет обновлён");
      setEditingSubject(null);
      loadSubjects();
    } catch (err: any) {
      setMessage(err?.response?.data?.message || "Ошибка обновления предмета");
    }
  }

  async function handleDeleteSubject(id: string) {
    const ok = confirm("Удалить предмет?");
    if (!ok) return;

    try {
      await api.delete(`/admin/subjects/${id}`);
      setMessage("Предмет удалён");
      setQuestions([]);
      setTopics([]);
      setSelectedSlug("");
      loadSubjects();
    } catch (err: any) {
      setMessage(err?.response?.data?.message || "Ошибка удаления предмета");
    }
  }

  async function handleLoadQuestions(slug: string) {
    setSelectedSlug(slug);

    try {
      const { data } = await api.get(`/admin/subjects/${slug}/questions`);
      setQuestions(data.questions || []);
    } catch (err: any) {
      setMessage(err?.response?.data?.message || "Ошибка загрузки вопросов");
    }
  }

  async function handleLoadTopics(slug: string) {
    setSelectedSlug(slug);

    try {
      const { data } = await api.get(`/admin/subjects/${slug}/topics`);
      setTopics(data.topics || []);
    } catch (err: any) {
      setMessage(err?.response?.data?.message || "Ошибка загрузки тем");
    }
  }

  function handleOptionChange(index: number, value: string) {
    const updated = [...questionForm.options];
    updated[index].optionText = value;
    setQuestionForm({ ...questionForm, options: updated });
  }

  function handleCorrectOption(index: number) {
    const updated = questionForm.options.map((option, i) => ({
      ...option,
      isCorrect: i === index,
    }));

    setQuestionForm({ ...questionForm, options: updated });
  }

  async function handleCreateQuestion(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    try {
      await api.post("/admin/questions", questionForm);

      setMessage("Вопрос успешно добавлен");

      if (questionForm.subjectSlug) {
        await handleLoadQuestions(questionForm.subjectSlug);
      }

      loadSubjects();

      setQuestionForm({
        subjectSlug: questionForm.subjectSlug,
        questionText: "",
        explanation: "",
        options: [
          { optionText: "", isCorrect: true },
          { optionText: "", isCorrect: false },
          { optionText: "", isCorrect: false },
          { optionText: "", isCorrect: false },
        ],
      });
    } catch (err: any) {
      setMessage(err?.response?.data?.message || "Ошибка создания вопроса");
    }
  }

  async function handleUpdateQuestion() {
    if (!editingQuestion) return;

    try {
      await api.put(`/admin/questions/${editingQuestion.id}`, {
        questionText: editingQuestion.questionText,
        explanation: editingQuestion.explanation,
      });

      setMessage("Вопрос обновлён");
      if (selectedSlug) {
        await handleLoadQuestions(selectedSlug);
      }
      setEditingQuestion(null);
      loadSubjects();
    } catch (err: any) {
      setMessage(err?.response?.data?.message || "Ошибка обновления вопроса");
    }
  }

  async function handleDeleteQuestion(id: string) {
    const ok = confirm("Удалить вопрос?");
    if (!ok) return;

    try {
      await api.delete(`/admin/questions/${id}`);
      setMessage("Вопрос удалён");

      if (selectedSlug) {
        await handleLoadQuestions(selectedSlug);
      }

      loadSubjects();
    } catch (err: any) {
      setMessage(err?.response?.data?.message || "Ошибка удаления вопроса");
    }
  }

  async function handleCreateTopic(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    try {
      await api.post("/admin/topics", topicForm);

      setMessage("Тема добавлена");

      if (topicForm.subjectSlug) {
        await handleLoadTopics(topicForm.subjectSlug);
      }

      loadSubjects();

      setTopicForm({
        subjectSlug: topicForm.subjectSlug,
        title: "",
        content: "",
      });
    } catch (err: any) {
      setMessage(err?.response?.data?.message || "Ошибка создания темы");
    }
  }

  async function handleUpdateTopic() {
    if (!editingTopic) return;

    try {
      await api.put(`/admin/topics/${editingTopic.id}`, {
        title: editingTopic.title,
        content: editingTopic.content,
      });

      setMessage("Тема обновлена");

      if (selectedSlug) {
        await handleLoadTopics(selectedSlug);
      }

      setEditingTopic(null);
      loadSubjects();
    } catch (err: any) {
      setMessage(err?.response?.data?.message || "Ошибка обновления темы");
    }
  }

  async function handleDeleteTopic(id: string) {
    const ok = confirm("Удалить тему?");
    if (!ok) return;

    try {
      await api.delete(`/admin/topics/${id}`);
      setMessage("Тема удалена");

      if (selectedSlug) {
        await handleLoadTopics(selectedSlug);
      }
    } catch (err: any) {
      setMessage(err?.response?.data?.message || "Ошибка удаления темы");
    }
  }

  if (loading) return <p>Загрузка админки...</p>;

  return (
    <div className="admin-page">
      <div className="admin-card">
        <h1>Админ панель</h1>
        <p className="page-subtext">Управление предметами, вопросами и темами</p>
        {message && <div className="admin-message">{message}</div>}
      </div>

      <div className="admin-grid">
        <div className="admin-card">
          <h2>Добавить предмет</h2>

          <form className="admin-form" onSubmit={handleCreateSubject}>
            <input
              placeholder="Название"
              value={subjectForm.title}
              onChange={(e) =>
                setSubjectForm({ ...subjectForm, title: e.target.value })
              }
            />

            <input
              placeholder="Slug"
              value={subjectForm.slug}
              onChange={(e) =>
                setSubjectForm({ ...subjectForm, slug: e.target.value })
              }
            />

            <input
              placeholder="Описание"
              value={subjectForm.description}
              onChange={(e) =>
                setSubjectForm({ ...subjectForm, description: e.target.value })
              }
            />

            <input
              placeholder="Иконка"
              value={subjectForm.icon}
              onChange={(e) =>
                setSubjectForm({ ...subjectForm, icon: e.target.value })
              }
            />

            <input
              type="color"
              value={subjectForm.color}
              onChange={(e) =>
                setSubjectForm({ ...subjectForm, color: e.target.value })
              }
            />

            <select
              value={subjectForm.group}
              onChange={(e) =>
                setSubjectForm({ ...subjectForm, group: e.target.value })
              }
            >
              <option value="basic">Базовые</option>
              <option value="professional">Профессиональные</option>
              <option value="applied">Прикладные</option>
            </select>

            <button type="submit" className="btn-primary">
              Добавить предмет
            </button>
          </form>
        </div>

        <div className="admin-card">
          <h2>Добавить вопрос</h2>

          <form className="admin-form" onSubmit={handleCreateQuestion}>
            <select
              value={questionForm.subjectSlug}
              onChange={(e) =>
                setQuestionForm({ ...questionForm, subjectSlug: e.target.value })
              }
            >
              <option value="">Выбери предмет</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.slug}>
                  {subject.title}
                </option>
              ))}
            </select>

            <textarea
              className="admin-textarea"
              placeholder="Текст вопроса"
              value={questionForm.questionText}
              onChange={(e) =>
                setQuestionForm({
                  ...questionForm,
                  questionText: e.target.value,
                })
              }
            />

            <textarea
              className="admin-textarea"
              placeholder="Пояснение (необязательно)"
              value={questionForm.explanation}
              onChange={(e) =>
                setQuestionForm({
                  ...questionForm,
                  explanation: e.target.value,
                })
              }
            />

            <div className="admin-options">
              {questionForm.options.map((option, index) => (
                <div key={index} className="admin-option-row">
                  <input
                    placeholder={`Вариант ${index + 1}`}
                    value={option.optionText}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                  />

                  <label className="admin-radio-label">
                    <input
                      type="radio"
                      name="correctOption"
                      checked={option.isCorrect}
                      onChange={() => handleCorrectOption(index)}
                    />
                    Правильный
                  </label>
                </div>
              ))}
            </div>

            <button type="submit" className="btn-primary">
              Добавить вопрос
            </button>
          </form>
        </div>
      </div>

      <div className="admin-grid">
        <div className="admin-card">
          <h2>Добавить тему (теория)</h2>

          <form className="admin-form" onSubmit={handleCreateTopic}>
            <select
              value={topicForm.subjectSlug}
              onChange={(e) =>
                setTopicForm({ ...topicForm, subjectSlug: e.target.value })
              }
            >
              <option value="">Выбери предмет</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.slug}>
                  {subject.title}
                </option>
              ))}
            </select>

            <input
              placeholder="Название темы"
              value={topicForm.title}
              onChange={(e) =>
                setTopicForm({ ...topicForm, title: e.target.value })
              }
            />

            <textarea
              className="admin-textarea"
              placeholder="Текст теории"
              value={topicForm.content}
              onChange={(e) =>
                setTopicForm({ ...topicForm, content: e.target.value })
              }
            />

            <button type="submit" className="btn-primary">
              Добавить тему
            </button>
          </form>
        </div>

        <div className="admin-card">
          <h2>Темы предмета {selectedSlug ? `: ${selectedSlug}` : ""}</h2>

          {!selectedSlug ? (
            <p className="page-subtext">Выбери предмет, чтобы посмотреть темы.</p>
          ) : topics.length === 0 ? (
            <p className="page-subtext">Тем пока нет.</p>
          ) : (
            <div className="admin-list">
              {topics.map((topic, index) => (
                <div key={topic.id} className="admin-item">
                  <div>
                    <strong>
                      {index + 1}. {topic.title}
                    </strong>
                    <div className="admin-subtext">Порядок: {topic.order}</div>
                  </div>

                  <div className="admin-actions">
                    <button
                      className="btn-outline"
                      onClick={() => setEditingTopic(topic)}
                    >
                      Редактировать
                    </button>

                    <button
                      className="btn-outline"
                      onClick={() => handleDeleteTopic(topic.id)}
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="admin-card">
        <h2>Список предметов</h2>

        <div className="admin-list">
          {subjects.map((subject) => (
            <div key={subject.id} className="admin-item">
              <div>
                <strong>{subject.title}</strong>
                <div className="admin-subtext">
                  {subject.slug} · {subject._count.topics} тем ·{" "}
                  {subject._count.questions} вопросов
                </div>
              </div>

              <div className="admin-actions">
                <button
                  className="btn-outline"
                  onClick={() => setEditingSubject(subject)}
                >
                  Редактировать
                </button>

                <button
                  className="btn-outline"
                  onClick={() => handleLoadQuestions(subject.slug)}
                >
                  Вопросы
                </button>

                <button
                  className="btn-outline"
                  onClick={() => handleLoadTopics(subject.slug)}
                >
                  Темы
                </button>

                <button
                  className="btn-outline"
                  onClick={() => handleDeleteSubject(subject.id)}
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="admin-card">
        <h2>Вопросы предмета {selectedSlug ? `: ${selectedSlug}` : ""}</h2>

        {questions.length === 0 ? (
          <p className="page-subtext">
            Выбери предмет, чтобы посмотреть вопросы.
          </p>
        ) : (
          <div className="admin-list">
            {questions.map((question, index) => (
              <div key={question.id} className="admin-item">
                <div>
                  <strong>
                    {index + 1}. {question.questionText}
                  </strong>
                </div>

                <div className="admin-actions">
                  <button
                    className="btn-outline"
                    onClick={() => setEditingQuestion(question)}
                  >
                    Редактировать
                  </button>

                  <button
                    className="btn-outline"
                    onClick={() => handleDeleteQuestion(question.id)}
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editingSubject && (
        <div className="admin-card">
          <h2>Редактировать предмет</h2>

          <div className="admin-form">
            <input
              placeholder="Название"
              value={editingSubject.title}
              onChange={(e) =>
                setEditingSubject({ ...editingSubject, title: e.target.value })
              }
            />

            <input
              placeholder="Slug"
              value={editingSubject.slug}
              onChange={(e) =>
                setEditingSubject({ ...editingSubject, slug: e.target.value })
              }
            />

            <input
              placeholder="Описание"
              value={editingSubject.description}
              onChange={(e) =>
                setEditingSubject({
                  ...editingSubject,
                  description: e.target.value,
                })
              }
            />

            <input
              placeholder="Иконка"
              value={editingSubject.icon || ""}
              onChange={(e) =>
                setEditingSubject({ ...editingSubject, icon: e.target.value })
              }
            />

            <input
              type="color"
              value={editingSubject.color || "#06b6d4"}
              onChange={(e) =>
                setEditingSubject({ ...editingSubject, color: e.target.value })
              }
            />

            <select
              value={editingSubject.group}
              onChange={(e) =>
                setEditingSubject({ ...editingSubject, group: e.target.value })
              }
            >
              <option value="basic">Базовые</option>
              <option value="professional">Профессиональные</option>
              <option value="applied">Прикладные</option>
            </select>

            <div className="admin-actions">
              <button className="btn-primary" onClick={handleUpdateSubject}>
                Сохранить
              </button>
              <button
                className="btn-outline"
                onClick={() => setEditingSubject(null)}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

      {editingQuestion && (
        <div className="admin-card">
          <h2>Редактировать вопрос</h2>

          <div className="admin-form">
            <textarea
              className="admin-textarea"
              placeholder="Текст вопроса"
              value={editingQuestion.questionText}
              onChange={(e) =>
                setEditingQuestion({
                  ...editingQuestion,
                  questionText: e.target.value,
                })
              }
            />

            <textarea
              className="admin-textarea"
              placeholder="Пояснение"
              value={editingQuestion.explanation || ""}
              onChange={(e) =>
                setEditingQuestion({
                  ...editingQuestion,
                  explanation: e.target.value,
                })
              }
            />

            <div className="admin-actions">
              <button className="btn-primary" onClick={handleUpdateQuestion}>
                Сохранить
              </button>
              <button
                className="btn-outline"
                onClick={() => setEditingQuestion(null)}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

      {editingTopic && (
        <div className="admin-card">
          <h2>Редактировать тему</h2>

          <div className="admin-form">
            <input
              placeholder="Название темы"
              value={editingTopic.title}
              onChange={(e) =>
                setEditingTopic({
                  ...editingTopic,
                  title: e.target.value,
                })
              }
            />

            <textarea
              className="admin-textarea"
              placeholder="Текст темы"
              value={editingTopic.content}
              onChange={(e) =>
                setEditingTopic({
                  ...editingTopic,
                  content: e.target.value,
                })
              }
            />

            <div className="admin-actions">
              <button className="btn-primary" onClick={handleUpdateTopic}>
                Сохранить
              </button>
              <button
                className="btn-outline"
                onClick={() => setEditingTopic(null)}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}