import { Router } from "express";
import { getTopicBySlugController } from "./theory.controller";

const router = Router();

router.get("/:slug", getTopicBySlugController);

export default router;