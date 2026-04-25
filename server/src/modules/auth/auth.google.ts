import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { prisma } from "../../config/db";
import { env } from "../../config/env";

const googleClient = new OAuth2Client(
  env.googleClientId,
  env.googleClientSecret,
  env.googleCallbackUrl
);

function createAccessToken(user: {
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
    env.jwtAccessSecret,
    { expiresIn: "7d" }
  );
}

export function getGoogleAuthUrl() {
  return googleClient.generateAuthUrl({
    access_type: "offline",
    scope: ["profile", "email"],
    prompt: "select_account",
  });
}

export async function handleGoogleCallback(code: string) {
  const { tokens } = await googleClient.getToken(code);

  if (!tokens.id_token) {
    throw new Error("Google ID token не получен");
  }

  const ticket = await googleClient.verifyIdToken({
    idToken: tokens.id_token,
    audience: env.googleClientId,
  });

  const payload = ticket.getPayload();

  if (!payload?.email) {
    throw new Error("Email не получен от Google");
  }

  const email = payload.email.toLowerCase();

  let user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        name: payload.name || "Google User",
        email,
        passwordHash: "",
        googleId: payload.sub,
        avatarUrl: payload.picture || null,
      },
    });
  } else {
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        googleId: user.googleId || payload.sub,
        avatarUrl: payload.picture || user.avatarUrl,
      },
    });
  }

  const accessToken = createAccessToken(user);

  return {
    accessToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
    },
  };
}