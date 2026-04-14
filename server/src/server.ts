import express from "express";
import path from "path";
import app from "./app";
import { env } from "./config/env";

const publicPath = path.join(__dirname, "../public");

app.use(express.static(publicPath));

app.get("/{*any}", (_req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

app.listen(env.port, () => {
  console.log(`Server started on http://localhost:${env.port}`);
});