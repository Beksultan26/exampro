"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminSubjectsController = getAdminSubjectsController;
exports.createAdminSubjectController = createAdminSubjectController;
exports.updateAdminSubjectController = updateAdminSubjectController;
exports.deleteAdminSubjectController = deleteAdminSubjectController;
exports.getAdminQuestionsController = getAdminQuestionsController;
exports.createAdminQuestionController = createAdminQuestionController;
exports.updateAdminQuestionController = updateAdminQuestionController;
exports.deleteAdminQuestionController = deleteAdminQuestionController;
exports.getAdminTopicsController = getAdminTopicsController;
exports.createAdminTopicController = createAdminTopicController;
exports.updateAdminTopicController = updateAdminTopicController;
exports.deleteAdminTopicController = deleteAdminTopicController;
const admin_service_1 = require("./admin.service");
async function getAdminSubjectsController(_req, res) {
    const subjects = await (0, admin_service_1.getAdminSubjects)();
    return res.status(200).json(subjects);
}
async function createAdminSubjectController(req, res) {
    const { title, slug, description, icon, color, group } = req.body;
    if (!title || !slug || !group) {
        return res.status(400).json({
            message: "title, slug и group обязательны",
        });
    }
    try {
        const subject = await (0, admin_service_1.createAdminSubject)({
            title,
            slug,
            description,
            icon,
            color,
            group,
        });
        return res.status(201).json(subject);
    }
    catch (error) {
        return res.status(400).json({
            message: error instanceof Error ? error.message : "Ошибка создания предмета",
        });
    }
}
async function updateAdminSubjectController(req, res) {
    const id = String(req.params.id);
    const { title, slug, description, icon, color, group } = req.body;
    if (!title || !slug || !group) {
        return res.status(400).json({
            message: "title, slug и group обязательны",
        });
    }
    try {
        const subject = await (0, admin_service_1.updateAdminSubject)(id, {
            title,
            slug,
            description,
            icon,
            color,
            group,
        });
        return res.status(200).json(subject);
    }
    catch (error) {
        return res.status(400).json({
            message: error instanceof Error ? error.message : "Ошибка обновления предмета",
        });
    }
}
async function deleteAdminSubjectController(req, res) {
    const id = String(req.params.id);
    try {
        await (0, admin_service_1.deleteAdminSubject)(id);
        return res.status(200).json({ message: "Предмет удалён" });
    }
    catch {
        return res.status(400).json({ message: "Ошибка удаления предмета" });
    }
}
async function getAdminQuestionsController(req, res) {
    const slug = String(req.params.slug);
    try {
        const subject = await (0, admin_service_1.getAdminQuestionsBySubject)(slug);
        return res.status(200).json(subject);
    }
    catch (error) {
        return res.status(404).json({
            message: error instanceof Error ? error.message : "Предмет не найден",
        });
    }
}
async function createAdminQuestionController(req, res) {
    const { subjectSlug, questionText, explanation, options } = req.body;
    try {
        const question = await (0, admin_service_1.createAdminQuestion)({
            subjectSlug,
            questionText,
            explanation,
            options,
        });
        return res.status(201).json(question);
    }
    catch (error) {
        return res.status(400).json({
            message: error instanceof Error ? error.message : "Ошибка создания вопроса",
        });
    }
}
async function updateAdminQuestionController(req, res) {
    const id = String(req.params.id);
    const { questionText, explanation } = req.body;
    if (!questionText) {
        return res.status(400).json({ message: "Текст вопроса обязателен" });
    }
    try {
        const question = await (0, admin_service_1.updateAdminQuestion)(id, {
            questionText,
            explanation,
        });
        return res.status(200).json(question);
    }
    catch {
        return res.status(400).json({ message: "Ошибка обновления вопроса" });
    }
}
async function deleteAdminQuestionController(req, res) {
    const id = String(req.params.id);
    try {
        await (0, admin_service_1.deleteAdminQuestion)(id);
        return res.status(200).json({ message: "Вопрос удалён" });
    }
    catch {
        return res.status(400).json({ message: "Ошибка удаления вопроса" });
    }
}
async function getAdminTopicsController(req, res) {
    const slug = String(req.params.slug);
    try {
        const subject = await (0, admin_service_1.getAdminTopicsBySubject)(slug);
        return res.status(200).json(subject);
    }
    catch (error) {
        return res.status(404).json({
            message: error instanceof Error ? error.message : "Предмет не найден",
        });
    }
}
async function createAdminTopicController(req, res) {
    const { subjectSlug, title, content } = req.body;
    try {
        const topic = await (0, admin_service_1.createAdminTopic)({
            subjectSlug,
            title,
            content,
        });
        return res.status(201).json(topic);
    }
    catch (error) {
        return res.status(400).json({
            message: error instanceof Error ? error.message : "Ошибка создания темы",
        });
    }
}
async function updateAdminTopicController(req, res) {
    const id = String(req.params.id);
    const { title, content } = req.body;
    if (!title || !content) {
        return res.status(400).json({ message: "Название и текст темы обязательны" });
    }
    try {
        const topic = await (0, admin_service_1.updateAdminTopic)(id, {
            title,
            content,
        });
        return res.status(200).json(topic);
    }
    catch {
        return res.status(400).json({ message: "Ошибка обновления темы" });
    }
}
async function deleteAdminTopicController(req, res) {
    const id = String(req.params.id);
    try {
        await (0, admin_service_1.deleteAdminTopic)(id);
        return res.status(200).json({ message: "Тема удалена" });
    }
    catch {
        return res.status(400).json({ message: "Ошибка удаления темы" });
    }
}
//# sourceMappingURL=admin.controller.js.map