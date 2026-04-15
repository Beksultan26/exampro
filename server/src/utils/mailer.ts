import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// ✅ ОТПРАВКА OTP
export async function sendOtpEmail(email: string, code: string) {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: "Код подтверждения",
      text: `Ваш код: ${code}`,
    });

    console.log("OTP отправлен:", email);
  } catch (error) {
    console.error("SMTP ERROR:", error);
    throw error;
  }
}

// ✅ СБРОС ПАРОЛЯ
export async function sendPasswordResetEmail(email: string, code: string) {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: "Сброс пароля",
      text: `Код для сброса: ${code}`,
    });

    console.log("RESET OTP отправлен:", email);
  } catch (error) {
    console.error("SMTP RESET ERROR:", error);
    throw error;
  }
}