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

    const attempts = await prisma.attempt.findMany({
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

export default router;