import { Request, Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import {
  getAttemptById,
  getExamQuiz,
  getQuizBySubjectSlug,
  getQuizHistory,
  submitExamQuiz,
  submitQuiz,
} from "./quiz.service";

export async function getQuizBySubjectController(
  req: AuthRequest,
  res: Response
) {
  const slug = String(req.params.slug);
  const mode = String(req.query.mode || "");

  if (mode === "mistakes" && !req.user) {
    return res.status(401).json({ message: "Не авторизован" });
  }

  const subject = await getQuizBySubjectSlug(
    slug,
    req.user?.userId,
    mode
  );

  if (!subject) {
    return res.status(404).json({ message: "Предмет не найден" });
  }

  return res.status(200).json(subject);
}

export async function getExamController(_req: Request, res: Response) {
  const exam = await getExamQuiz();
  return res.status(200).json(exam);
}

export async function submitExamController(req: AuthRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ message: "Не авторизован" });
  }

  const { answers } = req.body;

  if (!Array.isArray(answers)) {
    return res.status(400).json({ message: "Некорректные данные" });
  }

  try {
    const result = await submitExamQuiz(req.user.userId, answers);
    return res.status(201).json(result);
  } catch (error) {
    return res.status(400).json({
      message:
        error instanceof Error ? error.message : "Ошибка отправки экзамена",
    });
  }
}

export async function submitQuizController(req: AuthRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ message: "Не авторизован" });
  }

  const { subjectSlug, answers } = req.body;

  if (!subjectSlug || !Array.isArray(answers)) {
    return res.status(400).json({ message: "Некорректные данные" });
  }

  try {
    const result = await submitQuiz(req.user.userId, subjectSlug, answers);
    return res.status(201).json(result);
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Ошибка отправки теста",
    });
  }
}

export async function getQuizHistoryController(req: AuthRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ message: "Не авторизован" });
  }

  const history = await getQuizHistory(req.user.userId);
  return res.status(200).json(history);
}

export async function getAttemptByIdController(req: AuthRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ message: "Не авторизован" });
  }

  const id = String(req.params.id);

  const attempt = await getAttemptById(id, req.user.userId);

  if (!attempt) {
    return res.status(404).json({ message: "Результат не найден" });
  }

  return res.status(200).json(attempt);
}