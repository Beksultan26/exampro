import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY || "";
const senderEmail =
  process.env.SMTP_FROM_EMAIL || "noreply@send.examproapp.online";
const senderName =
  process.env.SMTP_FROM_NAME || "ExamPro";

const resend = new Resend(resendApiKey);

function getFromField() {
  return `${senderName} <${senderEmail}>`;
}

export async function sendOtpEmail(email: string, code: string) {
  if (!resendApiKey) {
    throw new Error("RESEND_API_KEY is missing");
  }

  const subject = "Код подтверждения входа";
  const text = `Ваш код подтверждения: ${code}. Код действует 10 минут.`;
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>ExamPro</h2>
      <p>Ваш код подтверждения:</p>
      <h1 style="letter-spacing: 6px;">${code}</h1>
      <p>Код действует 10 минут.</p>
    </div>
  `;

  const { data, error } = await resend.emails.send({
    from: getFromField(),
    to: [email],
    subject,
    text,
    html,
  });

  if (error) {
    console.error("RESEND OTP ERROR:", error);
    throw new Error(`Resend send failed: ${error.message}`);
  }

  console.log("OTP SENT:", data);
}

export async function sendPasswordResetEmail(email: string, code: string) {
  if (!resendApiKey) {
    throw new Error("RESEND_API_KEY is missing");
  }

  const subject = "Сброс пароля";
  const text = `Ваш код для сброса пароля: ${code}. Код действует 10 минут.`;
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Сброс пароля</h2>
      <p>Ваш код для сброса:</p>
      <h1 style="letter-spacing: 6px;">${code}</h1>
      <p>Код действует 10 минут.</p>
    </div>
  `;

  const { data, error } = await resend.emails.send({
    from: getFromField(),
    to: [email],
    subject,
    text,
    html,
  });

  if (error) {
    console.error("RESEND RESET ERROR:", error);
    throw new Error(`Resend send failed: ${error.message}`);
  }

  console.log("RESET OTP SENT:", data);
}