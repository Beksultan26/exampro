import nodemailer from "nodemailer";
export declare const transporter: nodemailer.Transporter<import("nodemailer/lib/smtp-transport").SentMessageInfo, import("nodemailer/lib/smtp-transport").Options>;
export declare function sendOtpEmail(email: string, code: string): Promise<void>;
export declare function sendPasswordResetEmail(email: string, code: string): Promise<void>;
//# sourceMappingURL=mailer.d.ts.map