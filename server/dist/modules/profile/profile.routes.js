"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const db_1 = require("../../config/db");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = (0, express_1.Router)();
const storage = multer_1.default.diskStorage({
    destination: "uploads/",
    filename: (_req, file, cb) => {
        const ext = path_1.default.extname(file.originalname);
        cb(null, Date.now() + ext);
    },
});
const upload = (0, multer_1.default)({ storage });
router.post("/avatar", auth_middleware_1.authMiddleware, upload.single("avatar"), async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Не авторизован" });
        }
        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: "Файл не загружен" });
        }
        const avatarUrl = `/uploads/${file.filename}`;
        const user = await db_1.prisma.user.update({
            where: { id: req.user.userId },
            data: { avatarUrl },
        });
        res.json({
            avatarUrl: user.avatarUrl,
        });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ message: "Ошибка загрузки" });
    }
});
exports.default = router;
//# sourceMappingURL=profile.routes.js.map