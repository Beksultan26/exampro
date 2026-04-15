import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

const transportOptions: SMTPTransport.Options = {
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
};

export const transporter = nodemailer.createTransport(transportOptions);

export async function sendOtpEmail(email: string, code: string) {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
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
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: "Сброс пароля",
      text: `Код для сброса пароля: ${code}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Сброс пароля</h2>
          <p>Ваш код для сброса пароля:</p>
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