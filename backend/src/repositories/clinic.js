import mongoose from "mongoose";
import { usingMemoryStore } from "../config/db.js";
import { Appointment } from "../models/Appointment.js";
import { Dentist } from "../models/Dentist.js";
import { Patient } from "../models/Patient.js";
import * as memory from "../memory/store.js";

export async function getDentistById(id) {
  if (usingMemoryStore) {
    return memory.findDentist(id);
  }
  if (!mongoose.isValidObjectId(id)) return null;
  return Dentist.findById(id);
}

export async function listAvailableDentists() {
  if (usingMemoryStore) {
    return memory.listDentists();
  }
  return Dentist.find({ is_available: true }).select("name specialty bio is_available").sort({ name: 1 }).lean();
}

export async function findConflict({ dentist_id, date, time_slot }) {
  if (usingMemoryStore) {
    return memory.findActiveAppointment(dentist_id, date, time_slot);
  }
  return Appointment.findOne({
    dentist_id,
    date,
    time_slot,
    status: { $in: ["pending", "confirmed"] },
  }).lean();
}

export async function listBookedSlots({ dentist_id, date }) {
  if (usingMemoryStore) {
    return memory.listBookedSlots(dentist_id, date);
  }
  return Appointment.find({
    dentist_id,
    date,
    status: { $in: ["pending", "confirmed"] },
  })
    .select("time_slot")
    .lean();
}

export async function upsertPatient({ email, full_name, phone }) {
  if (usingMemoryStore) {
    return memory.upsertPatient({ email, full_name, phone });
  }
  return Patient.findOneAndUpdate(
    { email },
    {
      $set: { full_name, phone },
      $setOnInsert: { email },
    },
    { new: true, upsert: true, runValidators: true },
  );
}

export async function createAppointmentRecord(data) {
  if (usingMemoryStore) {
    return memory.createAppointment(data);
  }
  return Appointment.create(data);
}

export function serializeId(value) {
  return value?._id ?? value?.id ?? value;
}
