import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../config/db";
import { env } from "../../config/env";
import { sendPasswordResetEmail } from "../../config/mailer";

function normalizeEmail(email: string): string {
  return String(email).trim().toLowerCase();
}

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function getExpiresAt(): Date {
  const minutes = Number(process.env.OTP_EXPIRES_MINUTES || 10);
  return new Date(Date.now() + minutes * 60 * 1000);
}

function signAccessToken(user: { id: string; email: string; role: string }) {
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

export async function registerController(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Имя, email и пароль обязательны",
      });
    }

    const normalizedEmail = normalizeEmail(email);

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Пользователь с таким email уже существует",
      });
    }

    const passwordHash = await bcrypt.hash(String(password), 10);

    const user = await prisma.user.create({
      data: {
        name: String(name).trim(),
        email: normalizedEmail,
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return res.status(201).json({
      message: "Регистрация прошла успешно",
      user,
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({
      message: "Ошибка регистрации",
    });
  }
}

export async function loginController(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email и пароль обязательны",
      });
    }

    const normalizedEmail = normalizeEmail(email);

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return res.status(401).json({
        message: "Неверный email или пароль",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      String(password),
      user.passwordHash
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Неверный email или пароль",
      });
    }

    const accessToken = signAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return res.status(200).json({
      message: "Вход выполнен успешно",
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({
      message: "Ошибка входа",
    });
  }
}

export async function forgotPasswordController(req: Request, res: Response) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email обязателен",
      });
    }

    const normalizedEmail = normalizeEmail(email);

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    const code = generateCode();
    const codeHash = await bcrypt.hash(code, 10);
    const expiresAt = getExpiresAt();

    await prisma.passwordResetOtp.deleteMany({
      where: { email: normalizedEmail },
    });

    await prisma.passwordResetOtp.create({
      data: {
        email: normalizedEmail,
        codeHash,
        expiresAt,
        attempts: 0,
      },
    });

    await sendPasswordResetEmail(normalizedEmail, code);

    return res.status(200).json({
      message: "Код для сброса пароля отправлен на email",
      email: normalizedEmail,
    });
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);
    return res.status(500).json({
      message: "Не удалось отправить код для сброса пароля",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function resetPasswordController(req: Request, res: Response) {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({
        message: "Email, код и новый пароль обязательны",
      });
    }

    if (String(newPassword).length < 6) {
      return res.status(400).json({
        message: "Пароль должен быть не короче 6 символов",
      });
    }

    const normalizedEmail = normalizeEmail(email);

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    const resetOtp = await prisma.passwordResetOtp.findFirst({
      where: { email: normalizedEmail },
      orderBy: { createdAt: "desc" },
    });

    if (!resetOtp) {
      return res.status(400).json({
        message: "Код для сброса не был запрошен",
      });
    }

    if (resetOtp.expiresAt.getTime() < Date.now()) {
      await prisma.passwordResetOtp.delete({
        where: { id: resetOtp.id },
      });

      return res.status(400).json({
        message: "Срок действия кода истёк",
      });
    }

    const isCodeValid = await bcrypt.compare(
      String(code),
      resetOtp.codeHash
    );

    if (!isCodeValid) {
      await prisma.passwordResetOtp.update({
        where: { id: resetOtp.id },
        data: {
          attempts: resetOtp.attempts + 1,
        },
      });

      return res.status(400).json({
        message: "Неверный код для сброса",
      });
    }

    const passwordHash = await bcrypt.hash(String(newPassword), 10);

    await prisma.user.update({
      where: { email: normalizedEmail },
      data: {
        passwordHash,
      },
    });

    await prisma.passwordResetOtp.delete({
      where: { id: resetOtp.id },
    });

    return res.status(200).json({
      message: "Пароль успешно изменён",
    });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);
    return res.status(500).json({
      message: "Ошибка сброса пароля",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function meController(req: any, res: Response) {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Не авторизован",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("ME ERROR:", error);
    return res.status(500).json({
      message: "Ошибка получения профиля",
    });
  }
}