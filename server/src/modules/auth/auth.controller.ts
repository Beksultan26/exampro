import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../../config/db";
import {
  comparePassword,
  hashPassword,
  normalizeEmail,
  signAccessToken,
} from "./auth.service";
import { AuthRequest } from "../../middlewares/auth.middleware";

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function registerController(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Заполните все поля" });
    }

    const normalizedEmail = normalizeEmail(email);

    const exists = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (exists) {
      return res.status(409).json({ message: "Пользователь уже существует" });
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        passwordHash,
      },
    });

    const accessToken = signAccessToken(user);

    return res.status(201).json({
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "Ошибка регистрации" });
  }
}

export async function loginController(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Введите email и пароль" });
    }

    const normalizedEmail = normalizeEmail(email);

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user || !user.passwordHash) {
      return res.status(401).json({ message: "Неверный email или пароль" });
    }

    const isValid = await comparePassword(password, user.passwordHash);

    if (!isValid) {
      return res.status(401).json({ message: "Неверный email или пароль" });
    }

    const accessToken = signAccessToken(user);

    return res.json({
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Ошибка входа" });
  }
}

export async function meController(req: AuthRequest, res: Response) {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ message: "Не авторизован" });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
    });

    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error) {
    console.error("Me error:", error);
    return res.status(500).json({ message: "Ошибка получения профиля" });
  }
}

export async function verifyLoginOtpController(req: Request, res: Response) {
  return res.status(400).json({
    message: "OTP вход сейчас отключен. Используйте обычный вход или Google.",
  });
}

export async function forgotPasswordController(req: Request, res: Response) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Введите email" });
    }

    const normalizedEmail = normalizeEmail(email);

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return res.json({
        message: "Если email существует, код будет отправлен",
      });
    }

    const code = generateCode();
    const codeHash = await bcrypt.hash(code, 10);

    await prisma.passwordResetOtp.create({
      data: {
        email: normalizedEmail,
        codeHash,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    console.log(`Password reset code for ${normalizedEmail}: ${code}`);

    return res.json({
      message: "Код восстановления создан",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({ message: "Ошибка восстановления пароля" });
  }
}

export async function resetPasswordController(req: Request, res: Response) {
  try {
    const { email, code, password } = req.body;

    if (!email || !code || !password) {
      return res.status(400).json({ message: "Заполните все поля" });
    }

    const normalizedEmail = normalizeEmail(email);

    const otp = await prisma.passwordResetOtp.findFirst({
      where: {
        email: normalizedEmail,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!otp) {
      return res.status(400).json({ message: "Код недействителен или истёк" });
    }

    const isCodeValid = await bcrypt.compare(code, otp.codeHash);

    if (!isCodeValid) {
      return res.status(400).json({ message: "Неверный код" });
    }

    const passwordHash = await hashPassword(password);

    await prisma.user.update({
      where: { email: normalizedEmail },
      data: { passwordHash },
    });

    await prisma.passwordResetOtp.deleteMany({
      where: { email: normalizedEmail },
    });

    return res.json({ message: "Пароль успешно изменён" });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ message: "Ошибка смены пароля" });
  }
}