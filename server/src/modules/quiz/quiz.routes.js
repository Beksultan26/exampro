"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const quiz_controller_1 = require("./quiz.controller");
const router = (0, express_1.Router)();
router.get("/exam", auth_middleware_1.authMiddleware, quiz_controller_1.getExamController);
router.get("/by-subject/:slug", auth_middleware_1.authMiddleware, quiz_controller_1.getQuizBySubjectController);
router.post("/exam/submit", auth_middleware_1.authMiddleware, quiz_controller_1.submitExamController);
router.post("/submit", auth_middleware_1.authMiddleware, quiz_controller_1.submitQuizController);
router.get("/history", auth_middleware_1.authMiddleware, quiz_controller_1.getQuizHistoryController);
router.get("/attempt/:id", auth_middleware_1.authMiddleware, quiz_controller_1.getAttemptByIdController);
exports.default = router;
//# sourceMappingURL=quiz.routes.js.map