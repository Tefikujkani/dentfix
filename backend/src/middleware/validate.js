import { z } from "zod";
import { SERVICE_CATALOG } from "../data/services.js";
import { TIME_SLOTS, isSunday, slotHasPassed, todayLocalIsoDate } from "../data/schedule.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+?[0-9()\-\s.]{7,20}$/;
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const appointmentBodySchema = z
  .object({
    full_name: z.string().trim().min(2, "Patient name is required").max(120),
    email: z.string().trim().toLowerCase().regex(emailRegex, "Enter a valid email address"),
    phone: z.string().trim().regex(phoneRegex, "Enter a valid phone number"),
    service_type: z
      .string()
      .refine((value) => SERVICE_CATALOG.some((service) => service.id === value), "Select a valid treatment"),
    dentist_id: z.string().min(1, "Select a dentist"),
    date: z
      .string()
      .regex(dateRegex, "Date must be YYYY-MM-DD")
      .refine((value) => value >= todayLocalIsoDate(), "Date cannot be in the past")
      .refine((value) => !isSunday(value), "We're closed on Sundays"),
    time_slot: z
      .string()
      .refine((value) => TIME_SLOTS.some((slot) => slot.id === value), "Select an open visit time"),
    notes: z.string().max(1000).optional().default(""),
  })
  .superRefine((value, ctx) => {
    if (slotHasPassed(value.date, value.time_slot)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["time_slot"],
        message: "That time has already passed. Pick a later slot.",
      });
    }
  });

export const availabilityQuerySchema = z.object({
  date: z.string().regex(dateRegex, "Date must be YYYY-MM-DD"),
  dentist_id: z.string().min(1, "dentist_id is required"),
});

export const reviewBodySchema = z.object({
  full_name: z.string().trim().min(2, "Please enter your name").max(120),
  rating: z.coerce.number().int().min(1, "Pick a star rating").max(5),
  message: z.string().trim().min(10, "Write at least a sentence or two").max(1200),
});

export function validate(schema, source = "body") {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join(".") || source,
        message: issue.message,
      }));
      return res.status(400).json({
        ok: false,
        error: "Validation failed",
        errors,
      });
    }
    req.validated = result.data;
    return next();
  };
}
