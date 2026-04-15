import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey) {
  console.error("RESEND_API_KEY is not set");
}

const resend = new Resend(resendApiKey);

const fromEmail =
  process.env.RESEND_FROM_EMAIL || "ExamPro <onboarding@resend.dev>";

export async function sendOtpEmail(email: string, code: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [email],
      subject: "Код подтверждения входа",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Подтверждение входа</h2>
          <p>Ваш код для входа в ExamPro:</p>
          <h1 style="letter-spacing: 6px;">${code}</h1>
          <p>Код действует 10 минут.</p>
        </div>
      `,
      text: `Ваш код для входа в ExamPro: ${code}. Код действует 10 минут.`,
    });

    if (error) {
      console.error("RESEND SEND OTP ERROR:", error);
      throw new Error(error.message || "Ошибка отправки OTP через Resend");
    }

    console.log("OTP отправлен через Resend:", email, data);
  } catch (error) {
    console.error("SEND OTP EMAIL ERROR:", error);
    throw error;
  }
}

export async function sendPasswordResetEmail(email: string, code: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [email],
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
      text: `Код для сброса пароля в ExamPro: ${code}. Код действует 10 минут.`,
    });

    if (error) {
      console.error("RESEND SEND RESET EMAIL ERROR:", error);
      throw new Error(error.message || "Ошибка отправки письма сброса через Resend");
    }

    console.log("RESET OTP отправлен через Resend:", email, data);
  } catch (error) {
    console.error("SEND RESET EMAIL ERROR:", error);
    throw error;
  }
}