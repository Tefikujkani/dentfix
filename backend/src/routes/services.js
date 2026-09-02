import { Router } from "express";
import { SERVICE_CATALOG, TIME_SLOTS } from "../data/services.js";

export const servicesRouter = Router();

servicesRouter.get("/", (_req, res) => {
  res.json({
    ok: true,
    services: SERVICE_CATALOG,
    time_slots: TIME_SLOTS,
  });
});
