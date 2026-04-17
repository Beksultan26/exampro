import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";

export function normalizeEmail(email: string): string {
  return String(email).trim().toLowerCase();
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(String(password), 10);
}

export async function comparePassword(
  password: string,
  passwordHash: string
): Promise<boolean> {
  return bcrypt.compare(String(password), passwordHash);
}

export function signAccessToken(user: {
  id: string;
  email: string;
  role: string;
}) {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
    },
    env.accessSecret,
    {
      expiresIn: "7d",
    }
  );
}