import jwt from "jsonwebtoken";
import { env } from "../config/env";

export function signAccessToken(payload: { userId: string; role: string }) {
  return jwt.sign(payload, env.accessSecret, { expiresIn: "7d" });
}