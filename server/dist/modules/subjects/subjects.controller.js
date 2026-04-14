"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubjectsController = getSubjectsController;
exports.getSubjectBySlugController = getSubjectBySlugController;
const subjects_service_1 = require("./subjects.service");
async function getSubjectsController(_req, res) {
    const subjects = await (0, subjects_service_1.getAllSubjects)();
    return res.status(200).json(subjects);
}
async function getSubjectBySlugController(req, res) {
    const slug = String(req.params.slug);
    const subject = await (0, subjects_service_1.getSubjectBySlug)(slug);
    if (!subject) {
        return res.status(404).json({ message: "Предмет не найден" });
    }
    return res.status(200).json(subject);
}
//# sourceMappingURL=subjects.controller.js.map