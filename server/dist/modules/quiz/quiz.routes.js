"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const db_1 = require("../../config/db");
const quiz_controller_1 = require("./quiz.controller");
const router = (0, express_1.Router)();
router.get("/exam", auth_middleware_1.authMiddleware, quiz_controller_1.getExamController);
router.get("/by-subject/:slug", auth_middleware_1.authMiddleware, quiz_controller_1.getQuizBySubjectController);
router.post("/exam/submit", auth_middleware_1.authMiddleware, quiz_controller_1.submitExamController);
router.post("/submit", auth_middleware_1.authMiddleware, quiz_controller_1.submitQuizController);
router.get("/history", auth_middleware_1.authMiddleware, quiz_controller_1.getQuizHistoryController);
router.get("/attempt/:id", auth_middleware_1.authMiddleware, quiz_controller_1.getAttemptByIdController);
router.get("/mistakes", auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;
        const attempts = await db_1.prisma.quizAttempt.findMany({
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
        const mistakes = attempts.flatMap((attempt) => attempt.answers.map((answer) => ({
            id: answer.id,
            question: answer.question.questionText,
            explanation: answer.question.explanation,
            selected: answer.selectedOption?.optionText || "Ответ не выбран",
            correct: answer.question.options.find((option) => option.isCorrect)
                ?.optionText || "Правильный ответ не найден",
        })));
        return res.json(mistakes);
    }
    catch (error) {
        return res.status(500).json({ message: "Ошибка получения ошибок" });
    }
});
router.get("/mistakes-quiz", auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;
        const attempts = await db_1.prisma.quizAttempt.findMany({
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
    }
    catch (error) {
        res.status(500).json({ message: "Не удалось загрузить ошибки" });
    }
});
exports.default = router;
//# sourceMappingURL=quiz.routes.js.map