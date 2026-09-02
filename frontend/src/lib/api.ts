import type {
  AppointmentPayload,
  AppointmentResponse,
  Dentist,
  Review,
  ReviewPayload,
  ReviewResponse,
  Service,
  TimeSlot,
} from "./types";
import { FALLBACK_DENTISTS, FALLBACK_SERVICES, FALLBACK_SLOTS } from "./api-data";
import { decorateSlots } from "./schedule";

const API_ORIGIN =
  process.env.API_ORIGIN ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:4000");

function apiUrl(path: string) {
  if (typeof window !== "undefined") return path;
  return `${API_ORIGIN}${path}`;
}

async function readJson<T>(response: Response): Promise<T | null> {
  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function fetchServices(): Promise<{ services: Service[]; time_slots: TimeSlot[] }> {
  try {
    const response = await fetch(apiUrl("/api/services"), { cache: "no-store" });
    const data = await readJson<{ ok: boolean; services?: Service[]; time_slots?: TimeSlot[] }>(response);
    if (response.ok && data?.ok && data.services?.length) {
      return {
        services: data.services,
        time_slots: data.time_slots?.length ? data.time_slots : FALLBACK_SLOTS,
      };
    }
  } catch {
    /* fall through */
  }
  return { services: FALLBACK_SERVICES, time_slots: FALLBACK_SLOTS };
}

export async function fetchDentists(): Promise<Dentist[]> {
  try {
    const response = await fetch(apiUrl("/api/dentists"), { cache: "no-store" });
    const data = await readJson<{ ok: boolean; dentists?: Dentist[] }>(response);
    if (response.ok && data?.ok && data.dentists?.length) {
      return data.dentists;
    }
  } catch {
    /* fall through */
  }
  return FALLBACK_DENTISTS;
}

export async function fetchAvailability(date: string, dentistId: string) {
  try {
    const params = new URLSearchParams({ date, dentist_id: dentistId });
    const response = await fetch(apiUrl(`/api/availability?${params.toString()}`), {
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    const data = await readJson<{
      ok: boolean;
      slots?: TimeSlot[];
      booked_slots?: string[];
      error?: string;
    }>(response);
    if (response.ok && data?.ok && data.slots?.length) {
      return data.slots;
    }
    return decorateSlots(date, data?.booked_slots ?? []);
  } catch {
    return decorateSlots(date);
  }
}

export async function createAppointment(payload: AppointmentPayload): Promise<AppointmentResponse> {
  try {
    const response = await fetch(apiUrl("/api/appointments"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15000),
    });
    const data = await readJson<AppointmentResponse>(response);
    if (!data) {
      return { ok: false, error: "The booking service didn't respond. Try again in a moment." };
    }
    if (!response.ok || !data.ok) {
      return {
        ok: false,
        error: data.error ?? "That time was just taken. Pick another slot.",
        errors: data.errors,
      };
    }
    return data;
  } catch {
    return { ok: false, error: "Could not send the booking. Check your connection and try once more." };
  }
}

export async function fetchReviews(): Promise<Review[]> {
  try {
    const response = await fetch(apiUrl("/api/reviews"), { cache: "no-store" });
    const data = await readJson<{ ok: boolean; reviews?: Review[] }>(response);
    if (response.ok && data?.ok && data.reviews) {
      return data.reviews;
    }
  } catch {
    /* fall through */
  }
  return [];
}

export async function submitReview(payload: ReviewPayload): Promise<ReviewResponse> {
  try {
    const response = await fetch(apiUrl("/api/reviews"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000),
    });
    const data = await readJson<ReviewResponse>(response);
    if (!data) {
      return { ok: false, error: "Could not send your review. Try again in a moment." };
    }
    if (!response.ok || !data.ok) {
      return {
        ok: false,
        error: data.error ?? "Could not send your review.",
        errors: data.errors,
      };
    }
    return data;
  } catch {
    return { ok: false, error: "Could not send your review. Check your connection and try once more." };
  }
}

export { FALLBACK_SERVICES, FALLBACK_SLOTS, FALLBACK_DENTISTS };
