"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPasswordResetEmail = sendPasswordResetEmail;
exports.sendLoginOtpEmail = sendLoginOtpEmail;
const resend_1 = require("resend");
const resend = new resend_1.Resend(process.env.RESEND_API_KEY);
function ensureEnv() {
    if (!process.env.RESEND_API_KEY) {
        throw new Error("RESEND_API_KEY is not set");
    }
    if (!process.env.MAIL_FROM) {
        throw new Error("MAIL_FROM is not set");
    }
}
async function sendPasswordResetEmail(to, code) {
    ensureEnv();
    await resend.emails.send({
        from: process.env.MAIL_FROM,
        to,
        subject: "Сброс пароля ExamPro",
        html: `
      <div style="font-family: Arial, sans-serif; color: #111;">
        <h2>Сброс пароля</h2>
        <p>Ваш код для сброса пароля:</p>
        <div style="font-size: 32px; font-weight: bold; letter-spacing: 6px; margin: 16px 0;">
          ${code}
        </div>
        <p>Код действует 10 минут.</p>
      </div>
    `,
    });
}
async function sendLoginOtpEmail(to, code) {
    ensureEnv();
    await resend.emails.send({
        from: process.env.MAIL_FROM,
        to,
        subject: "Код входа ExamPro",
        html: `
      <div style="font-family: Arial, sans-serif; color: #111;">
        <h2>Подтверждение входа</h2>
        <p>Вы пытаетесь войти в аккаунт ExamPro.</p>
        <p>Ваш код входа:</p>
        <div style="font-size: 32px; font-weight: bold; letter-spacing: 6px; margin: 16px 0;">
          ${code}
        </div>
        <p>Код действует 10 минут.</p>
      </div>
    `,
    });
}
//# sourceMappingURL=mailer.js.map