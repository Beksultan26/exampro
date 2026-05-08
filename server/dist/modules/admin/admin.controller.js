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
function getParam(value) {
    if (Array.isArray(value))
        return value[0] || "";
    return value || "";
}
async function getAdminSubjectsController(_req, res) {
    try {
        const subjects = await (0, admin_service_1.getAdminSubjects)();
        return res.json(subjects);
    }
    catch (error) {
        return res.status(500).json({
            message: error?.message || "Не удалось загрузить предметы",
        });
    }
}
async function createAdminSubjectController(req, res) {
    try {
        const subject = await (0, admin_service_1.createAdminSubject)(req.body);
        return res.status(201).json(subject);
    }
    catch (error) {
        return res.status(400).json({
            message: error?.message || "Не удалось создать предмет",
        });
    }
}
async function updateAdminSubjectController(req, res) {
    try {
        const id = getParam(req.params.id);
        const subject = await (0, admin_service_1.updateAdminSubject)(id, req.body);
        return res.json(subject);
    }
    catch (error) {
        return res.status(400).json({
            message: error?.message || "Не удалось обновить предмет",
        });
    }
}
async function deleteAdminSubjectController(req, res) {
    try {
        const id = getParam(req.params.id);
        await (0, admin_service_1.deleteAdminSubject)(id);
        return res.json({ message: "Предмет удалён" });
    }
    catch (error) {
        return res.status(400).json({
            message: error?.message || "Не удалось удалить предмет",
        });
    }
}
async function getAdminQuestionsController(req, res) {
    try {
        const slug = getParam(req.params.slug);
        const questions = await (0, admin_service_1.getAdminQuestions)(slug);
        return res.json(questions);
    }
    catch (error) {
        return res.status(400).json({
            message: error?.message || "Не удалось загрузить вопросы",
        });
    }
}
async function createAdminQuestionController(req, res) {
    try {
        const question = await (0, admin_service_1.createAdminQuestion)(req.body);
        return res.status(201).json(question);
    }
    catch (error) {
        return res.status(400).json({
            message: error?.message || "Не удалось создать вопрос",
        });
    }
}
async function updateAdminQuestionController(req, res) {
    try {
        const id = getParam(req.params.id);
        const question = await (0, admin_service_1.updateAdminQuestion)(id, req.body);
        return res.json(question);
    }
    catch (error) {
        return res.status(400).json({
            message: error?.message || "Не удалось обновить вопрос",
        });
    }
}
async function deleteAdminQuestionController(req, res) {
    try {
        const id = getParam(req.params.id);
        await (0, admin_service_1.deleteAdminQuestion)(id);
        return res.json({ message: "Вопрос удалён" });
    }
    catch (error) {
        return res.status(400).json({
            message: error?.message || "Не удалось удалить вопрос",
        });
    }
}
async function getAdminTopicsController(req, res) {
    try {
        const slug = getParam(req.params.slug);
        const topics = await (0, admin_service_1.getAdminTopics)(slug);
        return res.json(topics);
    }
    catch (error) {
        return res.status(400).json({
            message: error?.message || "Не удалось загрузить темы",
        });
    }
}
async function createAdminTopicController(req, res) {
    try {
        const topic = await (0, admin_service_1.createAdminTopic)(req.body);
        return res.status(201).json(topic);
    }
    catch (error) {
        return res.status(400).json({
            message: error?.message || "Не удалось создать тему",
        });
    }
}
async function updateAdminTopicController(req, res) {
    try {
        const id = getParam(req.params.id);
        const topic = await (0, admin_service_1.updateAdminTopic)(id, req.body);
        return res.json(topic);
    }
    catch (error) {
        return res.status(400).json({
            message: error?.message || "Не удалось обновить тему",
        });
    }
}
async function deleteAdminTopicController(req, res) {
    try {
        const id = getParam(req.params.id);
        await (0, admin_service_1.deleteAdminTopic)(id);
        return res.json({ message: "Тема удалена" });
    }
    catch (error) {
        return res.status(400).json({
            message: error?.message || "Не удалось удалить тему",
        });
    }
}
//# sourceMappingURL=admin.controller.js.map