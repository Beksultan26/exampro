"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRateLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
exports.authRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 5 * 60 * 1000, // 5 минут
    max: 50, // увеличили лимит
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "Слишком много попыток. Попробуйте позже.",
    },
    skipFailedRequests: true,
});
//# sourceMappingURL=auth.rate-limit.js.map