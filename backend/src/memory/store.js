import { randomUUID } from "crypto";
import { DENTIST_SEED } from "../data/dentists.js";

const dentists = DENTIST_SEED.map((dentist) => ({
  _id: randomUUID(),
  ...dentist,
}));

const patients = [];
const appointments = [];

export function listDentists() {
  return dentists.filter((dentist) => dentist.is_available);
}

export function findDentist(id) {
  return dentists.find((dentist) => String(dentist._id) === String(id)) ?? null;
}

export function upsertPatient({ email, full_name, phone }) {
  let patient = patients.find((item) => item.email === email);
  if (!patient) {
    patient = {
      _id: randomUUID(),
      email,
      full_name,
      phone,
      created_at: new Date(),
    };
    patients.push(patient);
  } else {
    patient.full_name = full_name;
    patient.phone = phone;
  }
  return patient;
}

export function findActiveAppointment(dentistId, date, timeSlot) {
  return (
    appointments.find(
      (item) =>
        String(item.dentist_id) === String(dentistId) &&
        item.date === date &&
        item.time_slot === timeSlot &&
        ["pending", "confirmed"].includes(item.status),
    ) ?? null
  );
}

export function listBookedSlots(dentistId, date) {
  return appointments.filter(
    (item) =>
      String(item.dentist_id) === String(dentistId) &&
      item.date === date &&
      ["pending", "confirmed"].includes(item.status),
  );
}

export function createAppointment(data) {
  if (findActiveAppointment(data.dentist_id, data.date, data.time_slot)) {
    const error = new Error("Double booking");
    error.code = 11000;
    throw error;
  }

  const appointment = {
    _id: randomUUID(),
    ...data,
    created_at: new Date(),
  };
  appointments.push(appointment);
  return appointment;
}

const reviews = [];

export function listReviews(limit = 50) {
  return reviews
    .filter((item) => item.status === "approved")
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, limit);
}

export function createReview(data) {
  const review = {
    _id: randomUUID(),
    ...data,
    status: "approved",
    created_at: new Date(),
  };
  reviews.unshift(review);
  return review;
}
