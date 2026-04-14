"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerController = registerController;
exports.loginController = loginController;
exports.verifyOtpController = verifyOtpController;
exports.forgotPasswordController = forgotPasswordController;
exports.resetPasswordController = resetPasswordController;
exports.meController = meController;
const express_1 = require("express");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const auth_service_1 = require("./auth.service");
const auth_validation_1 = require("./auth.validation");
async function registerController(req, res) {
    const parsed = auth_validation_1.registerSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({
            message: "Ошибка валидации",
            errors: parsed.error.flatten(),
        });
    }
    try {
        const result = await (0, auth_service_1.registerUser)(parsed.data.name, parsed.data.email, parsed.data.password);
        return res.status(201).json(result);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Ошибка регистрации";
        if (message === "Пользователь с таким email уже существует") {
            return res.status(409).json({ message });
        }
        return res.status(500).json({ message: "Внутренняя ошибка сервера" });
    }
}
async function loginController(req, res) {
    const parsed = auth_validation_1.loginSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({
            message: "Ошибка валидации",
            errors: parsed.error.flatten(),
        });
    }
    try {
        const result = await (0, auth_service_1.loginUser)(parsed.data.email, parsed.data.password);
        return res.status(200).json(result);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Ошибка входа";
        if (message === "Неверный email или пароль") {
            return res.status(401).json({ message });
        }
        return res.status(500).json({ message: "Внутренняя ошибка сервера" });
    }
}
async function verifyOtpController(req, res) {
    const parsed = auth_validation_1.verifyOtpSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({
            message: "Ошибка валидации",
            errors: parsed.error.flatten(),
        });
    }
    try {
        const result = await (0, auth_service_1.verifyOtp)(parsed.data.email, parsed.data.code);
        return res.status(200).json(result);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Ошибка подтверждения";
        if (message === "Код не найден" ||
            message === "Срок действия кода истёк" ||
            message === "Слишком много неверных попыток" ||
            message === "Неверный код") {
            return res.status(400).json({ message });
        }
        return res.status(500).json({ message: "Внутренняя ошибка сервера" });
    }
}
async function forgotPasswordController(req, res) {
    const parsed = auth_validation_1.forgotPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({
            message: "Ошибка валидации",
            errors: parsed.error.flatten(),
        });
    }
    try {
        const result = await (0, auth_service_1.sendForgotPasswordCode)(parsed.data.email);
        return res.status(200).json(result);
    }
    catch {
        return res.status(500).json({
            message: "Внутренняя ошибка сервера",
        });
    }
}
async function resetPasswordController(req, res) {
    const parsed = auth_validation_1.resetPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({
            message: "Ошибка валидации",
            errors: parsed.error.flatten(),
        });
    }
    try {
        const result = await (0, auth_service_1.resetPassword)(parsed.data.email, parsed.data.code, parsed.data.newPassword);
        return res.status(200).json(result);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Ошибка сброса пароля";
        if (message === "Код не найден" ||
            message === "Срок действия кода истёк" ||
            message === "Слишком много неверных попыток" ||
            message === "Неверный код" ||
            message === "Пользователь не найден") {
            return res.status(400).json({ message });
        }
        return res.status(500).json({
            message: "Внутренняя ошибка сервера",
        });
    }
}
async function meController(req, res) {
    if (!req.user) {
        return res.status(401).json({ message: "Не авторизован" });
    }
    const user = await (0, auth_service_1.getCurrentUser)(req.user.userId);
    if (!user) {
        return res.status(404).json({ message: "Пользователь не найден" });
    }
    return res.status(200).json(user);
}
//# sourceMappingURL=auth.controller.js.map