import { useEffect, useMemo, useRef, useState } from "react";
import { api } from "../api";

type Subject = {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  color?: string | null;
  group: string;
  _count?: {
    topics: number;
    questions: number;
  };
};

type Topic = {
  id: string;
  title: string;
  slug: string;
  content: string;
};

type Option = {
  id?: string;
  optionText: string;
  isCorrect: boolean;
};

type Question = {
  id: string;
  questionText: string;
  explanation?: string | null;
  options: Option[];
};

function normalizeGroup(group: string) {
  if (group === "Базовые" || group === "basic") return "basic";
  if (group === "Профессиональные" || group === "professional") {
    return "professional";
  }
  if (group === "Прикладные" || group === "applied") return "applied";
  return "basic";
}

const emptySubjectForm = {
  title: "",
  slug: "",
  description: "",
  icon: "",
  color: "#2f65e5",
  group: "basic",
};

const emptyTopicForm = {
  title: "",
  content: "",
};

const emptyQuestionForm = {
  questionText: "",
  explanation: "",
  options: [
    { optionText: "", isCorrect: true },
    { optionText: "", isCorrect: false },
    { optionText: "", isCorrect: false },
    { optionText: "", isCorrect: false },
  ] as Option[],
};

export default function AdminPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubjectSlug, setSelectedSubjectSlug] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");

  const [topics, setTopics] = useState<Topic[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);

  const [subjectForm, setSubjectForm] = useState(emptySubjectForm);
  const [topicForm, setTopicForm] = useState(emptyTopicForm);
  const [questionForm, setQuestionForm] = useState(emptyQuestionForm);

  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [isSubjectSelectOpen, setIsSubjectSelectOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement | null>(null);

  const selectedSubject = useMemo(
    () => subjects.find((s) => s.slug === selectedSubjectSlug) || null,
    [subjects, selectedSubjectSlug]
  );

  useEffect(() => {
    loadSubjects();
  }, []);

  useEffect(() => {
    if (selectedSubject) {
      setSelectedSubjectId(selectedSubject.id);
      loadTopics(selectedSubject.slug);
      loadQuestions(selectedSubject.slug);
    } else {
      setSelectedSubjectId("");
      setTopics([]);
      setQuestions([]);
    }
  }, [selectedSubject]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!selectRef.current) return;
      if (!selectRef.current.contains(e.target as Node)) {
        setIsSubjectSelectOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  async function loadSubjects() {
    try {
      const { data } = await api.get("/admin/subjects");
      setSubjects(data);

      if (!selectedSubjectSlug && data.length > 0) {
        setSelectedSubjectSlug(data[0].slug);
      }
    } catch (err: any) {
      setMessage(err?.response?.data?.message || "Не удалось загрузить предметы");
    }
  }

  async function loadTopics(slug: string) {
    try {
      const { data } = await api.get(`/admin/subjects/${slug}/topics`);
      setTopics(data);
    } catch (err: any) {
      setMessage(err?.response?.data?.message || "Не удалось загрузить темы");
    }
  }

  async function loadQuestions(slug: string) {
    try {
      const { data } = await api.get(`/admin/subjects/${slug}/questions`);
      setQuestions(data);
    } catch (err: any) {
      setMessage(
        err?.response?.data?.message || "Не удалось загрузить вопросы"
      );
    }
  }

  function resetSubjectForm() {
    setSubjectForm(emptySubjectForm);
    setEditingSubjectId(null);
  }

  function resetTopicForm() {
    setTopicForm(emptyTopicForm);
    setEditingTopicId(null);
  }

  function resetQuestionForm() {
    setQuestionForm(emptyQuestionForm);
    setEditingQuestionId(null);
  }

  function ensureSlug(value: string) {
    return value
      .trim()
      .toLowerCase()
      .replace(/[^a-zA-Zа-яА-Я0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  async function handleSaveSubject(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const payload = {
        ...subjectForm,
        group: normalizeGroup(subjectForm.group),
        slug: ensureSlug(subjectForm.slug || subjectForm.title),
      };

      if (editingSubjectId) {
        await api.put(`/admin/subjects/${editingSubjectId}`, payload);
        setMessage("Предмет обновлён");
      } else {
        await api.post("/admin/subjects", payload);
        setMessage("Предмет добавлен");
      }

      await loadSubjects();
      resetSubjectForm();
    } catch (err: any) {
      setMessage(err?.response?.data?.message || "Ошибка сохранения предмета");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteSubject(id: string) {
    if (!confirm("Удалить предмет?")) return;

    try {
      await api.delete(`/admin/subjects/${id}`);
      setMessage("Предмет удалён");
      await loadSubjects();

      if (selectedSubject?.id === id) {
        setSelectedSubjectSlug("");
        setTopics([]);
        setQuestions([]);
      }
    } catch (err: any) {
      setMessage(err?.response?.data?.message || "Ошибка удаления предмета");
    }
  }

  async function handleSaveTopic(e: React.FormEvent) {
    e.preventDefault();

    if (!selectedSubjectId) {
      setMessage("Сначала выбери предмет");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const payload = {
        subjectId: selectedSubjectId,
        title: topicForm.title,
        content: topicForm.content,
      };

      if (editingTopicId) {
        await api.put(`/admin/topics/${editingTopicId}`, {
          title: topicForm.title,
          content: topicForm.content,
        });
        setMessage("Тема обновлена");
      } else {
        await api.post("/admin/topics", payload);
        setMessage("Тема добавлена");
      }

      if (selectedSubjectSlug) {
        await loadTopics(selectedSubjectSlug);
      }

      resetTopicForm();
    } catch (err: any) {
      setMessage(err?.response?.data?.message || "Ошибка сохранения темы");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteTopic(id: string) {
    if (!confirm("Удалить тему?")) return;

    try {
      await api.delete(`/admin/topics/${id}`);
      setMessage("Тема удалена");

      if (selectedSubjectSlug) {
        await loadTopics(selectedSubjectSlug);
      }
    } catch (err: any) {
      setMessage(err?.response?.data?.message || "Ошибка удаления темы");
    }
  }

  async function handleSaveQuestion(e: React.FormEvent) {
    e.preventDefault();

    if (!selectedSubjectId) {
      setMessage("Сначала выбери предмет");
      return;
    }

    const correctCount = questionForm.options.filter((o) => o.isCorrect).length;

    if (correctCount !== 1) {
      setMessage("Нужно выбрать ровно один правильный ответ");
      return;
    }

    if (questionForm.options.some((o) => !o.optionText.trim())) {
      setMessage("Заполни все варианты ответа");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const payload = {
        subjectId: selectedSubjectId,
        questionText: questionForm.questionText,
        explanation: questionForm.explanation,
        options: questionForm.options.map((o) => ({
          optionText: o.optionText,
          isCorrect: o.isCorrect,
        })),
      };

      if (editingQuestionId) {
        await api.put(`/admin/questions/${editingQuestionId}`, {
          questionText: questionForm.questionText,
          explanation: questionForm.explanation,
          options: questionForm.options.map((o) => ({
            optionText: o.optionText,
            isCorrect: o.isCorrect,
          })),
        });
        setMessage("Вопрос обновлён");
      } else {
        await api.post("/admin/questions", payload);
        setMessage("Вопрос добавлен");
      }

      if (selectedSubjectSlug) {
        await loadQuestions(selectedSubjectSlug);
      }

      resetQuestionForm();
    } catch (err: any) {
      setMessage(err?.response?.data?.message || "Ошибка сохранения вопроса");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteQuestion(id: string) {
    if (!confirm("Удалить вопрос?")) return;

    try {
      await api.delete(`/admin/questions/${id}`);
      setMessage("Вопрос удалён");

      if (selectedSubjectSlug) {
        await loadQuestions(selectedSubjectSlug);
      }
    } catch (err: any) {
      setMessage(err?.response?.data?.message || "Ошибка удаления вопроса");
    }
  }

  function startEditSubject(subject: Subject) {
    setEditingSubjectId(subject.id);
    setSubjectForm({
      title: subject.title,
      slug: subject.slug,
      description: subject.description || "",
      icon: subject.icon || "",
      color: subject.color || "#2f65e5",
      group: normalizeGroup(subject.group),
    });
  }

  function startEditTopic(topic: Topic) {
    setEditingTopicId(topic.id);
    setTopicForm({
      title: topic.title,
      content: topic.content,
    });
  }

  function startEditQuestion(question: Question) {
    const options = question.options?.length
      ? question.options.map((o) => ({
          optionText: o.optionText,
          isCorrect: o.isCorrect,
        }))
      : emptyQuestionForm.options;

    setEditingQuestionId(question.id);
    setQuestionForm({
      questionText: question.questionText,
      explanation: question.explanation || "",
      options,
    });
  }

  function updateQuestionOption(index: number, value: string) {
    setQuestionForm((prev) => ({
      ...prev,
      options: prev.options.map((option, i) =>
        i === index ? { ...option, optionText: value } : option
      ),
    }));
  }

  function setCorrectOption(index: number) {
    setQuestionForm((prev) => ({
      ...prev,
      options: prev.options.map((option, i) => ({
        ...option,
        isCorrect: i === index,
      })),
    }));
  }

  return (
    <div className="admin-page">
      <h1>Админ-панель</h1>

      {message && <div className="admin-message">{message}</div>}

      <div className="admin-grid">
        <section className="admin-card">
          <h2>{editingSubjectId ? "Редактировать предмет" : "Добавить предмет"}</h2>

          <form onSubmit={handleSaveSubject} className="admin-form">
            <input
              placeholder="Название"
              value={subjectForm.title}
              onChange={(e) =>
                setSubjectForm((prev) => ({ ...prev, title: e.target.value }))
              }
              required
            />

            <input
              placeholder="Slug"
              value={subjectForm.slug}
              onChange={(e) =>
                setSubjectForm((prev) => ({ ...prev, slug: e.target.value }))
              }
              required
            />

            <input
              placeholder="Описание"
              value={subjectForm.description}
              onChange={(e) =>
                setSubjectForm((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />

            <input
              placeholder="Иконка, например 💻"
              value={subjectForm.icon}
              onChange={(e) =>
                setSubjectForm((prev) => ({ ...prev, icon: e.target.value }))
              }
            />

            <label>
              Цвет:
              <input
                type="color"
                value={subjectForm.color}
                onChange={(e) =>
                  setSubjectForm((prev) => ({ ...prev, color: e.target.value }))
                }
              />
            </label>

            <select
              value={subjectForm.group}
              onChange={(e) =>
                setSubjectForm((prev) => ({ ...prev, group: e.target.value }))
              }
            >
              <option value="basic">Базовые</option>
              <option value="professional">Профессиональные</option>
              <option value="applied">Прикладные</option>
            </select>

            <div className="admin-actions">
              <button type="submit" disabled={loading}>
                {editingSubjectId ? "Сохранить предмет" : "Добавить предмет"}
              </button>

              {editingSubjectId && (
                <button type="button" onClick={resetSubjectForm}>
                  Отмена
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="admin-card">
          <h2>Предметы</h2>

          <div className="custom-select" ref={selectRef}>
            <button
              type="button"
              className={`custom-select-trigger ${isSubjectSelectOpen ? "open" : ""}`}
              onClick={() => setIsSubjectSelectOpen((prev) => !prev)}
            >
              <span>
                {selectedSubject?.title || "Выбери предмет"}
              </span>
              <span className="custom-select-arrow">▾</span>
            </button>

            {isSubjectSelectOpen && (
              <div className="custom-select-menu">
                {subjects.map((subject) => (
                  <button
                    key={subject.id}
                    type="button"
                    className={`custom-select-option ${
                      selectedSubjectSlug === subject.slug ? "active" : ""
                    }`}
                    onClick={() => {
                      setSelectedSubjectSlug(subject.slug);
                      setIsSubjectSelectOpen(false);
                    }}
                  >
                    {subject.title}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="admin-list">
            {subjects.map((subject) => (
              <div key={subject.id} className="admin-item">
                <div>
                  <strong>{subject.title}</strong>
                  <div>{subject.slug}</div>
                  <div>
                    Тем: {subject._count?.topics ?? 0} | Вопросов:{" "}
                    {subject._count?.questions ?? 0}
                  </div>
                </div>

                <div className="admin-item-actions">
                  <button onClick={() => startEditSubject(subject)}>
                    Редактировать
                  </button>
                  <button onClick={() => setSelectedSubjectSlug(subject.slug)}>
                    Открыть
                  </button>
                  <button onClick={() => handleDeleteSubject(subject.id)}>
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="admin-card">
          <h2>{editingTopicId ? "Редактировать тему" : "Добавить тему"}</h2>

          <form onSubmit={handleSaveTopic} className="admin-form">
            <input
              placeholder="Название темы"
              value={topicForm.title}
              onChange={(e) =>
                setTopicForm((prev) => ({ ...prev, title: e.target.value }))
              }
              required
            />

            <textarea
              placeholder="Содержимое темы"
              value={topicForm.content}
              onChange={(e) =>
                setTopicForm((prev) => ({ ...prev, content: e.target.value }))
              }
              rows={8}
              required
            />

            <div className="admin-actions">
              <button type="submit" disabled={loading}>
                {editingTopicId ? "Сохранить тему" : "Добавить тему"}
              </button>

              {editingTopicId && (
                <button type="button" onClick={resetTopicForm}>
                  Отмена
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="admin-card">
          <h2>Темы текущего предмета</h2>

          {!selectedSubjectSlug ? (
            <p>Сначала выбери предмет</p>
          ) : (
            <div className="admin-list">
              {topics.map((topic) => (
                <div key={topic.id} className="admin-item">
                  <div>
                    <strong>{topic.title}</strong>
                    <div>{topic.slug}</div>
                  </div>

                  <div className="admin-item-actions">
                    <button onClick={() => startEditTopic(topic)}>
                      Редактировать
                    </button>
                    <button onClick={() => handleDeleteTopic(topic.id)}>
                      Удалить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="admin-card">
          <h2>{editingQuestionId ? "Редактировать вопрос" : "Добавить вопрос"}</h2>

          <form onSubmit={handleSaveQuestion} className="admin-form">
            <textarea
              placeholder="Текст вопроса"
              value={questionForm.questionText}
              onChange={(e) =>
                setQuestionForm((prev) => ({
                  ...prev,
                  questionText: e.target.value,
                }))
              }
              rows={4}
              required
            />

            <textarea
              placeholder="Пояснение"
              value={questionForm.explanation}
              onChange={(e) =>
                setQuestionForm((prev) => ({
                  ...prev,
                  explanation: e.target.value,
                }))
              }
              rows={3}
            />

            {questionForm.options.map((option, index) => (
              <div key={index} className="admin-option-row">
                <input
                  type="radio"
                  name="correctOption"
                  checked={option.isCorrect}
                  onChange={() => setCorrectOption(index)}
                />

                <input
                  placeholder={`Вариант ${index + 1}`}
                  value={option.optionText}
                  onChange={(e) => updateQuestionOption(index, e.target.value)}
                  required
                />
              </div>
            ))}

            <div className="admin-actions">
              <button type="submit" disabled={loading}>
                {editingQuestionId ? "Сохранить вопрос" : "Добавить вопрос"}
              </button>

              {editingQuestionId && (
                <button type="button" onClick={resetQuestionForm}>
                  Отмена
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="admin-card">
          <h2>Вопросы текущего предмета</h2>

          {!selectedSubjectSlug ? (
            <p>Сначала выбери предмет</p>
          ) : (
            <div className="admin-list">
              {questions.map((question, index) => (
                <div key={question.id} className="admin-item question-item">
                  <div>
                    <strong>
                      {index + 1}. {question.questionText}
                    </strong>

                    {question.explanation && <div>{question.explanation}</div>}

                    <ul>
                      {question.options.map((option, optionIndex) => (
                        <li key={optionIndex}>
                          {option.optionText} {option.isCorrect ? "✅" : ""}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="admin-item-actions">
                    <button onClick={() => startEditQuestion(question)}>
                      Редактировать
                    </button>
                    <button onClick={() => handleDeleteQuestion(question.id)}>
                      Удалить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}