import nodemailer from "nodemailer";

export async function sendMail({ to, subject, html }: { to: string; subject: string; html: string }) {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    // Local testing without SMTP: print the mail in the terminal instead of sending it.
    if (process.env.NODE_ENV !== "production") {
      console.log(`\n[DEV MAIL] to: ${to}\nsubject: ${subject}\n${html}\n`);
      return;
    }
    throw new Error("SMTP is not configured");
  }

  const port = Number(process.env.SMTP_PORT ?? 587);
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? "smtp.gmail.com",
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  await transporter.sendMail({ from: process.env.MAIL_FROM || user, to, subject, html });
}
