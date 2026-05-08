"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGoogleAuthUrl = getGoogleAuthUrl;
exports.handleGoogleCallback = handleGoogleCallback;
const google_auth_library_1 = require("google-auth-library");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../../config/db");
const env_1 = require("../../config/env");
const googleClient = new google_auth_library_1.OAuth2Client(env_1.env.googleClientId, env_1.env.googleClientSecret, env_1.env.googleCallbackUrl);
function createAccessToken(user) {
    return jsonwebtoken_1.default.sign({
        userId: user.id,
        email: user.email,
        role: user.role,
    }, env_1.env.jwtAccessSecret, { expiresIn: "7d" });
}
function getGoogleAuthUrl() {
    return googleClient.generateAuthUrl({
        access_type: "offline",
        scope: ["profile", "email"],
        prompt: "select_account",
    });
}
async function handleGoogleCallback(code) {
    const { tokens } = await googleClient.getToken(code);
    if (!tokens.id_token) {
        throw new Error("Google ID token не получен");
    }
    const ticket = await googleClient.verifyIdToken({
        idToken: tokens.id_token,
        audience: env_1.env.googleClientId,
    });
    const payload = ticket.getPayload();
    if (!payload?.email) {
        throw new Error("Email не получен от Google");
    }
    const email = payload.email.toLowerCase();
    let user = await db_1.prisma.user.findUnique({
        where: { email },
    });
    if (!user) {
        user = await db_1.prisma.user.create({
            data: {
                name: payload.name || "Google User",
                email,
                passwordHash: "",
                googleId: payload.sub,
                avatarUrl: payload.picture || null,
            },
        });
    }
    else {
        user = await db_1.prisma.user.update({
            where: { id: user.id },
            data: {
                googleId: user.googleId || payload.sub,
                avatarUrl: payload.picture || user.avatarUrl,
            },
        });
    }
    const accessToken = createAccessToken(user);
    return {
        accessToken,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatarUrl: user.avatarUrl,
        },
    };
}
//# sourceMappingURL=auth.google.js.map