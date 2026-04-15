import nodemailer from "nodemailer";

const smtpPort = Number(process.env.SMTP_PORT) || 587;
const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";

export const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpPort === 465,
  requireTLS: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  family: 4,
  tls: {
    rejectUnauthorized: false,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP VERIFY ERROR:", error);
  } else {
    console.log("SMTP server is ready");
  }
});

export async function sendOtpEmail(email: string, code: string) {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || `"ExamPro" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Код подтверждения входа",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Подтверждение входа</h2>
          <p>Ваш код для входа в ExamPro:</p>
          <h1 style="letter-spacing: 6px;">${code}</h1>
          <p>Код действует 10 минут.</p>
        </div>
      `,
    });

    console.log("OTP отправлен:", email);
  } catch (error) {
    console.error("SEND OTP EMAIL ERROR:", error);
    throw error;
  }
}

export async function sendPasswordResetEmail(email: string, code: string) {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || `"ExamPro" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Сброс пароля",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Сброс пароля</h2>
          <p>Вы запросили смену пароля в ExamPro.</p>
          <p>Введите этот код на странице сброса пароля:</p>
          <h1 style="letter-spacing: 6px;">${code}</h1>
          <p>Код действует 10 минут.</p>
          <p>Если это были не вы, просто проигнорируйте письмо.</p>
        </div>
      `,
    });

    console.log("RESET OTP отправлен:", email);
  } catch (error) {
    console.error("SEND RESET EMAIL ERROR:", error);
    throw error;
  }
}