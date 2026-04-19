import sgMail from "@sendgrid/mail";
import { env } from "./env";

if (env.sendgridApiKey) {
  sgMail.setApiKey(env.sendgridApiKey);
}

export async function sendPasswordResetEmail(to: string, code: string) {
  if (!env.sendgridApiKey) {
    throw new Error("SENDGRID_API_KEY is not set");
  }

  if (!env.mailFrom) {
    throw new Error("MAIL_FROM is not set");
  }

  await sgMail.send({
    to,
    from: {
      email: env.mailFrom,
      name: env.mailFromName,
    },
    subject: "Сброс пароля ExamPro",
    html: `
      <div style="font-family: Arial, sans-serif; color: #111;">
        <h2>Сброс пароля</h2>
        <p>Вы запросили код для сброса пароля.</p>
        <p>Ваш код:</p>
        <div style="font-size: 32px; font-weight: bold; letter-spacing: 6px; margin: 16px 0;">
          ${code}
        </div>
        <p>Код действует 10 минут.</p>
      </div>
    `,
  });
}