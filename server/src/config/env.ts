export const env = {
  port: Number(process.env.PORT || 5000),
  databaseUrl: process.env.DATABASE_URL || "",
  accessSecret: process.env.JWT_ACCESS_SECRET || "",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",

  sendgridApiKey: process.env.SENDGRID_API_KEY || "",
  mailFrom: process.env.MAIL_FROM || "",
  mailFromName: process.env.MAIL_FROM_NAME || "ExamPro",
};