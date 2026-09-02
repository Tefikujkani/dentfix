import { randomUUID } from "crypto";
import mongoose from "mongoose";
import { usingMemoryStore } from "../config/db.js";
import { Review } from "../models/Review.js";
import * as memory from "../memory/store.js";

export function serializeId(value) {
  return value?._id ?? value?.id ?? value;
}

export async function listApprovedReviews(limit = 50) {
  if (usingMemoryStore) {
    return memory.listReviews(limit);
  }
  return Review.find({ status: "approved" })
    .sort({ created_at: -1 })
    .limit(limit)
    .lean();
}

export async function createReviewRecord(data) {
  if (usingMemoryStore) {
    return memory.createReview(data);
  }
  return Review.create(data);
}
