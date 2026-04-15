import { Request, Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import {
  getCurrentUser,
  loginUser,
  registerUser,
  resetPassword,
  sendForgotPasswordCode,
  verifyOtp,
} from "./auth.service";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  verifyOtpSchema,
} from "./auth.validation";

export async function registerController(req: Request, res: Response) {
  const parsed = registerSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Ошибка валидации",
      errors: parsed.error.flatten(),
    });
  }

  try {
    const result = await registerUser(
      parsed.data.name,
      parsed.data.email,
      parsed.data.password
    );

    return res.status(201).json(result);
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    const message =
      error instanceof Error ? error.message : "Ошибка регистрации";

    if (message === "Пользователь с таким email уже существует") {
      return res.status(409).json({ message });
    }

    return res.status(500).json({
      message,
    });
  }
}

export async function loginController(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Ошибка валидации",
      errors: parsed.error.flatten(),
    });
  }

  try {
    const result = await loginUser(parsed.data.email, parsed.data.password);
    return res.status(200).json(result);
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    const message = error instanceof Error ? error.message : "Ошибка входа";

    if (message === "Неверный email или пароль") {
      return res.status(401).json({ message });
    }

    return res.status(500).json({
      message,
    });
  }
}

export async function verifyOtpController(req: Request, res: Response) {
  const parsed = verifyOtpSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Ошибка валидации",
      errors: parsed.error.flatten(),
    });
  }

  try {
    const result = await verifyOtp(parsed.data.email, parsed.data.code);
    return res.status(200).json(result);
  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);

    const message =
      error instanceof Error ? error.message : "Ошибка подтверждения";

    if (
      message === "Код не найден" ||
      message === "Срок действия кода истёк" ||
      message === "Слишком много неверных попыток" ||
      message === "Неверный код"
    ) {
      return res.status(400).json({ message });
    }

    return res.status(500).json({
      message,
    });
  }
}

export async function forgotPasswordController(req: Request, res: Response) {
  const parsed = forgotPasswordSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Ошибка валидации",
      errors: parsed.error.flatten(),
    });
  }

  try {
    const result = await sendForgotPasswordCode(parsed.data.email);
    return res.status(200).json(result);
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);

    const message =
      error instanceof Error ? error.message : "Ошибка отправки кода";

    return res.status(500).json({
      message,
    });
  }
}

export async function resetPasswordController(req: Request, res: Response) {
  const parsed = resetPasswordSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Ошибка валидации",
      errors: parsed.error.flatten(),
    });
  }

  try {
    const result = await resetPassword(
      parsed.data.email,
      parsed.data.code,
      parsed.data.newPassword
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);

    const message =
      error instanceof Error ? error.message : "Ошибка сброса пароля";

    if (
      message === "Код не найден" ||
      message === "Срок действия кода истёк" ||
      message === "Слишком много неверных попыток" ||
      message === "Неверный код" ||
      message === "Пользователь не найден"
    ) {
      return res.status(400).json({ message });
    }

    return res.status(500).json({
      message,
    });
  }
}

export async function meController(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Не авторизован" });
    }

    const user = await getCurrentUser(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("ME ERROR:", error);

    const message =
      error instanceof Error ? error.message : "Ошибка получения пользователя";

    return res.status(500).json({ message });
  }
}