import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: "apikey",
    pass: process.env.SMTP_PASS,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
} as any);

export async function sendOtpEmail(email: string, code: string) {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || "ExamPro <noreply@examproapp.online>",
      to: email,
      subject: "Код подтверждения",
      text: `Ваш код: ${code}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Подтверждение входа</h2>
          <p>Ваш код:</p>
          <h1 style="letter-spacing: 6px;">${code}</h1>
          <p>Код действует 10 минут.</p>
        </div>
      `,
    });

    console.log("OTP отправлен:", email);
  } catch (error) {
    console.error("SMTP ERROR:", error);
    throw error;
  }
}

export async function sendPasswordResetEmail(email: string, code: string) {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || "ExamPro <noreply@examproapp.online>",
      to: email,
      subject: "Сброс пароля",
      text: `Код для сброса: ${code}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Сброс пароля</h2>
          <p>Ваш код для сброса:</p>
          <h1 style="letter-spacing: 6px;">${code}</h1>
          <p>Код действует 10 минут.</p>
        </div>
      `,
    });

    console.log("RESET OTP отправлен:", email);
  } catch (error) {
    console.error("SMTP RESET ERROR:", error);
    throw error;
  }
}