import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { prisma } from "../../config/db";
import {
  getAttemptByIdController,
  getExamController,
  getQuizBySubjectController,
  getQuizHistoryController,
  submitExamController,
  submitQuizController,
} from "./quiz.controller";

const router = Router();

router.get("/exam", authMiddleware, getExamController);
router.get("/by-subject/:slug", authMiddleware, getQuizBySubjectController);

router.post("/exam/submit", authMiddleware, submitExamController);
router.post("/submit", authMiddleware, submitQuizController);

router.get("/history", authMiddleware, getQuizHistoryController);
router.get("/attempt/:id", authMiddleware, getAttemptByIdController);

router.get("/mistakes", authMiddleware, async (req: any, res) => {
  try {
    const userId = req.user.userId;

    const attempts = await prisma.quizAttempt.findMany({
  where: { userId },
  include: {
    answers: {
      where: { isCorrect: false },
      include: {
        question: {
          include: {
            options: true,
          },
        },
        selectedOption: true,
      },
    },
  },
  orderBy: { createdAt: "desc" },
});

    const mistakes = attempts.flatMap((attempt) =>
      attempt.answers.map((answer) => ({
        id: answer.id,
        question: answer.question.questionText,
        explanation: answer.question.explanation,
        selected: answer.selectedOption?.optionText || "Ответ не выбран",
        correct:
          answer.question.options.find((option) => option.isCorrect)
            ?.optionText || "Правильный ответ не найден",
      }))
    );

    return res.json(mistakes);
  } catch (error) {
    return res.status(500).json({ message: "Ошибка получения ошибок" });
  }
});
router.get("/mistakes-quiz", authMiddleware, async (req: any, res) => {
  try {
    const userId = req.user.userId;

    const attempts = await prisma.quizAttempt.findMany({
      where: { userId },
      include: {
        answers: {
          where: { isCorrect: false },
          include: {
            question: {
              include: {
                options: true,
                subject: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const map = new Map();

    attempts.forEach((attempt) => {
      attempt.answers.forEach((answer) => {
        const q = answer.question;

        if (!map.has(q.id)) {
          map.set(q.id, {
            id: q.id,
            questionText: q.questionText,
            explanation: q.explanation,
            subject: q.subject,
            options: q.options.map((option) => ({
              id: option.id,
              optionText: option.optionText,
              isCorrect: option.isCorrect,
            })),
          });
        }
      });
    });

    res.json(Array.from(map.values()));
  } catch (error) {
    res.status(500).json({ message: "Не удалось загрузить ошибки" });
  }
});

export default router;