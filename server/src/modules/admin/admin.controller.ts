import { Request, Response } from "express";
import {
  createAdminQuestion,
  createAdminSubject,
  createAdminTopic,
  deleteAdminQuestion,
  deleteAdminSubject,
  deleteAdminTopic,
  getAdminQuestions,
  getAdminSubjects,
  getAdminTopics,
  updateAdminQuestion,
  updateAdminSubject,
  updateAdminTopic,
} from "./admin.service";

export async function getAdminSubjectsController(_req: Request, res: Response) {
  try {
    const subjects = await getAdminSubjects();
    return res.json(subjects);
  } catch (error: any) {
    return res.status(500).json({
      message: error?.message || "Не удалось загрузить предметы",
    });
  }
}

export async function createAdminSubjectController(req: Request, res: Response) {
  try {
    const subject = await createAdminSubject(req.body);
    return res.status(201).json(subject);
  } catch (error: any) {
    return res.status(400).json({
      message: error?.message || "Не удалось создать предмет",
    });
  }
}

export async function updateAdminSubjectController(req: Request, res: Response) {
  try {
    const subject = await updateAdminSubject(req.params.id, req.body);
    return res.json(subject);
  } catch (error: any) {
    return res.status(400).json({
      message: error?.message || "Не удалось обновить предмет",
    });
  }
}

export async function deleteAdminSubjectController(req: Request, res: Response) {
  try {
    await deleteAdminSubject(req.params.id);
    return res.json({ message: "Предмет удалён" });
  } catch (error: any) {
    return res.status(400).json({
      message: error?.message || "Не удалось удалить предмет",
    });
  }
}

export async function getAdminQuestionsController(req: Request, res: Response) {
  try {
    const questions = await getAdminQuestions(req.params.slug);
    return res.json(questions);
  } catch (error: any) {
    return res.status(400).json({
      message: error?.message || "Не удалось загрузить вопросы",
    });
  }
}

export async function createAdminQuestionController(req: Request, res: Response) {
  try {
    const question = await createAdminQuestion(req.body);
    return res.status(201).json(question);
  } catch (error: any) {
    return res.status(400).json({
      message: error?.message || "Не удалось создать вопрос",
    });
  }
}

export async function updateAdminQuestionController(req: Request, res: Response) {
  try {
    const question = await updateAdminQuestion(req.params.id, req.body);
    return res.json(question);
  } catch (error: any) {
    return res.status(400).json({
      message: error?.message || "Не удалось обновить вопрос",
    });
  }
}

export async function deleteAdminQuestionController(req: Request, res: Response) {
  try {
    await deleteAdminQuestion(req.params.id);
    return res.json({ message: "Вопрос удалён" });
  } catch (error: any) {
    return res.status(400).json({
      message: error?.message || "Не удалось удалить вопрос",
    });
  }
}

export async function getAdminTopicsController(req: Request, res: Response) {
  try {
    const topics = await getAdminTopics(req.params.slug);
    return res.json(topics);
  } catch (error: any) {
    return res.status(400).json({
      message: error?.message || "Не удалось загрузить темы",
    });
  }
}

export async function createAdminTopicController(req: Request, res: Response) {
  try {
    const topic = await createAdminTopic(req.body);
    return res.status(201).json(topic);
  } catch (error: any) {
    return res.status(400).json({
      message: error?.message || "Не удалось создать тему",
    });
  }
}

export async function updateAdminTopicController(req: Request, res: Response) {
  try {
    const topic = await updateAdminTopic(req.params.id, req.body);
    return res.json(topic);
  } catch (error: any) {
    return res.status(400).json({
      message: error?.message || "Не удалось обновить тему",
    });
  }
}

export async function deleteAdminTopicController(req: Request, res: Response) {
  try {
    await deleteAdminTopic(req.params.id);
    return res.json({ message: "Тема удалена" });
  } catch (error: any) {
    return res.status(400).json({
      message: error?.message || "Не удалось удалить тему",
    });
  }
}