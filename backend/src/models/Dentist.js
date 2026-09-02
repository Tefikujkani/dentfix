import mongoose from "mongoose";

const SPECIALTIES = [
  "General Dentistry",
  "Cosmetic Dentistry",
  "Prosthodontics",
  "Orthodontics",
  "Endodontics",
  "Emergency",
];

const dentistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    specialty: {
      type: String,
      required: true,
      enum: SPECIALTIES,
    },
    bio: {
      type: String,
      default: "",
    },
    is_available: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  },
);

export const Dentist = mongoose.model("Dentist", dentistSchema);
export { SPECIALTIES };
