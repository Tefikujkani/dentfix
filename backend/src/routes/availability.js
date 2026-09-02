import { Router } from "express";
import { TIME_SLOTS, isSunday, slotHasPassed } from "../data/schedule.js";
import { availabilityQuerySchema, validate } from "../middleware/validate.js";
import { getDentistById, listBookedSlots } from "../repositories/clinic.js";

export const availabilityRouter = Router();

availabilityRouter.get("/", validate(availabilityQuerySchema, "query"), async (req, res) => {
  const { date, dentist_id } = req.validated;
  const dentist = await getDentistById(dentist_id);

  if (!dentist) {
    return res.status(404).json({ ok: false, error: "Dentist not found" });
  }

  const closed = isSunday(date) || !dentist.is_available;
  const booked = closed ? [] : await listBookedSlots({ dentist_id, date });
  const bookedSlots = new Set(booked.map((item) => item.time_slot));

  const slots = TIME_SLOTS.map((slot) => {
    const taken = bookedSlots.has(slot.id);
    const past = slotHasPassed(date, slot.id);
    let reason = null;
    if (closed) reason = dentist.is_available ? "closed" : "unavailable";
    else if (taken) reason = "booked";
    else if (past) reason = "past";

    return {
      id: slot.id,
      label: slot.label,
      window: slot.window,
      period: slot.period,
      available: !reason,
      reason,
    };
  });

  return res.json({
    ok: true,
    date,
    dentist_id,
    dentist_name: dentist.name,
    closed,
    open_slots: slots.filter((slot) => slot.available),
    booked_slots: [...bookedSlots],
    slots,
  });
});
