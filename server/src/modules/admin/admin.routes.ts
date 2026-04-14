import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { adminMiddleware } from "../../middlewares/admin.middleware";
import {
  createAdminQuestionController,
  createAdminSubjectController,
  createAdminTopicController,
  deleteAdminQuestionController,
  deleteAdminSubjectController,
  deleteAdminTopicController,
  getAdminQuestionsController,
  getAdminSubjectsController,
  getAdminTopicsController,
  updateAdminQuestionController,
  updateAdminSubjectController,
  updateAdminTopicController,
} from "./admin.controller";

const router = Router();

router.use(authMiddleware, adminMiddleware);

router.get("/subjects", getAdminSubjectsController);
router.post("/subjects", createAdminSubjectController);
router.put("/subjects/:id", updateAdminSubjectController);
router.delete("/subjects/:id", deleteAdminSubjectController);

router.get("/subjects/:slug/questions", getAdminQuestionsController);
router.post("/questions", createAdminQuestionController);
router.put("/questions/:id", updateAdminQuestionController);
router.delete("/questions/:id", deleteAdminQuestionController);

router.get("/subjects/:slug/topics", getAdminTopicsController);
router.post("/topics", createAdminTopicController);
router.put("/topics/:id", updateAdminTopicController);
router.delete("/topics/:id", deleteAdminTopicController);

export default router;