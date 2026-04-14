"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTopicBySlugController = getTopicBySlugController;
const express_1 = require("express");
const theory_service_1 = require("./theory.service");
async function getTopicBySlugController(req, res) {
    const { slug } = req.params;
    const topic = await (0, theory_service_1.getTopicBySlug)(slug);
    if (!topic) {
        return res.status(404).json({ message: "Тема не найдена" });
    }
    return res.status(200).json(topic);
}
//# sourceMappingURL=theory.controller.js.map