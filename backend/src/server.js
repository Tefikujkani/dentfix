import { env } from "./config/env.js";
import { getReadyApp } from "./app.js";

async function start() {
  const app = await getReadyApp();
  app.listen(env.port, () => {
    console.log(`API listening on http://localhost:${env.port}`);
    console.log(`Booking notifications → ${env.adminEmail}`);
    if (!env.sendgridApiKey && !(env.smtp.host && env.smtp.user && env.smtp.pass)) {
      console.log("Email: no SMTP/SendGrid configured — preview links will print in this console on each booking");
    } else {
      console.log(`Email: sending via ${env.sendgridApiKey ? "SendGrid" : env.smtp.host}`);
    }
  });
}

start().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
