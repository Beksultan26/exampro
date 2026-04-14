"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const subjects_controller_1 = require("./subjects.controller");
const router = (0, express_1.Router)();
router.get("/", subjects_controller_1.getSubjectsController);
router.get("/:slug", subjects_controller_1.getSubjectBySlugController);
exports.default = router;
//# sourceMappingURL=subjects.routes.js.map