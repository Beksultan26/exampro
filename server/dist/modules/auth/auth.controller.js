"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerController = registerController;
exports.loginController = loginController;
exports.verifyOtpController = verifyOtpController;
exports.forgotPasswordController = forgotPasswordController;
exports.resetPasswordController = resetPasswordController;
exports.meController = meController;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../../config/db");
const env_1 = require("../../config/env");
const mailer_1 = require("../../config/mailer");
function normalizeEmail(email) {
    return String(email).trim().toLowerCase();
}
function generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
function getExpiresAt() {
    const minutes = Number(process.env.OTP_EXPIRES_MINUTES || 10);
    return new Date(Date.now() + minutes * 60 * 1000);
}
function signAccessToken(user) {
    return jsonwebtoken_1.default.sign({
        userId: user.id,
        email: user.email,
        role: user.role,
    }, env_1.env.accessSecret, {
        expiresIn: "7d",
    });
}
async function registerController(req, res) {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Имя, email и пароль обязательны",
            });
        }
        const normalizedEmail = normalizeEmail(email);
        const existingUser = await db_1.prisma.user.findUnique({
            where: { email: normalizedEmail },
        });
        if (existingUser) {
            return res.status(409).json({
                message: "Пользователь с таким email уже существует",
            });
        }
        const passwordHash = await bcryptjs_1.default.hash(String(password), 10);
        const user = await db_1.prisma.user.create({
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
    }
    catch (error) {
        console.error("REGISTER ERROR:", error);
        return res.status(500).json({
            message: "Ошибка регистрации",
        });
    }
}
async function loginController(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "Email и пароль обязательны",
            });
        }
        const normalizedEmail = normalizeEmail(email);
        const user = await db_1.prisma.user.findUnique({
            where: { email: normalizedEmail },
        });
        if (!user) {
            return res.status(401).json({
                message: "Неверный email или пароль",
            });
        }
        const isPasswordValid = await bcryptjs_1.default.compare(String(password), user.passwordHash);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Неверный email или пароль",
            });
        }
        const code = generateCode();
        const codeHash = await bcryptjs_1.default.hash(code, 10);
        const expiresAt = getExpiresAt();
        await db_1.prisma.authOtp.deleteMany({
            where: { email: normalizedEmail },
        });
        await db_1.prisma.authOtp.create({
            data: {
                email: normalizedEmail,
                codeHash,
                expiresAt,
            },
        });
        try {
            await (0, mailer_1.sendOtpEmail)(normalizedEmail, code);
        }
        catch (emailError) {
            console.error("EMAIL ERROR IN loginController:", emailError);
            return res.status(500).json({
                message: "Не удалось отправить код подтверждения",
            });
        }
        return res.status(200).json({
            message: "Код подтверждения отправлен на email",
            requiresOtp: true,
            email: normalizedEmail,
        });
    }
    catch (error) {
        console.error("LOGIN ERROR:", error);
        return res.status(500).json({
            message: "Ошибка входа",
        });
    }
}
async function verifyOtpController(req, res) {
    try {
        const { email, code } = req.body;
        if (!email || !code) {
            return res.status(400).json({
                message: "Email и код обязательны",
            });
        }
        const normalizedEmail = normalizeEmail(email);
        const user = await db_1.prisma.user.findUnique({
            where: { email: normalizedEmail },
        });
        if (!user) {
            return res.status(404).json({
                message: "Пользователь не найден",
            });
        }
        const otp = await db_1.prisma.authOtp.findFirst({
            where: { email: normalizedEmail },
            orderBy: { createdAt: "desc" },
        });
        if (!otp) {
            return res.status(400).json({
                message: "Код не был запрошен",
            });
        }
        if (otp.expiresAt.getTime() < Date.now()) {
            await db_1.prisma.authOtp.delete({
                where: { id: otp.id },
            });
            return res.status(400).json({
                message: "Срок действия кода истёк",
            });
        }
        const isCodeValid = await bcryptjs_1.default.compare(String(code), otp.codeHash);
        if (!isCodeValid) {
            const nextAttempts = otp.attempts + 1;
            await db_1.prisma.authOtp.update({
                where: { id: otp.id },
                data: {
                    attempts: nextAttempts,
                },
            });
            return res.status(400).json({
                message: "Неверный код",
            });
        }
        await db_1.prisma.authOtp.delete({
            where: { id: otp.id },
        });
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
    }
    catch (error) {
        console.error("VERIFY OTP ERROR:", error);
        return res.status(500).json({
            message: "Ошибка подтверждения кода",
        });
    }
}
async function forgotPasswordController(req, res) {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                message: "Email обязателен",
            });
        }
        const normalizedEmail = normalizeEmail(email);
        const user = await db_1.prisma.user.findUnique({
            where: { email: normalizedEmail },
        });
        if (!user) {
            return res.status(404).json({
                message: "Пользователь не найден",
            });
        }
        const code = generateCode();
        const codeHash = await bcryptjs_1.default.hash(code, 10);
        const expiresAt = getExpiresAt();
        await db_1.prisma.passwordResetOtp.deleteMany({
            where: { email: normalizedEmail },
        });
        await db_1.prisma.passwordResetOtp.create({
            data: {
                email: normalizedEmail,
                codeHash,
                expiresAt,
            },
        });
        try {
            await (0, mailer_1.sendPasswordResetEmail)(normalizedEmail, code);
        }
        catch (emailError) {
            console.error("RESET EMAIL ERROR:", emailError);
            return res.status(500).json({
                message: "Не удалось отправить код для сброса пароля",
            });
        }
        return res.status(200).json({
            message: "Код для сброса пароля отправлен на email",
            email: normalizedEmail,
        });
    }
    catch (error) {
        console.error("FORGOT PASSWORD ERROR:", error);
        return res.status(500).json({
            message: "Ошибка запроса сброса пароля",
        });
    }
}
async function resetPasswordController(req, res) {
    try {
        const { email, code, newPassword } = req.body;
        if (!email || !code || !newPassword) {
            return res.status(400).json({
                message: "Email, код и новый пароль обязательны",
            });
        }
        const normalizedEmail = normalizeEmail(email);
        const user = await db_1.prisma.user.findUnique({
            where: { email: normalizedEmail },
        });
        if (!user) {
            return res.status(404).json({
                message: "Пользователь не найден",
            });
        }
        const resetOtp = await db_1.prisma.passwordResetOtp.findFirst({
            where: { email: normalizedEmail },
            orderBy: { createdAt: "desc" },
        });
        if (!resetOtp) {
            return res.status(400).json({
                message: "Код для сброса не был запрошен",
            });
        }
        if (resetOtp.expiresAt.getTime() < Date.now()) {
            await db_1.prisma.passwordResetOtp.delete({
                where: { id: resetOtp.id },
            });
            return res.status(400).json({
                message: "Срок действия кода истёк",
            });
        }
        const isCodeValid = await bcryptjs_1.default.compare(String(code), resetOtp.codeHash);
        if (!isCodeValid) {
            const nextAttempts = resetOtp.attempts + 1;
            await db_1.prisma.passwordResetOtp.update({
                where: { id: resetOtp.id },
                data: {
                    attempts: nextAttempts,
                },
            });
            return res.status(400).json({
                message: "Неверный код для сброса",
            });
        }
        const passwordHash = await bcryptjs_1.default.hash(String(newPassword), 10);
        await db_1.prisma.user.update({
            where: { email: normalizedEmail },
            data: {
                passwordHash,
            },
        });
        await db_1.prisma.passwordResetOtp.delete({
            where: { id: resetOtp.id },
        });
        return res.status(200).json({
            message: "Пароль успешно изменён",
        });
    }
    catch (error) {
        console.error("RESET PASSWORD ERROR:", error);
        return res.status(500).json({
            message: "Ошибка сброса пароля",
        });
    }
}
async function meController(req, res) {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({
                message: "Не авторизован",
            });
        }
        const user = await db_1.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });
        if (!user) {
            return res.status(404).json({
                message: "Пользователь не найден",
            });
        }
        return res.status(200).json(user);
    }
    catch (error) {
        console.error("ME ERROR:", error);
        return res.status(500).json({
            message: "Ошибка получения профиля",
        });
    }
}
//# sourceMappingURL=auth.controller.js.map