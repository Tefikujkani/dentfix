import { Router } from "express";
import { reviewBodySchema, validate } from "../middleware/validate.js";
import { createReviewRecord, listApprovedReviews, serializeId } from "../repositories/reviews.js";

export const reviewsRouter = Router();

reviewsRouter.get("/", async (_req, res, next) => {
  try {
    const reviews = await listApprovedReviews();
    res.json({
      ok: true,
      reviews: reviews.map((review) => ({
        id: serializeId(review),
        full_name: review.full_name,
        rating: review.rating,
        message: review.message,
        created_at: review.created_at,
      })),
    });
  } catch (error) {
    next(error);
  }
});

reviewsRouter.post("/", validate(reviewBodySchema), async (req, res, next) => {
  try {
    const payload = req.validated;
    const review = await createReviewRecord({
      full_name: payload.full_name,
      rating: payload.rating,
      message: payload.message,
      status: "approved",
    });

    res.status(201).json({
      ok: true,
      review: {
        id: serializeId(review),
        full_name: review.full_name,
        rating: review.rating,
        message: review.message,
        created_at: review.created_at,
      },
    });
  } catch (error) {
    next(error);
  }
});
