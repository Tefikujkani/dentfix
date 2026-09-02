import { Router } from "express";
import { listAvailableDentists, serializeId } from "../repositories/clinic.js";

export const dentistsRouter = Router();

dentistsRouter.get("/", async (_req, res, next) => {
  try {
    const dentists = await listAvailableDentists();
    res.json({
      ok: true,
      dentists: dentists.map((dentist) => ({
        id: serializeId(dentist),
        name: dentist.name,
        specialty: dentist.specialty,
        bio: dentist.bio,
        is_available: dentist.is_available,
      })),
    });
  } catch (error) {
    next(error);
  }
});
