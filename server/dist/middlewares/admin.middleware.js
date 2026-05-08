"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = adminMiddleware;
function adminMiddleware(req, res, next) {
    const user = req.user;
    if (!user || user.role !== "ADMIN") {
        return res.status(403).json({ message: "Доступ запрещён" });
    }
    next();
}
//# sourceMappingURL=admin.middleware.js.map