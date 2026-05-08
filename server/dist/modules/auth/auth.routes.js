"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const auth_rate_limit_1 = require("./auth.rate-limit");
const auth_google_1 = require("./auth.google");
const router = (0, express_1.Router)();
router.post("/login", auth_rate_limit_1.authRateLimiter, auth_controller_1.loginController);
router.get("/me", auth_middleware_1.authMiddleware, auth_controller_1.meController);
router.post("/forgot-password", auth_rate_limit_1.authRateLimiter, auth_controller_1.forgotPasswordController);
router.post("/reset-password", auth_rate_limit_1.authRateLimiter, auth_controller_1.resetPasswordController);
router.get("/google", (_req, res) => {
    const url = (0, auth_google_1.getGoogleAuthUrl)();
    res.redirect(url);
});
router.get("/google/callback", async (req, res) => {
    try {
        const code = req.query.code;
        if (!code) {
            return res.redirect(`${process.env.CLIENT_URL}/login?error=google`);
        }
        const result = await (0, auth_google_1.handleGoogleCallback)(code);
        const token = encodeURIComponent(result.accessToken);
        const user = encodeURIComponent(JSON.stringify(result.user));
        return res.redirect(`${process.env.CLIENT_URL}/auth/google/callback?token=${token}&user=${user}`);
    }
    catch (error) {
        console.error("Google auth error:", error);
        return res.redirect(`${process.env.CLIENT_URL}/login?error=google`);
    }
});
exports.default = router;
//# sourceMappingURL=auth.routes.js.map