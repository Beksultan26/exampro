import jwt from "jsonwebtoken";
import { env } from "../config/env";

export function signAccessToken(payload: { userId: string; role: string }) {
  return jwt.sign(payload, env.jwtAccessSecret, { expiresIn: "7d" });
}