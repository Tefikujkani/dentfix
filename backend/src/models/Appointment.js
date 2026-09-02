import mongoose from "mongoose";
import { TIME_SLOTS } from "../data/schedule.js";

const STATUSES = ["pending", "confirmed", "completed", "cancelled"];
const SLOT_IDS = TIME_SLOTS.map((slot) => slot.id);

const appointmentSchema = new mongoose.Schema(
  {
    patient_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
      index: true,
    },
    dentist_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dentist",
      required: true,
      index: true,
    },
    service_type: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
      match: [/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"],
    },
    time_slot: {
      type: String,
      required: true,
      enum: SLOT_IDS,
    },
    status: {
      type: String,
      enum: STATUSES,
      default: "pending",
      index: true,
    },
    notes: {
      type: String,
      default: "",
      maxlength: 1000,
    },
    dentist_snapshot: {
      name: String,
      specialty: String,
    },
    patient_snapshot: {
      full_name: String,
      email: String,
      phone: String,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  },
);

appointmentSchema.index(
  { dentist_id: 1, date: 1, time_slot: 1 },
  {
    unique: true,
    partialFilterExpression: { status: { $in: ["pending", "confirmed"] } },
    name: "uniq_active_dentist_slot",
  },
);

appointmentSchema.index({ date: 1, dentist_id: 1 });

export const Appointment = mongoose.model("Appointment", appointmentSchema);
export { STATUSES, SLOT_IDS as TIME_SLOTS };
