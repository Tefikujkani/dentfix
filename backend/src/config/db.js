import mongoose from "mongoose";
import { env } from "./env.js";

export let usingMemoryStore = false;

const globalCache = globalThis;

async function connectWithCache() {
  if (globalCache.mongoose?.conn) {
    return globalCache.mongoose.conn;
  }

  if (!globalCache.mongoose) {
    globalCache.mongoose = { conn: null, promise: null };
  }

  if (!globalCache.mongoose.promise) {
    mongoose.set("strictQuery", true);
    globalCache.mongoose.promise = mongoose
      .connect(env.mongoUri, { serverSelectionTimeoutMS: 8000 })
      .then((mongooseInstance) => mongooseInstance);
  }

  globalCache.mongoose.conn = await globalCache.mongoose.promise;
  return globalCache.mongoose.conn;
}

export async function connectDb() {
  try {
    await connectWithCache();
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
