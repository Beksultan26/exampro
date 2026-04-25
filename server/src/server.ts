import app from "./app";
import { env } from "./config/env";
import path from "path";
import express from "express";
import profileRoutes from "./modules/profile/profile.routes";

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/api/profile", profileRoutes);
app.listen(env.port, () => {
  console.log(`Server started on http://localhost:${env.port}`);
});