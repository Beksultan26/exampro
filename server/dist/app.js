"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const subjects_routes_1 = __importDefault(require("./modules/subjects/subjects.routes"));
const theory_routes_1 = __importDefault(require("./modules/theory/theory.routes"));
const quiz_routes_1 = __importDefault(require("./modules/quiz/quiz.routes"));
const env_1 = require("./config/env");
const admin_routes_1 = __importDefault(require("./modules/admin/admin.routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: env_1.env.clientUrl,
    credentials: true,
}));
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use("/api/admin", admin_routes_1.default);
app.get("/api/health", (_req, res) => {
    res.json({ ok: true, message: "Server is running" });
});
app.use("/api/auth", auth_routes_1.default);
app.use("/api/subjects", subjects_routes_1.default);
app.use("/api/topics", theory_routes_1.default);
app.use("/api/quiz", quiz_routes_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map