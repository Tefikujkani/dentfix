import nodemailer from "nodemailer";
import { env } from "../config/env.js";
import { getServiceById, getTimeSlotById } from "../data/services.js";

let cachedTransport = null;

async function getTransport() {
  if (cachedTransport) return cachedTransport;

  if (env.sendgridApiKey) {
    cachedTransport = nodemailer.createTransport({
      host: "smtp.sendgrid.net",
      port: 587,
      auth: {
        user: "apikey",
        pass: env.sendgridApiKey,
      },
    });
    return cachedTransport;
  }

  if (env.smtp.host && env.smtp.user && env.smtp.pass) {
    cachedTransport = nodemailer.createTransport({
      host: env.smtp.host,
      port: env.smtp.port,
      secure: env.smtp.secure,
      auth: {
        user: env.smtp.user,
        pass: env.smtp.pass,
      },
    });
    return cachedTransport;
  }

  const testAccount = await nodemailer.createTestAccount();
  cachedTransport = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
  console.log("Email: using Ethereal test account (no SMTP/SendGrid configured)");
  return cachedTransport;
}

function formatAppointment(appointment) {
  const service = getServiceById(appointment.service_type);
  const slot = getTimeSlotById(appointment.time_slot);
  return {
    serviceName: service?.name ?? appointment.service_type,
    slotLabel: slot?.label ?? appointment.time_slot,
    dentistName: appointment.dentist_snapshot?.name ?? "Assigned dentist",
    patientName: appointment.patient_snapshot?.full_name ?? "Patient",
    date: appointment.date,
  };
}

export async function sendBookingEmails(appointment) {
  const details = formatAppointment(appointment);
  const transport = await getTransport();
  const patientEmail = appointment.patient_snapshot?.email;

  const patientHtml = `
    <div style="font-family:Georgia,serif;color:#0f172a;max-width:560px">
      <h1 style="color:#0284C7;font-size:22px">Your visit is booked</h1>
      <p>Hello ${details.patientName},</p>
      <p>Thank you for choosing ${env.clinicName}. Your consultation request is <strong>pending confirmation</strong>.</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0">
        <tr><td style="padding:8px 0;color:#64748b">Treatment</td><td>${details.serviceName}</td></tr>
        <tr><td style="padding:8px 0;color:#64748b">Dentist</td><td>${details.dentistName}</td></tr>
        <tr><td style="padding:8px 0;color:#64748b">Date</td><td>${details.date}</td></tr>
        <tr><td style="padding:8px 0;color:#64748b">Time</td><td>${details.slotLabel}</td></tr>
      </table>
      <p>Questions? Call us at ${env.clinicPhone}.</p>
    </div>
  `;

  const adminHtml = `
    <div style="font-family:Arial,sans-serif;color:#0f172a">
      <h2 style="color:#0284C7">New appointment request</h2>
      <p><strong>${details.patientName}</strong> requested a ${details.serviceName} visit.</p>
      <ul>
        <li>Dentist: ${details.dentistName}</li>
        <li>Date: ${details.date}</li>
        <li>Slot: ${details.slotLabel}</li>
        <li>Phone: ${appointment.patient_snapshot?.phone ?? "n/a"}</li>
        <li>Email: ${patientEmail ?? "n/a"}</li>
        ${appointment.notes ? `<li>Notes: ${appointment.notes}</li>` : ""}
      </ul>
    </div>
  `;

  const messages = [];

  if (patientEmail) {
    messages.push(
      transport.sendMail({
        from: env.fromEmail,
        to: patientEmail,
        subject: `Booking received — ${env.clinicName}`,
        html: patientHtml,
      }),
    );
  }

  messages.push(
    transport.sendMail({
      from: env.fromEmail,
      to: env.adminEmail,
      subject: `New booking: ${details.patientName} — ${details.date}`,
      html: adminHtml,
    }),
  );

  const results = await Promise.allSettled(messages);

  for (const result of results) {
    if (result.status === "fulfilled") {
      const preview = nodemailer.getTestMessageUrl(result.value);
      if (preview) {
        console.log(`Email preview: ${preview}`);
      }
    } else {
      console.error("Email send failed:", result.reason?.message ?? result.reason);
    }
  }
}
