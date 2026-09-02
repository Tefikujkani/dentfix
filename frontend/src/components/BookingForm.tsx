"use client";

import { type FormEvent, type ReactNode, useEffect, useMemo, useState } from "react";
import { CheckCircle2, ChevronLeft, ChevronRight, LoaderCircle } from "lucide-react";
import { createAppointment, fetchAvailability } from "@/lib/api";
import type { Dentist, Service, TimeSlot } from "@/lib/types";
import { decorateSlots, SCHEDULE_SLOTS, upcomingVisitDays, weekdayName } from "@/lib/schedule";
import { validateBooking, type FieldErrors } from "@/lib/validation";

type Props = {
  services: Service[];
  dentists: Dentist[];
  timeSlots: TimeSlot[];
};

const STEPS = ["You", "Care", "Time"] as const;

const EMPTY = {
  full_name: "",
  email: "",
  phone: "",
  service_type: "",
  dentist_id: "",
  date: "",
  time_slot: "",
  notes: "",
};

export function BookingForm({ services, dentists, timeSlots }: Props) {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [slotStatus, setSlotStatus] = useState<TimeSlot[]>(timeSlots);
  const visitDays = useMemo(() => upcomingVisitDays(12), []);
  const [availabilityState, setAvailabilityState] = useState<"idle" | "loading" | "error">("idle");
  const [submitState, setSubmitState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [serverMessage, setServerMessage] = useState("");

  const selectedService = services.find((service) => service.id === values.service_type);
  const matchingDentists = useMemo(() => {
    if (!selectedService) return dentists;
    const preferred = dentists.filter((dentist) => dentist.specialty === selectedService.specialty);
    return preferred.length ? preferred : dentists;
  }, [dentists, selectedService]);

  useEffect(() => {
    if (values.dentist_id && !matchingDentists.some((dentist) => dentist.id === values.dentist_id)) {
      setValues((current) => ({ ...current, dentist_id: "", time_slot: "" }));
    }
  }, [matchingDentists, values.dentist_id]);

  useEffect(() => {
    if (!values.date) {
      setSlotStatus(timeSlots);
      setAvailabilityState("idle");
      return;
    }

    setSlotStatus(decorateSlots(values.date));
    if (!values.dentist_id) {
      setAvailabilityState("idle");
      return;
    }

    let cancelled = false;
    setAvailabilityState("loading");

    fetchAvailability(values.date, values.dentist_id)
      .then((slots) => {
        if (cancelled) return;
        setSlotStatus(slots.length ? slots : decorateSlots(values.date));
        setAvailabilityState("idle");
        setValues((current) => {
          const selected = slots.find((slot) => slot.id === current.time_slot);
          if (current.time_slot && selected && selected.available === false) {
            return { ...current, time_slot: "" };
          }
          return current;
        });
      })
      .catch(() => {
        if (cancelled) return;
        setSlotStatus(decorateSlots(values.date));
        setAvailabilityState("idle");
      });

    return () => {
      cancelled = true;
    };
  }, [timeSlots, values.date, values.dentist_id]);

  function update<K extends keyof typeof EMPTY>(key: K, value: (typeof EMPTY)[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
    setSubmitState("idle");
  }

  function validateStep(currentStep: number) {
    const allErrors = validateBooking({
      ...values,
      time_slot: values.time_slot,
    });
    const fieldsByStep: (keyof FieldErrors)[][] = [
      ["full_name", "email", "phone"],
      ["service_type", "dentist_id"],
      ["date", "time_slot"],
    ];
    const stepErrors: FieldErrors = {};
    for (const field of fieldsByStep[currentStep]) {
      if (allErrors[field]) stepErrors[field] = allErrors[field];
    }
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  }

  function nextStep() {
    if (validateStep(step)) setStep((current) => Math.min(current + 1, STEPS.length - 1));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validateStep(2) || values.time_slot === "") return;

    setSubmitState("loading");
    setServerMessage("");

    try {
      const result = await createAppointment({
        full_name: values.full_name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        service_type: values.service_type,
        dentist_id: values.dentist_id,
        date: values.date,
        time_slot: values.time_slot,
        notes: values.notes.trim(),
      });

      if (!result.ok) {
        const fieldErrors: FieldErrors = {};
        for (const item of result.errors ?? []) {
          fieldErrors[item.field] = item.message;
        }
        setErrors(fieldErrors);
        setSubmitState("error");
        setServerMessage(result.error ?? "That didn't go through. Try once more, or call us.");
        if (values.date && values.dentist_id) {
          const slots = await fetchAvailability(values.date, values.dentist_id);
          setSlotStatus(slots.length ? slots : decorateSlots(values.date));
        }
        return;
      }

      setSubmitState("success");
    } catch {
      setSubmitState("error");
      setServerMessage("Could not send the booking. Check your connection and try once more.");
    }
  }

  if (submitState === "success") {
    return (
      <section id="booking" className="scroll-mt-24 bg-white px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-xl text-center">
          <div className="rounded-[1.4rem] bg-bg p-10" role="status">
            <CheckCircle2 className="mx-auto h-14 w-14 text-clinic" aria-hidden="true" />
            <h2 className="mt-4 text-3xl font-semibold text-ink">
              We got your <span className="accent">request</span>
            </h2>
            <p className="mt-3 text-slate-600">
              Thanks, {values.full_name.split(" ")[0]}. We&apos;ll email you today to confirm the time. If you don&apos;t
              hear from us, call the desk.
            </p>
            <button
              type="button"
              className="btn-primary mt-8"
              onClick={() => {
                setValues(EMPTY);
                setStep(0);
                setSubmitState("idle");
              }}
            >
              Book another time
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="booking" className="scroll-mt-24 bg-white px-4 py-12 pb-20 sm:px-6 sm:py-16 sm:pb-24">
      <div className="mx-auto mb-10 max-w-7xl text-center">
        <h2 className="text-3xl font-semibold text-ink sm:text-4xl">
          Book Your <span className="accent">Visit</span>
        </h2>
        <p className="mt-2 text-sm text-slate-500">Pick a day and a time. Taken slots stay locked so nobody else can take them.</p>
      </div>
      <div className="mx-auto grid max-w-7xl rounded-[1.6rem] bg-white shadow-soft lg:grid-cols-[0.86fr_1.14fr]">
        <aside className="hidden border-b border-line bg-slate-50/70 px-5 py-10 sm:px-10 lg:block lg:border-r lg:border-b-0">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-sm font-semibold text-clinic">Booking</p>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              Pick a time that <span className="accent">works</span>
            </h3>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Takes about a minute. We email the same day to lock it in. If you&apos;d rather talk it through, call.
            </p>
            <ol className="mt-8 space-y-3">
              {["Your name and how to reach you", "What you need, and who you prefer", "A day and a clock time"].map(
                (item, index) => {
                  const active = index === step;
                  const done = index < step;
                  return (
                    <li
                      key={item}
                      className={`flex gap-3 rounded-xl border-2 px-3 py-3 text-sm transition-colors ${
                        active
                          ? "border-clinic bg-sky-50 font-medium text-ink"
                          : done
                            ? "border-slate-200 bg-white text-slate-600"
                            : "border-slate-200 bg-white text-slate-500"
                      }`}
                    >
                      <span
                        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                          active || done ? "bg-clinic text-white" : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {index + 1}
                      </span>
                      {item}
                    </li>
                  );
                },
              )}
            </ol>
            <p className="mt-8 rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              Prefer to talk?{" "}
              <a href="tel:+15550142000" className="press font-semibold text-clinic underline decoration-sky-200">
                (555) 014-2000
              </a>
            </p>
          </div>
        </aside>

        <div className="border-t border-line bg-slate-50/70 px-5 py-10 sm:px-10 lg:border-t-0 lg:border-l">
        <ol className="mb-8 flex items-center gap-2" aria-label="Booking progress">
          {STEPS.map((label, index) => (
            <li key={label} className="flex flex-1 items-center gap-2">
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                  index <= step ? "bg-clinic text-white" : "bg-bg text-slate-400"
                }`}
                aria-current={index === step ? "step" : undefined}
              >
                {index + 1}
              </span>
              <span className="hidden text-sm font-medium text-slate-600 sm:block">{label}</span>
              {index < STEPS.length - 1 ? <span className="hidden h-px flex-1 bg-line sm:block" /> : null}
            </li>
          ))}
        </ol>

        <form
          className="space-y-6"
          onSubmit={onSubmit}
          noValidate
        >
          <div key={step} className="animate-step rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          {step === 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                className="sm:col-span-2"
                htmlFor="full_name"
                label="Your name"
                error={errors.full_name}
              >
                <input
                  id="full_name"
                  name="full_name"
                  autoComplete="name"
                  value={values.full_name}
                  onChange={(event) => update("full_name", event.target.value)}
                  className={inputClass(errors.full_name)}
                  required
                />
              </Field>
              <Field htmlFor="email" label="Email" error={errors.email}>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={values.email}
                  onChange={(event) => update("email", event.target.value)}
                  className={inputClass(errors.email)}
                  required
                />
              </Field>
              <Field htmlFor="phone" label="Phone" error={errors.phone}>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={values.phone}
                  onChange={(event) => update("phone", event.target.value)}
                  className={inputClass(errors.phone)}
                  required
                />
              </Field>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field htmlFor="service_type" label="What do you need?" error={errors.service_type}>
                <select
                  id="service_type"
                  name="service_type"
                  value={values.service_type}
                  onChange={(event) => update("service_type", event.target.value)}
                  className={inputClass(errors.service_type)}
                  required
                >
                  <option value="">Pick one</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field htmlFor="dentist_id" label="Anyone you prefer?" error={errors.dentist_id}>
                <select
                  id="dentist_id"
                  name="dentist_id"
                  value={values.dentist_id}
                  onChange={(event) => update("dentist_id", event.target.value)}
                  className={inputClass(errors.dentist_id)}
                  required
                >
                  <option value="">Pick someone</option>
                  {matchingDentists.map((dentist) => (
                    <option key={dentist.id} value={dentist.id}>
                      {dentist.name} · {dentist.specialty}
                    </option>
                  ))}
                </select>
              </Field>
              <Field className="sm:col-span-2" htmlFor="notes" label="Anything we should know?">
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  value={values.notes}
                  onChange={(event) => update("notes", event.target.value)}
                  className={inputClass()}
                />
              </Field>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-5">
              <fieldset>
                <legend className="mb-2 text-sm font-semibold text-ink">Which day?</legend>
                <div className="-mx-1 flex gap-2 overflow-x-auto pb-1 snap-x snap-mandatory">
                  {visitDays.map((day) => {
                    const selected = values.date === day;
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => update("date", day)}
                        className={`press shrink-0 snap-start rounded-2xl border px-3 py-2.5 text-left text-xs sm:text-sm ${
                          selected
                            ? "border-clinic bg-sky-50 font-semibold text-navy"
                            : "border-slate-300 bg-white text-slate-700 hover:border-clinic/40"
                        }`}
                      >
                        {weekdayName(day)}
                      </button>
                    );
                  })}
                </div>
                {errors.date ? <p className="mt-2 text-sm text-rose-600">{errors.date}</p> : null}
              </fieldset>

              <fieldset>
                <legend className="mb-2 text-sm font-semibold text-ink">What time?</legend>
                {!values.date ? (
                  <p className="text-sm text-slate-500">Pick a day first and we&apos;ll show what&apos;s still open.</p>
                ) : null}
                {availabilityState === "loading" ? (
                  <p className="mb-3 flex items-center gap-2 text-sm text-slate-500">
                    <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
                    Checking what&apos;s still open…
                  </p>
                ) : null}

                {(["morning", "afternoon"] as const).map((period) => {
                  const periodSlots = (slotStatus.length ? slotStatus : SCHEDULE_SLOTS).filter(
                    (slot) => (slot.period ?? SCHEDULE_SLOTS.find((item) => item.id === slot.id)?.period) === period,
                  );
                  return (
                    <div key={period} className="mt-4">
                      <p className="mb-2 text-xs font-bold tracking-[0.16em] text-muted uppercase">
                        {period === "morning" ? "Morning" : "Afternoon"}
                      </p>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                        {periodSlots.map((slot) => {
                          const taken = values.date ? slot.available === false && slot.reason === "booked" : false;
                          const past = values.date ? slot.reason === "past" : false;
                          const closed = slot.reason === "closed" || slot.reason === "unavailable";
                          const disabled = !values.date || slot.available === false;
                          const reasonLabel = taken ? "Taken" : past ? "Passed" : closed ? "Closed" : null;
                          return (
                            <label
                              key={slot.id}
                              data-press
                              className={`press rounded-2xl border px-2 py-3 text-center text-xs leading-tight sm:text-sm ${
                                values.time_slot === slot.id
                                  ? "border-clinic bg-sky-50 font-semibold text-navy"
                                  : "border-slate-300 bg-white text-slate-700"
                              } ${disabled ? "cursor-not-allowed opacity-45" : "cursor-pointer hover:border-sky-200"}`}
                            >
                              <input
                                type="radio"
                                name="time_slot"
                                value={slot.id}
                                checked={values.time_slot === slot.id}
                                disabled={Boolean(disabled)}
                                onChange={() => update("time_slot", slot.id)}
                                className="sr-only"
                              />
                              <span className="block">{slot.label}</span>
                              {reasonLabel ? (
                                <span className="mt-1 block text-[10px] font-semibold tracking-wide text-rose-600 uppercase">
                                  {reasonLabel}
                                </span>
                              ) : null}
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
                {errors.time_slot ? <p className="mt-2 text-sm text-rose-600">{errors.time_slot}</p> : null}
                <p className="mt-3 text-xs text-slate-500">
                  Taken times are already booked for this dentist. Same day + same time can&apos;t be used twice.
                </p>
              </fieldset>
            </div>
          ) : null}
          </div>

          <div
            className="min-h-6"
            aria-live="polite"
            aria-atomic="true"
          >
            {submitState === "error" ? (
              <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{serverMessage}</p>
            ) : null}
            {submitState === "loading" ? (
              <p className="flex items-center gap-2 text-sm text-slate-600">
                <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
                Sending that over…
              </p>
            ) : null}
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => setStep((current) => Math.max(current - 1, 0))}
              disabled={step === 0 || submitState === "loading"}
              className="inline-flex w-full items-center justify-center gap-1 rounded-full px-4 py-2.5 text-sm font-semibold text-slate-600 disabled:opacity-40 sm:w-auto sm:justify-start"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              Back
            </button>
            {step < STEPS.length - 1 ? (
              <button type="button" onClick={nextStep} className="btn-primary w-full sm:w-auto">
                Continue
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            ) : (
              <button type="submit" disabled={submitState === "loading"} className="btn-primary w-full disabled:opacity-70 sm:w-auto">
                {submitState === "loading" ? "Sending…" : "Request this time"}
              </button>
            )}
          </div>
        </form>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  htmlFor,
  error,
  children,
  className = "",
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-2 block text-sm font-semibold text-ink">
        {label}
      </label>
      {children}
      {error ? <p className="mt-1.5 text-sm text-rose-600">{error}</p> : null}
    </div>
  );
}

function inputClass(error?: string) {
  return `w-full rounded-xl border-2 bg-white px-3.5 py-3.5 text-sm font-medium text-ink shadow-sm outline-none transition placeholder:text-slate-400 focus:border-clinic focus:ring-4 focus:ring-sky-100 ${
    error ? "border-rose-400 bg-rose-50/40" : "border-slate-300"
  }`;
}
