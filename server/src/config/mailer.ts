const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

const senderEmail =
  process.env.SMTP_FROM_EMAIL || "noreply@examproapp.online";

const senderName =
  process.env.SMTP_FROM_NAME || "ExamPro";

const brevoApiKey =
  process.env.BREVO_API_KEY || process.env.SMTP_PASS || "";

type SendEmailParams = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

async function sendEmailViaBrevo({
  to,
  subject,
  text,
  html,
}: SendEmailParams) {
  if (!brevoApiKey) {
    throw new Error("BREVO_API_KEY is missing");
  }

  console.log("BREVO SEND START:", {
    to,
    subject,
    senderEmail,
    senderName,
  });

  const response = await fetch(BREVO_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": brevoApiKey,
      Accept: "application/json",
    },
    body: JSON.stringify({
      sender: {
        name: senderName,
        email: senderEmail,
      },
      to: [{ email: to }],
      subject,
      textContent: text,
      htmlContent: html,
    }),
  });

  const responseText = await response.text();

  console.log("BREVO STATUS:", response.status);
  console.log("BREVO RESPONSE:", responseText);

  if (!response.ok) {
    throw new Error(`Brevo error: ${response.status} - ${responseText}`);
  }
}

export async function sendOtpEmail(email: string, code: string) {
  const subject = "Код подтверждения входа";
  const text = `Ваш код подтверждения: ${code}`;
  const html = `
    <div style="font-family: Arial; padding: 20px;">
      <h2>ExamPro</h2>
      <p>Ваш код:</p>
      <h1 style="letter-spacing: 6px;">${code}</h1>
      <p>Код действует 10 минут</p>
    </div>
  `;

  await sendEmailViaBrevo({
    to: email,
    subject,
    text,
    html,
  });

  console.log("OTP отправлен:", email);
}

export async function sendPasswordResetEmail(email: string, code: string) {
  const subject = "Сброс пароля";
  const text = `Ваш код для сброса: ${code}`;
  const html = `
    <div style="font-family: Arial; padding: 20px;">
      <h2>Сброс пароля</h2>
      <p>Ваш код:</p>
      <h1 style="letter-spacing: 6px;">${code}</h1>
      <p>Код действует 10 минут</p>
    </div>
  `;

  await sendEmailViaBrevo({
    to: email,
    subject,
    text,
    html,
  });

  console.log("RESET OTP отправлен:", email);
}