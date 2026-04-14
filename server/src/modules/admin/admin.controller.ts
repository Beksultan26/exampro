import { Request, Response } from "express";
import {
  createAdminQuestion,
  createAdminSubject,
  createAdminTopic,
  deleteAdminQuestion,
  deleteAdminSubject,
  deleteAdminTopic,
  getAdminQuestionsBySubject,
  getAdminSubjects,
  getAdminTopicsBySubject,
  updateAdminQuestion,
  updateAdminSubject,
  updateAdminTopic,
} from "./admin.service";

export async function getAdminSubjectsController(_req: Request, res: Response) {
  const subjects = await getAdminSubjects();
  return res.status(200).json(subjects);
}

export async function createAdminSubjectController(req: Request, res: Response) {
  const { title, slug, description, icon, color, group } = req.body;

  if (!title || !slug || !group) {
    return res.status(400).json({
      message: "title, slug и group обязательны",
    });
  }

  try {
    const subject = await createAdminSubject({
      title,
      slug,
      description,
      icon,
      color,
      group,
    });

    return res.status(201).json(subject);
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Ошибка создания предмета",
    });
  }
}

export async function updateAdminSubjectController(req: Request, res: Response) {
  const id = String(req.params.id);
  const { title, slug, description, icon, color, group } = req.body;

  if (!title || !slug || !group) {
    return res.status(400).json({
      message: "title, slug и group обязательны",
    });
  }

  try {
    const subject = await updateAdminSubject(id, {
      title,
      slug,
      description,
      icon,
      color,
      group,
    });

    return res.status(200).json(subject);
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Ошибка обновления предмета",
    });
  }
}

export async function deleteAdminSubjectController(req: Request, res: Response) {
  const id = String(req.params.id);

  try {
    await deleteAdminSubject(id);
    return res.status(200).json({ message: "Предмет удалён" });
  } catch {
    return res.status(400).json({ message: "Ошибка удаления предмета" });
  }
}

export async function getAdminQuestionsController(req: Request, res: Response) {
  const slug = String(req.params.slug);

  try {
    const subject = await getAdminQuestionsBySubject(slug);
    return res.status(200).json(subject);
  } catch (error) {
    return res.status(404).json({
      message: error instanceof Error ? error.message : "Предмет не найден",
    });
  }
}

export async function createAdminQuestionController(req: Request, res: Response) {
  const { subjectSlug, questionText, explanation, options } = req.body;

  try {
    const question = await createAdminQuestion({
      subjectSlug,
      questionText,
      explanation,
      options,
    });

    return res.status(201).json(question);
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Ошибка создания вопроса",
    });
  }
}

export async function updateAdminQuestionController(req: Request, res: Response) {
  const id = String(req.params.id);
  const { questionText, explanation } = req.body;

  if (!questionText) {
    return res.status(400).json({ message: "Текст вопроса обязателен" });
  }

  try {
    const question = await updateAdminQuestion(id, {
      questionText,
      explanation,
    });

    return res.status(200).json(question);
  } catch {
    return res.status(400).json({ message: "Ошибка обновления вопроса" });
  }
}

export async function deleteAdminQuestionController(req: Request, res: Response) {
  const id = String(req.params.id);

  try {
    await deleteAdminQuestion(id);
    return res.status(200).json({ message: "Вопрос удалён" });
  } catch {
    return res.status(400).json({ message: "Ошибка удаления вопроса" });
  }
}

export async function getAdminTopicsController(req: Request, res: Response) {
  const slug = String(req.params.slug);

  try {
    const subject = await getAdminTopicsBySubject(slug);
    return res.status(200).json(subject);
  } catch (error) {
    return res.status(404).json({
      message: error instanceof Error ? error.message : "Предмет не найден",
    });
  }
}

export async function createAdminTopicController(req: Request, res: Response) {
  const { subjectSlug, title, content } = req.body;

  try {
    const topic = await createAdminTopic({
      subjectSlug,
      title,
      content,
    });

    return res.status(201).json(topic);
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Ошибка создания темы",
    });
  }
}

export async function updateAdminTopicController(req: Request, res: Response) {
  const id = String(req.params.id);
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "Название и текст темы обязательны" });
  }

  try {
    const topic = await updateAdminTopic(id, {
      title,
      content,
    });

    return res.status(200).json(topic);
  } catch {
    return res.status(400).json({ message: "Ошибка обновления темы" });
  }
}

export async function deleteAdminTopicController(req: Request, res: Response) {
  const id = String(req.params.id);

  try {
    await deleteAdminTopic(id);
    return res.status(200).json({ message: "Тема удалена" });
  } catch {
    return res.status(400).json({ message: "Ошибка удаления темы" });
  }
}