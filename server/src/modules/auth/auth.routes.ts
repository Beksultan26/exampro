import { Router } from "express";
import {
  loginController,
  meController,
} from "./auth.controller";

import { authMiddleware } from "../../middlewares/auth.middleware";
import { authRateLimiter } from "./auth.rate-limit";

import {
  getGoogleAuthUrl,
  handleGoogleCallback,
} from "./auth.google";

const router = Router();

router.post("/login", authRateLimiter, loginController);
router.get("/me", authMiddleware, meController);

router.get("/google", (_req, res) => {
  const url = getGoogleAuthUrl();
  res.redirect(url);
});

router.get("/google/callback", async (req, res) => {
  try {
    const code = req.query.code as string;

    if (!code) {
      return res.redirect(`${process.env.CLIENT_URL}/login?error=google`);
    }

    const result = await handleGoogleCallback(code);

    const token = encodeURIComponent(result.accessToken);
    const user = encodeURIComponent(JSON.stringify(result.user));

    return res.redirect(
      `${process.env.CLIENT_URL}/auth/google/callback?token=${token}&user=${user}`
    );
  } catch (error) {
    console.error("Google auth error:", error);
    return res.redirect(`${process.env.CLIENT_URL}/login?error=google`);
  }
});

export default router;