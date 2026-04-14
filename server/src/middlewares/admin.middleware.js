"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = adminMiddleware;
const express_1 = require("express");
const auth_middleware_1 = require("./auth.middleware");
function adminMiddleware(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ message: "Не авторизован" });
    }
    if (req.user.role !== "ADMIN") {
        return res.status(403).json({ message: "Доступ только для администратора" });
    }
    next();
}
//# sourceMappingURL=admin.middleware.js.map