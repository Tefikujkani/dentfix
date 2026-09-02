import dotenv from "dotenv";

dotenv.config();

function required(name, fallback) {
  const value = process.env[name] ?? fallback;
  if (value === undefined || value === "") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  port: Number(process.env.PORT ?? 4000),
  nodeEnv: process.env.NODE_ENV ?? "development",
  mongoUri: required("MONGODB_URI", "mongodb://127.0.0.1:27017/dental_clinic"),
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
  clinicName: process.env.CLINIC_NAME ?? "Dentfix",
  clinicPhone: process.env.CLINIC_PHONE ?? "+1-555-0142",
  adminEmail: process.env.ADMIN_EMAIL ?? "admin@dentfix.example",
  fromEmail: process.env.FROM_EMAIL ?? "Dentfix <noreply@dentfix.example>",
  smtp: {
    host: process.env.SMTP_HOST || "",
    port: Number(process.env.SMTP_PORT ?? 587),
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
    secure: process.env.SMTP_SECURE === "true",
  },
  sendgridApiKey: process.env.SENDGRID_API_KEY || "",
};
