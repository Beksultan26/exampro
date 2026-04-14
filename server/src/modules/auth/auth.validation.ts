import { z } from "zod";

const emailField = z
  .string()
  .trim()
  .toLowerCase()
  .email("Неверный email")
  .max(100, "Email слишком длинный");

const strongPasswordField = z
  .string()
  .min(8, "Пароль должен быть минимум 8 символов")
  .max(72, "Пароль слишком длинный")
  .regex(/[A-ZА-Я]/, "Пароль должен содержать хотя бы одну заглавную букву")
  .regex(/[a-zа-я]/, "Пароль должен содержать хотя бы одну строчную букву")
  .regex(/[0-9]/, "Пароль должен содержать хотя бы одну цифру");

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Имя слишком короткое").max(50, "Имя слишком длинное"),
  email: emailField,
  password: strongPasswordField,
});

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, "Введите пароль").max(72, "Пароль слишком длинный"),
});

export const verifyOtpSchema = z.object({
  email: emailField,
  code: z.string().trim().regex(/^\d{6}$/, "Код должен состоять из 6 цифр"),
});

export const forgotPasswordSchema = z.object({
  email: emailField,
});

export const resetPasswordSchema = z.object({
  email: emailField,
  code: z.string().trim().regex(/^\d{6}$/, "Код должен состоять из 6 цифр"),
  newPassword: strongPasswordField,
});