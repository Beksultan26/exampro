import { Router } from "express";
import {
  getSubjectBySlugController,
  getSubjectsController,
} from "./subjects.controller";

const router = Router();

router.get("/", getSubjectsController);
router.get("/:slug", getSubjectBySlugController);

export default router;