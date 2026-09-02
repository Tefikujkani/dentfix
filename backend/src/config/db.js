import mongoose from "mongoose";
import { env } from "./env.js";

export let usingMemoryStore = false;

export async function connectDb() {
  mongoose.set("strictQuery", true);

  try {
    await mongoose.connect(env.mongoUri, {
      serverSelectionTimeoutMS: 4000,
    });
    usingMemoryStore = false;
    console.log(`MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`);
  } catch (error) {
    if (env.nodeEnv === "production") {
      throw error;
    }
    usingMemoryStore = true;
    console.warn(`MongoDB unavailable (${error.message}). Using in-memory store for local development.`);
  }
}

export async function disconnectDb() {
  if (!usingMemoryStore) {
    await mongoose.disconnect();
  }
}
