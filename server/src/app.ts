import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./modules/auth/auth.routes";
import subjectsRoutes from "./modules/subjects/subjects.routes";
import theoryRoutes from "./modules/theory/theory.routes";
import quizRoutes from "./modules/quiz/quiz.routes";
import adminRoutes from "./modules/admin/admin.routes";
import { env } from "./config/env";

const app = express();

// Важно для Railway / rate-limit / X-Forwarded-For
app.set("trust proxy", 1);

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, message: "Server is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/subjects", subjectsRoutes);
app.use("/api/topics", theoryRoutes);
app.use("/api/quiz", quizRoutes);

export default app;