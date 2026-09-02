import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"],
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      minlength: 7,
      maxlength: 20,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  },
);

patientSchema.index({ phone: 1 });

export const Patient = mongoose.model("Patient", patientSchema);
