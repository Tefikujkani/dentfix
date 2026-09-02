import { getDentistById, findConflict } from "../repositories/clinic.js";

export async function preventDoubleBooking(req, res, next) {
  const { dentist_id, date, time_slot } = req.validated ?? req.body ?? {};

  const dentist = await getDentistById(dentist_id);
  if (!dentist) {
    return res.status(404).json({
      ok: false,
      error: "Dentist not found",
    });
  }

  if (!dentist.is_available) {
    return res.status(409).json({
      ok: false,
      error: "This dentist is not currently accepting appointments",
    });
  }

  const conflict = await findConflict({ dentist_id, date, time_slot });
  if (conflict) {
    return res.status(409).json({
      ok: false,
      error: "That day and time is already booked with this dentist. Pick another slot.",
      code: "DOUBLE_BOOKING",
    });
  }

  req.dentist = dentist;
  return next();
}
