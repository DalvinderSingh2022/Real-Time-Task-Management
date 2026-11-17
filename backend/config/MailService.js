const nodemailer = require("nodemailer");
require("dotenv").config();

const isConfigured = Boolean(
  process.env.BREVO_HOST && process.env.BREVO_USER && process.env.BREVO_PASS,
);

const transporter = isConfigured
  ? nodemailer.createTransport({
      host: process.env.BREVO_HOST,
      port: Number(process.env.BREVO_PORT) || 587,
      secure: Number(process.env.BREVO_PORT) === 465, // true for 465, false for 587
      auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_PASS,
      },
    })
  : null;

const FROM =
  process.env.EMAIL_FROM || "Task Manager <no-reply@taskmanager.app>";

const sendMail = async ({ to, subject, html }) => {
  if (!transporter) {
    // Email not configured — skip silently (non-fatal).
    return { skipped: true };
  }

  try {
    const info = await transporter.sendMail({ from: FROM, to, subject, html });
    return { messageId: info.messageId };
  } catch (err) {
    // Never let an email failure break the API request that triggered it.
    console.error("Mail error:", err.message);
    return { error: err.message };
  }
};

module.exports = { sendMail };
