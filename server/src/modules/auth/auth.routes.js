"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const auth_rate_limit_1 = require("./auth.rate-limit");
const router = (0, express_1.Router)();
router.post("/register", auth_rate_limit_1.authRateLimiter, auth_controller_1.registerController);
router.post("/login", auth_rate_limit_1.authRateLimiter, auth_controller_1.loginController);
router.post("/verify-otp", auth_rate_limit_1.authRateLimiter, auth_controller_1.verifyOtpController);
router.post("/forgot-password", auth_rate_limit_1.authRateLimiter, auth_controller_1.forgotPasswordController);
router.post("/reset-password", auth_rate_limit_1.authRateLimiter, auth_controller_1.resetPasswordController);
router.get("/me", auth_middleware_1.authMiddleware, auth_controller_1.meController);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map