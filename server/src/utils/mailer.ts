import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOtpEmail(email: string, code: string) {
  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "ExamPro <onboarding@resend.dev>",
      to: email,
      subject: "Login code",
      html: `
        <div style="font-family: Arial; padding: 20px;">
          <h2>Login confirmation</h2>
          <p>Your code:</p>
          <h1 style="letter-spacing: 6px;">${code}</h1>
          <p>Code valid for 10 minutes</p>
        </div>
      `,
    });

    console.log("OTP sent:", email);
  } catch (error) {
    console.error("RESEND ERROR:", error);
    throw new Error("Ошибка отправки email");
  }
}