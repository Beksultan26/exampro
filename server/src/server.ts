import app from "./app";
import { env } from "./config/env";
import path from "path";
import express from "express";

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.listen(env.port, () => {
  console.log(`Server started on http://localhost:${env.port}`);
});