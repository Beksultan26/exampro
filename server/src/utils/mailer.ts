import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // ❗ важно
  auth: {
    user: "apikey", // ❗ обязательно apikey
    pass: process.env.SMTP_PASS,
  },
});

// ✅ ОТПРАВКА OTP
export async function sendOtpEmail(email: string, code: string) {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM, // уже норм
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
      from: process.env.SMTP_FROM,
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