"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeEmail = normalizeEmail;
exports.hashPassword = hashPassword;
exports.comparePassword = comparePassword;
exports.signAccessToken = signAccessToken;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../../config/env");
function normalizeEmail(email) {
    return String(email).trim().toLowerCase();
}
async function hashPassword(password) {
    return bcryptjs_1.default.hash(String(password), 10);
}
async function comparePassword(password, passwordHash) {
    return bcryptjs_1.default.compare(String(password), passwordHash);
}
function signAccessToken(user) {
    return jsonwebtoken_1.default.sign({
        userId: user.id,
        email: user.email,
        role: user.role,
    }, env_1.env.jwtAccessSecret, {
        expiresIn: "7d",
    });
}
//# sourceMappingURL=auth.service.js.map