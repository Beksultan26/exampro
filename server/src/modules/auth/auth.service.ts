import bcrypt from "bcryptjs";
import { prisma } from "../../config/db";
import { signAccessToken } from "../../utils/jwt";
import { sendOtpEmail, sendPasswordResetEmail } from "../../utils/mailer";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function sanitizeName(name: string) {
  return name.trim();
}

function generateOtpCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function registerUser(name: string, email: string, password: string) {
  const normalizedEmail = normalizeEmail(email);
  const normalizedName = sanitizeName(name);

  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existingUser) {
    throw new Error("Пользователь с таким email уже существует");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name: normalizedName,
      email: normalizedEmail,
      passwordHash,
    },
  });

  const accessToken = signAccessToken({
    userId: user.id,
    role: user.role,
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    accessToken,
  };
}

export async function loginUser(email: string, password: string) {
  const normalizedEmail = normalizeEmail(email);

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    throw new Error("Неверный email или пароль");
  }

  const isValidPassword = await bcrypt.compare(password, user.passwordHash);

  if (!isValidPassword) {
    throw new Error("Неверный email или пароль");
  }

  const code = generateOtpCode();
  const codeHash = await bcrypt.hash(code, 10);
  const expiresMinutes = Number(process.env.OTP_EXPIRES_MINUTES || 10);
  const expiresAt = new Date(Date.now() + expiresMinutes * 60 * 1000);

  await prisma.authOtp.deleteMany({
    where: { email: normalizedEmail },
  });

  await prisma.authOtp.create({
    data: {
      email: normalizedEmail,
      codeHash,
      expiresAt,
    },
  });

  try {
    await sendOtpEmail(normalizedEmail, code);
  } catch (error) {
    console.error("EMAIL ERROR IN loginUser:", error);
    throw error;
  }

  return {
    requires2fa: true,
    email: normalizedEmail,
    message: "Код подтверждения отправлен на email",
  };
}

export async function verifyOtp(email: string, code: string) {
  const normalizedEmail = normalizeEmail(email);

  const record = await prisma.authOtp.findFirst({
    where: { email: normalizedEmail },
    orderBy: { createdAt: "desc" },
  });

  if (!record) {
    throw new Error("Код не найден");
  }

  if (record.expiresAt.getTime() < Date.now()) {
    await prisma.authOtp.delete({ where: { id: record.id } });
    throw new Error("Срок действия кода истёк");
  }

  if (record.attempts >= 5) {
    throw new Error("Слишком много неверных попыток");
  }

  const isValidCode = await bcrypt.compare(code, record.codeHash);

  if (!isValidCode) {
    await prisma.authOtp.update({
      where: { id: record.id },
      data: { attempts: { increment: 1 } },
    });

    throw new Error("Неверный код");
  }

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    throw new Error("Пользователь не найден");
  }

  await prisma.authOtp.delete({
    where: { id: record.id },
  });

  const accessToken = signAccessToken({
    userId: user.id,
    role: user.role,
  });

  return {
    accessToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}

export async function sendForgotPasswordCode(email: string) {
  const normalizedEmail = normalizeEmail(email);

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    return {
      message: "Если аккаунт существует, код для сброса отправлен на email",
    };
  }

  const code = generateOtpCode();
  const codeHash = await bcrypt.hash(code, 10);
  const expiresMinutes = Number(process.env.OTP_EXPIRES_MINUTES || 10);
  const expiresAt = new Date(Date.now() + expiresMinutes * 60 * 1000);

  await prisma.passwordResetOtp.deleteMany({
    where: { email: normalizedEmail },
  });

  await prisma.passwordResetOtp.create({
    data: {
      email: normalizedEmail,
      codeHash,
      expiresAt,
    },
  });

  try {
    await sendPasswordResetEmail(normalizedEmail, code);
  } catch (error) {
    console.error("EMAIL ERROR IN sendForgotPasswordCode:", error);
    throw error;
  }

  return {
    message: "Если аккаунт существует, код для сброса отправлен на email",
  };
}

export async function resetPassword(email: string, code: string, newPassword: string) {
  const normalizedEmail = normalizeEmail(email);

  const record = await prisma.passwordResetOtp.findFirst({
    where: { email: normalizedEmail },
    orderBy: { createdAt: "desc" },
  });

  if (!record) {
    throw new Error("Код не найден");
  }

  if (record.expiresAt.getTime() < Date.now()) {
    await prisma.passwordResetOtp.delete({
      where: { id: record.id },
    });
    throw new Error("Срок действия кода истёк");
  }

  if (record.attempts >= 5) {
    throw new Error("Слишком много неверных попыток");
  }

  const isValidCode = await bcrypt.compare(code, record.codeHash);

  if (!isValidCode) {
    await prisma.passwordResetOtp.update({
      where: { id: record.id },
      data: {
        attempts: { increment: 1 },
      },
    });

    throw new Error("Неверный код");
  }

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    throw new Error("Пользователь не найден");
  }

  const newPasswordHash = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash: newPasswordHash,
    },
  });

  await prisma.passwordResetOtp.delete({
    where: { id: record.id },
  });

  await prisma.authOtp.deleteMany({
    where: { email: normalizedEmail },
  });

  return {
    message: "Пароль успешно обновлён",
  };
}

export async function getCurrentUser(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
}