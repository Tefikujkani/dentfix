import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { connectDb, usingMemoryStore } from "./config/db.js";
import { appointmentsRouter } from "./routes/appointments.js";
import { availabilityRouter } from "./routes/availability.js";
import { servicesRouter } from "./routes/services.js";
import { dentistsRouter } from "./routes/dentists.js";
import { reviewsRouter } from "./routes/reviews.js";
import { Dentist } from "./models/Dentist.js";
import { DENTIST_SEED } from "./data/dentists.js";

let readyPromise;

async function ensureDentists() {
  if (usingMemoryStore) return;
  const count = await Dentist.countDocuments();
  if (count === 0) {
    await Dentist.insertMany(DENTIST_SEED);
    console.log(`Seeded ${DENTIST_SEED.length} dentists.`);
  }
}

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: env.corsOrigin.split(",").map((origin) => origin.trim()),
      methods: ["GET", "POST", "OPTIONS"],
    }),
  );
  app.use(express.json({ limit: "32kb" }));
  app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, service: "dental-clinic-api" });
  });

  app.use("/api/appointments", appointmentsRouter);
  app.use("/api/availability", availabilityRouter);
  app.use("/api/services", servicesRouter);
  app.use("/api/dentists", dentistsRouter);
  app.use("/api/reviews", reviewsRouter);

  app.use((_req, res) => {
    res.status(404).json({ ok: false, error: "Not found" });
  });

  app.use((error, _req, res, _next) => {
    console.error(error);
    res.status(500).json({
      ok: false,
      error: env.nodeEnv === "production" ? "Internal server error" : error.message,
    });
  });

  return app;
}

export async function getReadyApp() {
  if (!readyPromise) {
    readyPromise = (async () => {
      await connectDb();
      await ensureDentists();
      return createApp();
    })();
  }
  return readyPromise;
}
