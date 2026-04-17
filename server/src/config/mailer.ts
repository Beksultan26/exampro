import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendPasswordResetEmail(email: string, code: string) {
  await transporter.sendMail({
    from: `"ExamPrep PRO" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Сброс пароля — ExamPrep PRO",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Сброс пароля</h2>
        <p>Ваш код для сброса пароля:</p>
        <div style="font-size: 28px; font-weight: bold; letter-spacing: 4px; margin: 16px 0;">
          ${code}
        </div>
        <p>Код действует ограниченное время.</p>
      </div>
    `,
  });
}