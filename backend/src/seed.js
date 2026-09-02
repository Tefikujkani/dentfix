import { connectDb, disconnectDb, usingMemoryStore } from "./config/db.js";
import { Dentist } from "./models/Dentist.js";
import { Patient } from "./models/Patient.js";
import { Appointment } from "./models/Appointment.js";
import { DENTIST_SEED } from "./data/dentists.js";

async function seed() {
  await connectDb();

  if (usingMemoryStore) {
    console.log("Memory store is active; dentists are seeded automatically. Start MongoDB to persist data.");
    return;
  }

  await Appointment.deleteMany({});
  await Patient.deleteMany({});
  await Dentist.deleteMany({});
  await Dentist.insertMany(DENTIST_SEED);

  console.log(`Seeded ${DENTIST_SEED.length} dentists.`);
  await disconnectDb();
}

seed().catch(async (error) => {
  console.error(error);
  await disconnectDb();
  process.exit(1);
});
