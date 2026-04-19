import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordResetEmail(to: string, code: string) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not set");
  }

  if (!process.env.MAIL_FROM) {
    throw new Error("MAIL_FROM is not set");
  }

  await resend.emails.send({
    from: process.env.MAIL_FROM,
    to,
    subject: "Сброс пароля ExamPro",
    html: `
      <div style="font-family: Arial, sans-serif; color: #111;">
        <h2>Сброс пароля</h2>
        <p>Ваш код:</p>
        <div style="font-size: 32px; font-weight: bold; letter-spacing: 6px; margin: 16px 0;">
          ${code}
        </div>
        <p>Код действует 10 минут.</p>
      </div>
    `,
  });
}