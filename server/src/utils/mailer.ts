import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  family: 4, // 🔥 ВОТ ЭТО КЛЮЧЕВОЕ
  auth: {
    user: "apikey",
    pass: process.env.SMTP_PASS,
  },
});