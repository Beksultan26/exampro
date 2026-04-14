import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import {
  getAttemptByIdController,
  getExamController,
  getQuizBySubjectController,
  getQuizHistoryController,
  submitExamController,
  submitQuizController,
} from "./quiz.controller";

const router = Router();

router.get("/exam", authMiddleware, getExamController);
router.get("/by-subject/:slug", authMiddleware, getQuizBySubjectController);

router.post("/exam/submit", authMiddleware, submitExamController);
router.post("/submit", authMiddleware, submitQuizController);

router.get("/history", authMiddleware, getQuizHistoryController);
router.get("/attempt/:id", authMiddleware, getAttemptByIdController);

export default router;