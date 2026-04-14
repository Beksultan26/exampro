"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const theory_controller_1 = require("./theory.controller");
const router = (0, express_1.Router)();
router.get("/:slug", theory_controller_1.getTopicBySlugController);
exports.default = router;
//# sourceMappingURL=theory.routes.js.map