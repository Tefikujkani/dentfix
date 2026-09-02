import { Router } from "express";
import { createAppointmentRecord, upsertPatient, serializeId } from "../repositories/clinic.js";
import { appointmentBodySchema, validate } from "../middleware/validate.js";
import { preventDoubleBooking } from "../middleware/doubleBooking.js";
import { sendBookingEmails } from "../services/email.js";

export const appointmentsRouter = Router();

appointmentsRouter.post(
  "/",
  validate(appointmentBodySchema),
  preventDoubleBooking,
  async (req, res, next) => {
    const payload = req.validated;
    const dentist = req.dentist;

    try {
      const patient = await upsertPatient({
        email: payload.email,
        full_name: payload.full_name,
        phone: payload.phone,
      });

      const appointment = await createAppointmentRecord({
        patient_id: serializeId(patient),
        dentist_id: serializeId(dentist),
        service_type: payload.service_type,
        date: payload.date,
        time_slot: payload.time_slot,
        status: "pending",
        notes: payload.notes ?? "",
        dentist_snapshot: {
          name: dentist.name,
          specialty: dentist.specialty,
        },
        patient_snapshot: {
          full_name: patient.full_name,
          email: patient.email,
          phone: patient.phone,
        },
      });

      res.status(201).json({
        ok: true,
        appointment: {
          id: serializeId(appointment),
          status: appointment.status,
          date: appointment.date,
          time_slot: appointment.time_slot,
          service_type: appointment.service_type,
          dentist: appointment.dentist_snapshot,
          patient: appointment.patient_snapshot,
        },
      });

      sendBookingEmails(appointment).catch((error) => {
        console.error("Booking email failed:", error.message);
      });
    } catch (error) {
      if (error?.code === 11000) {
        return res.status(409).json({
          ok: false,
          error: "That day and time is already booked with this dentist. Pick another slot.",
          code: "DOUBLE_BOOKING",
        });
      }

      return next(error);
    }
  },
);
