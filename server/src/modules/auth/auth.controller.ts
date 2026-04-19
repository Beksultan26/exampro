import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../config/db";
import { env } from "../../config/env";
import { sendPasswordResetEmail } from "../../config/mailer";

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
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
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

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
        message: "Код не найден. Запросите новый код",
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

    const isValidCode = await bcrypt.compare(code, resetOtp.codeHash);

    if (!isValidCode) {
      await prisma.passwordResetOtp.update({
        where: { id: resetOtp.id },
        data: {
          attempts: resetOtp.attempts + 1,
        },
      });

      return res.status(400).json({
        message: "Неверный код",
      });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

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
      message: "Пароль успешно изменен",
    });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);

    return res.status(500).json({
      message: "Ошибка сброса пароля",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}