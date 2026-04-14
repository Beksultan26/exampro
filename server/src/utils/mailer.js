"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transporter = void 0;
exports.sendOtpEmail = sendOtpEmail;
exports.sendPasswordResetEmail = sendPasswordResetEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
exports.transporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});
async function sendOtpEmail(email, code) {
    await exports.transporter.sendMail({
        from: `"ExamPro" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "Код подтверждения входа",
        html: `
      <div style="font-family: Arial; padding: 20px;">
        <h2>Подтверждение входа</h2>
        <p>Ваш код:</p>
        <h1 style="letter-spacing: 6px;">${code}</h1>
        <p>Код действует 10 минут</p>
      </div>
    `,
    });
    console.log("OTP отправлен:", email, code);
}
async function sendPasswordResetEmail(email, code) {
    await exports.transporter.sendMail({
        from: `"ExamPro" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "Сброс пароля",
        html: `
      <div style="font-family: Arial; padding: 20px;">
        <h2>Сброс пароля</h2>
        <p>Вы запросили смену пароля в ExamPro.</p>
        <p>Введите этот код на странице сброса пароля:</p>
        <h1 style="letter-spacing: 6px;">${code}</h1>
        <p>Код действует 10 минут.</p>
        <p>Если это были не вы, просто проигнорируйте письмо.</p>
      </div>
    `,
    });
    console.log("Reset OTP отправлен:", email, code);
}
//# sourceMappingURL=mailer.js.map