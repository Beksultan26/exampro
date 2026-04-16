"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = registerUser;
exports.loginUser = loginUser;
exports.verifyOtp = verifyOtp;
exports.sendForgotPasswordCode = sendForgotPasswordCode;
exports.resetPassword = resetPassword;
exports.getCurrentUser = getCurrentUser;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = require("../../config/db");
const jwt_1 = require("../../utils/jwt");
const mailer_1 = require("../../config/mailer");
function normalizeEmail(email) {
    return email.trim().toLowerCase();
}
function sanitizeName(name) {
    return name.trim();
}
function generateOtpCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
async function registerUser(name, email, password) {
    const normalizedEmail = normalizeEmail(email);
    const normalizedName = sanitizeName(name);
    const existingUser = await db_1.prisma.user.findUnique({
        where: { email: normalizedEmail },
    });
    if (existingUser) {
        throw new Error("Пользователь с таким email уже существует");
    }
    const passwordHash = await bcryptjs_1.default.hash(password, 12);
    const user = await db_1.prisma.user.create({
        data: {
            name: normalizedName,
            email: normalizedEmail,
            passwordHash,
        },
    });
    const accessToken = (0, jwt_1.signAccessToken)({
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
async function loginUser(email, password) {
    const normalizedEmail = normalizeEmail(email);
    const user = await db_1.prisma.user.findUnique({
        where: { email: normalizedEmail },
    });
    if (!user) {
        throw new Error("Неверный email или пароль");
    }
    const isValidPassword = await bcryptjs_1.default.compare(password, user.passwordHash);
    if (!isValidPassword) {
        throw new Error("Неверный email или пароль");
    }
    const code = generateOtpCode();
    const codeHash = await bcryptjs_1.default.hash(code, 10);
    const expiresMinutes = Number(process.env.OTP_EXPIRES_MINUTES || 10);
    const expiresAt = new Date(Date.now() + expiresMinutes * 60 * 1000);
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
    catch (error) {
        console.error("EMAIL ERROR IN loginUser:", error);
        throw error;
    }
    return {
        requires2fa: true,
        email: normalizedEmail,
        message: "Код подтверждения отправлен на email",
    };
}
async function verifyOtp(email, code) {
    const normalizedEmail = normalizeEmail(email);
    const record = await db_1.prisma.authOtp.findFirst({
        where: { email: normalizedEmail },
        orderBy: { createdAt: "desc" },
    });
    if (!record) {
        throw new Error("Код не найден");
    }
    if (record.expiresAt.getTime() < Date.now()) {
        await db_1.prisma.authOtp.delete({ where: { id: record.id } });
        throw new Error("Срок действия кода истёк");
    }
    if (record.attempts >= 5) {
        throw new Error("Слишком много неверных попыток");
    }
    const isValidCode = await bcryptjs_1.default.compare(code, record.codeHash);
    if (!isValidCode) {
        await db_1.prisma.authOtp.update({
            where: { id: record.id },
            data: { attempts: { increment: 1 } },
        });
        throw new Error("Неверный код");
    }
    const user = await db_1.prisma.user.findUnique({
        where: { email: normalizedEmail },
    });
    if (!user) {
        throw new Error("Пользователь не найден");
    }
    await db_1.prisma.authOtp.delete({
        where: { id: record.id },
    });
    const accessToken = (0, jwt_1.signAccessToken)({
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
async function sendForgotPasswordCode(email) {
    const normalizedEmail = normalizeEmail(email);
    const user = await db_1.prisma.user.findUnique({
        where: { email: normalizedEmail },
    });
    if (!user) {
        return {
            message: "Если аккаунт существует, код для сброса отправлен на email",
        };
    }
    const code = generateOtpCode();
    const codeHash = await bcryptjs_1.default.hash(code, 10);
    const expiresMinutes = Number(process.env.OTP_EXPIRES_MINUTES || 10);
    const expiresAt = new Date(Date.now() + expiresMinutes * 60 * 1000);
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
    catch (error) {
        console.error("EMAIL ERROR IN sendForgotPasswordCode:", error);
        throw error;
    }
    return {
        message: "Если аккаунт существует, код для сброса отправлен на email",
    };
}
async function resetPassword(email, code, newPassword) {
    const normalizedEmail = normalizeEmail(email);
    const record = await db_1.prisma.passwordResetOtp.findFirst({
        where: { email: normalizedEmail },
        orderBy: { createdAt: "desc" },
    });
    if (!record) {
        throw new Error("Код не найден");
    }
    if (record.expiresAt.getTime() < Date.now()) {
        await db_1.prisma.passwordResetOtp.delete({
            where: { id: record.id },
        });
        throw new Error("Срок действия кода истёк");
    }
    if (record.attempts >= 5) {
        throw new Error("Слишком много неверных попыток");
    }
    const isValidCode = await bcryptjs_1.default.compare(code, record.codeHash);
    if (!isValidCode) {
        await db_1.prisma.passwordResetOtp.update({
            where: { id: record.id },
            data: {
                attempts: { increment: 1 },
            },
        });
        throw new Error("Неверный код");
    }
    const user = await db_1.prisma.user.findUnique({
        where: { email: normalizedEmail },
    });
    if (!user) {
        throw new Error("Пользователь не найден");
    }
    const newPasswordHash = await bcryptjs_1.default.hash(newPassword, 12);
    await db_1.prisma.user.update({
        where: { id: user.id },
        data: {
            passwordHash: newPasswordHash,
        },
    });
    await db_1.prisma.passwordResetOtp.delete({
        where: { id: record.id },
    });
    await db_1.prisma.authOtp.deleteMany({
        where: { email: normalizedEmail },
    });
    return {
        message: "Пароль успешно обновлён",
    };
}
async function getCurrentUser(userId) {
    return db_1.prisma.user.findUnique({
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
//# sourceMappingURL=auth.service.js.map