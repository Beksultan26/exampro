"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQuizBySubjectController = getQuizBySubjectController;
exports.getExamController = getExamController;
exports.submitExamController = submitExamController;
exports.submitQuizController = submitQuizController;
exports.getQuizHistoryController = getQuizHistoryController;
exports.getAttemptByIdController = getAttemptByIdController;
const quiz_service_1 = require("./quiz.service");
async function getQuizBySubjectController(req, res) {
    const slug = String(req.params.slug);
    const mode = String(req.query.mode || "");
    if (mode === "mistakes" && !req.user) {
        return res.status(401).json({ message: "Не авторизован" });
    }
    const subject = await (0, quiz_service_1.getQuizBySubjectSlug)(slug, req.user?.userId, mode);
    if (!subject) {
        return res.status(404).json({ message: "Предмет не найден" });
    }
    return res.status(200).json(subject);
}
async function getExamController(_req, res) {
    const exam = await (0, quiz_service_1.getExamQuiz)();
    return res.status(200).json(exam);
}
async function submitExamController(req, res) {
    if (!req.user) {
        return res.status(401).json({ message: "Не авторизован" });
    }
    const { answers } = req.body;
    if (!Array.isArray(answers)) {
        return res.status(400).json({ message: "Некорректные данные" });
    }
    try {
        const result = await (0, quiz_service_1.submitExamQuiz)(req.user.userId, answers);
        return res.status(201).json(result);
    }
    catch (error) {
        return res.status(400).json({
            message: error instanceof Error ? error.message : "Ошибка отправки экзамена",
        });
    }
}
async function submitQuizController(req, res) {
    if (!req.user) {
        return res.status(401).json({ message: "Не авторизован" });
    }
    const { subjectSlug, answers } = req.body;
    if (!subjectSlug || !Array.isArray(answers)) {
        return res.status(400).json({ message: "Некорректные данные" });
    }
    try {
        const result = await (0, quiz_service_1.submitQuiz)(req.user.userId, subjectSlug, answers);
        return res.status(201).json(result);
    }
    catch (error) {
        return res.status(400).json({
            message: error instanceof Error ? error.message : "Ошибка отправки теста",
        });
    }
}
async function getQuizHistoryController(req, res) {
    if (!req.user) {
        return res.status(401).json({ message: "Не авторизован" });
    }
    const history = await (0, quiz_service_1.getQuizHistory)(req.user.userId);
    return res.status(200).json(history);
}
async function getAttemptByIdController(req, res) {
    if (!req.user) {
        return res.status(401).json({ message: "Не авторизован" });
    }
    const id = String(req.params.id);
    const attempt = await (0, quiz_service_1.getAttemptById)(id, req.user.userId);
    if (!attempt) {
        return res.status(404).json({ message: "Результат не найден" });
    }
    return res.status(200).json(attempt);
}
//# sourceMappingURL=quiz.controller.js.map