import { Router } from "express";
import {
  forgotPasswordController,
  loginController,
  meController,
  registerController,
  resetPasswordController,
} from "./auth.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { authRateLimiter } from "./auth.rate-limit";

const router = Router();

router.post("/register", authRateLimiter, registerController);
router.post("/login", authRateLimiter, loginController);
router.post("/forgot-password", authRateLimiter, forgotPasswordController);
router.post("/reset-password", authRateLimiter, resetPasswordController);
router.get("/me", authMiddleware, meController);

export default router;