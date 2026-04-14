import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendOtpEmail(email: string, code: string) {
  await transporter.sendMail({
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

export async function sendPasswordResetEmail(email: string, code: string) {
  await transporter.sendMail({
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