"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.verifyOtpSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
const emailField = zod_1.z
    .string()
    .trim()
    .toLowerCase()
    .email("Неверный email")
    .max(100, "Email слишком длинный");
const strongPasswordField = zod_1.z
    .string()
    .min(8, "Пароль должен быть минимум 8 символов")
    .max(72, "Пароль слишком длинный")
    .regex(/[A-ZА-Я]/, "Пароль должен содержать хотя бы одну заглавную букву")
    .regex(/[a-zа-я]/, "Пароль должен содержать хотя бы одну строчную букву")
    .regex(/[0-9]/, "Пароль должен содержать хотя бы одну цифру");
exports.registerSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(2, "Имя слишком короткое").max(50, "Имя слишком длинное"),
    email: emailField,
    password: strongPasswordField,
});
exports.loginSchema = zod_1.z.object({
    email: emailField,
    password: zod_1.z.string().min(1, "Введите пароль").max(72, "Пароль слишком длинный"),
});
exports.verifyOtpSchema = zod_1.z.object({
    email: emailField,
    code: zod_1.z.string().trim().regex(/^\d{6}$/, "Код должен состоять из 6 цифр"),
});
exports.forgotPasswordSchema = zod_1.z.object({
    email: emailField,
});
exports.resetPasswordSchema = zod_1.z.object({
    email: emailField,
    code: zod_1.z.string().trim().regex(/^\d{6}$/, "Код должен состоять из 6 цифр"),
    newPassword: strongPasswordField,
});
//# sourceMappingURL=auth.validation.js.map