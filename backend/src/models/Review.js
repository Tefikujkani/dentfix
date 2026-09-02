import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1200,
    },
    status: {
      type: String,
      enum: ["approved", "pending"],
      default: "approved",
      index: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  },
);

export const Review = mongoose.model("Review", reviewSchema);
