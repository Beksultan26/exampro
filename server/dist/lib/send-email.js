"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = sendEmail;
async function sendEmail({ to, subject, html }) {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.MAIL_FROM || "ExamPro <onboarding@resend.dev>";
    if (!apiKey) {
        throw new Error("RESEND_API_KEY не указан");
    }
    const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            from,
            to,
            subject,
            html,
        }),
    });
    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Ошибка Resend: ${text}`);
    }
    return response.json();
}
//# sourceMappingURL=send-email.js.map