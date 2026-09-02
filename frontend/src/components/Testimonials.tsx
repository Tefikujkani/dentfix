"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { LoaderCircle, Star } from "lucide-react";
import { fetchReviews, submitReview } from "@/lib/api";
import type { Review } from "@/lib/types";
import { Heading } from "./Heading";

type DisplayReview = {
  id: string;
  quote: string;
  name: string;
  meta: string;
  rating: number;
  photo: string | null;
  scene: string;
};

const FEATURED: DisplayReview[] = [
  {
    id: "featured-1",
    quote:
      "I used to put off the dentist for years. Here they actually explained what they were doing, and the cleaning didn't hurt. I've sent my sister already.",
    name: "Daniel Foster",
    meta: "Patient since 2019",
    rating: 5,
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
    scene: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "featured-2",
    quote:
      "Brought my kid in for braces consult. They weren't salesy — just honest about timing and cost. We booked the next week.",
    name: "Priya Nair",
    meta: "Patient since 2021",
    rating: 5,
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
    scene: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "featured-3",
    quote:
      "Emergency slot the same afternoon after a broken filling. Calm, quick, and they didn't upsell me a crown I didn't need.",
    name: "Marcus Webb",
    meta: "Patient since 2023",
    rating: 5,
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
    scene: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=900&q=80",
  },
];

const SCENES = FEATURED.map((item) => item.scene);
const INTERVAL_MS = 3000;

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatReviewMeta(review: Review) {
  const date = new Date(review.created_at);
  if (Number.isNaN(date.getTime())) return "Recent patient";
  return `Posted ${date.toLocaleDateString("en-US", { month: "short", year: "numeric" })}`;
}

function toDisplayReview(review: Review, index: number): DisplayReview {
  return {
    id: review.id,
    quote: review.message,
    name: review.full_name,
    meta: formatReviewMeta(review),
    rating: review.rating,
    photo: null,
    scene: SCENES[index % SCENES.length],
  };
}

function Stars({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  const iconClass = size === "lg" ? "h-6 w-6" : "h-4 w-4";
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          className={`${iconClass} ${index < rating ? "fill-amber-400 text-amber-400" : "text-slate-300"}`}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [loadedReviews, setLoadedReviews] = useState<Review[]>([]);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [submitState, setSubmitState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formError, setFormError] = useState("");

  const reviews = useMemo(() => {
    const submitted = loadedReviews.map(toDisplayReview);
    return [...submitted, ...FEATURED];
  }, [loadedReviews]);

  const review = reviews[index] ?? reviews[0];

  useEffect(() => {
    fetchReviews().then(setLoadedReviews);
  }, []);

  useEffect(() => {
    if (showForm || reviews.length <= 1) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % reviews.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [index, reviews.length, showForm]);

  function goTo(itemIndex: number) {
    setIndex(itemIndex);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState("loading");
    setFormError("");

    const result = await submitReview({
      full_name: name.trim(),
      rating,
      message: message.trim(),
    });

    if (!result.ok || !result.review) {
      setSubmitState("error");
      setFormError(result.error ?? result.errors?.[0]?.message ?? "Could not send your review.");
      return;
    }

    setLoadedReviews((current) => [result.review!, ...current]);
    setIndex(0);
    setName("");
    setMessage("");
    setRating(5);
    setSubmitState("success");
    setShowForm(false);
  }

  return (
    <section id="reviews" className="scroll-mt-24 bg-bg py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <Heading lead="Stories Behind" accent="Every Smile" />
          <button type="button" className="btn-primary w-full sm:w-auto" onClick={() => setShowForm((value) => !value)}>
            {showForm ? "Back to Reviews" : "Leave a Review"}
          </button>
        </div>

        {showForm ? (
          <div className="mt-12 mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h3 className="text-2xl font-semibold text-ink">Share your experience</h3>
            <p className="mt-2 text-sm text-slate-600">Tell others what your visit was like. It only takes a minute.</p>

            {submitState === "success" ? (
              <p className="mt-6 rounded-xl bg-sky-50 px-4 py-3 text-sm text-clinic" role="status">
                Thanks — your review is live in the carousel.
              </p>
            ) : null}

            <form className="mt-6 space-y-5" onSubmit={onSubmit} noValidate>
              <div>
                <label htmlFor="review_name" className="mb-2 block text-sm font-semibold text-ink">
                  Your name
                </label>
                <input
                  id="review_name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="w-full rounded-xl border-2 border-slate-300 bg-white px-3.5 py-3.5 text-sm text-ink outline-none focus:border-clinic focus:ring-4 focus:ring-sky-100"
                  required
                />
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold text-ink">Your rating</p>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }, (_, starIndex) => {
                    const value = starIndex + 1;
                    const active = value <= (hoverRating || rating);
                    return (
                      <button
                        key={value}
                        type="button"
                        className="press rounded-lg p-1"
                        aria-label={`Rate ${value} stars`}
                        onMouseEnter={() => setHoverRating(value)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(value)}
                      >
                        <Star
                          className={`h-8 w-8 ${active ? "fill-amber-400 text-amber-400" : "text-slate-300"}`}
                          aria-hidden="true"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label htmlFor="review_message" className="mb-2 block text-sm font-semibold text-ink">
                  Your review
                </label>
                <textarea
                  id="review_message"
                  rows={4}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  className="w-full rounded-xl border-2 border-slate-300 bg-white px-3.5 py-3.5 text-sm text-ink outline-none focus:border-clinic focus:ring-4 focus:ring-sky-100"
                  placeholder="What stood out about your visit?"
                  required
                />
              </div>

              {submitState === "error" ? (
                <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{formError}</p>
              ) : null}

              <button type="submit" disabled={submitState === "loading"} className="btn-primary disabled:opacity-70">
                {submitState === "loading" ? (
                  <span className="inline-flex items-center gap-2">
                    <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
                    Sending…
                  </span>
                ) : (
                  "Post Review"
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="mt-10 grid items-center gap-8 sm:mt-12 lg:grid-cols-2 lg:gap-10">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[1.6rem] sm:aspect-[5/4] lg:aspect-[4/5]">
              {reviews.map((item, itemIndex) => (
                <Image
                  key={item.id}
                  src={item.scene}
                  alt=""
                  fill
                  priority={itemIndex === 0}
                  className={`testimonial-photo object-cover ${itemIndex === index ? "opacity-100" : "opacity-0"}`}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ))}
            </div>

            <div>
              <div key={review.id} className="animate-testimonial">
                <p className="font-display text-5xl leading-none text-clinic sm:text-7xl">“</p>
                <Stars rating={review.rating} size="lg" />
                <blockquote className="mt-4 text-lg leading-8 text-slate-600 sm:text-xl lg:text-2xl lg:leading-9">
                  {review.quote}
                </blockquote>
                <div className="mt-8 flex items-center gap-3">
                  {review.photo ? (
                    <img src={review.photo} alt="" className="h-12 w-12 rounded-full object-cover" />
                  ) : (
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-clinic text-sm font-semibold text-white">
                      {initials(review.name)}
                    </span>
                  )}
                  <div>
                    <p className="font-semibold text-ink">{review.name}</p>
                    <p className="text-sm text-muted">{review.meta}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-2" aria-label="Testimonial pages">
                {reviews.map((item, itemIndex) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-label={`Show review from ${item.name}`}
                    aria-current={itemIndex === index ? "true" : undefined}
                    className={`h-2.5 rounded-full transition-all duration-500 ease-out ${
                      itemIndex === index ? "w-6 bg-clinic" : "w-2.5 bg-slate-300"
                    }`}
                    onClick={() => goTo(itemIndex)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
