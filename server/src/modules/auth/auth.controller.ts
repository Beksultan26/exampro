import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { prisma } from "../../lib/prisma";
import { sendEmail } from "../../lib/send-email";

function signToken(userId: string, email: string, role: string) {
  return jwt.sign(
    { userId, email, role },
    process.env.JWT_ACCESS_SECRET || "secret",
    { expiresIn: "7d" }
  );
}

export async function loginController(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: "Неверный email или пароль" });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      return res.status(401).json({ message: "Неверный email или пароль" });
    }

    const accessToken = signToken(user.id, user.email, user.role);

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
    console.error(error);
    return res.status(500).json({ message: "Ошибка входа" });
  }
}

export async function meController(req: any, res: Response) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
      },
    });

    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Ошибка получения профиля" });
  }
}

export async function forgotPasswordController(req: Request, res: Response) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email обязателен" });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const codeHash = await bcrypt.hash(resetCode, 10);

    await prisma.loginOtp.create({
      data: {
        email,
        codeHash,
        expiresAt: new Date(Date.now() + 1000 * 60 * 10),
      },
    });

    await sendEmail({
      to: email,
      subject: "Сброс пароля ExamPro",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Сброс пароля</h2>
          <p>Ваш код для восстановления пароля:</p>
          <h1>${resetCode}</h1>
          <p>Код действует 10 минут.</p>
        </div>
      `,
    });

    return res.json({ message: "Код отправлен" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Ошибка отправки кода" });
  }
}

export async function resetPasswordController(req: Request, res: Response) {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({ message: "Заполните все поля" });
    }

    const otp = await prisma.loginOtp.findFirst({
      where: { email },
      orderBy: { createdAt: "desc" },
    });

    if (!otp) {
      return res.status(400).json({ message: "Код не найден" });
    }

    if (otp.expiresAt < new Date()) {
      return res.status(400).json({ message: "Код истёк" });
    }

    const isValidCode = await bcrypt.compare(code, otp.codeHash);

    if (!isValidCode) {
      return res.status(400).json({ message: "Неверный код" });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email },
      data: { passwordHash },
    });

    return res.json({ message: "Пароль успешно изменён" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Ошибка сброса пароля" });
  }
}