import mongoose from "mongoose";

import { env } from "./env.js";

mongoose.set("strictQuery", true);

let retryTimer = null;
let isConnecting = false;

const scheduleReconnect = () => {
  if (retryTimer) {
    return;
  }

  retryTimer = setTimeout(async () => {
    retryTimer = null;
    await connectDB();
  }, env.dbRetryDelayMs);
};

mongoose.connection.on("connected", () => {
  console.log("MongoDB connected successfully");
});

mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected. Retrying connection...");
  scheduleReconnect();
});

mongoose.connection.on("error", (error) => {
  console.error("MongoDB connection error:", error.message);
});

const connectDB = async () => {
  if (mongoose.connection.readyState === 1 || isConnecting) {
    return mongoose.connection.readyState === 1;
  }

  isConnecting = true;

  try {
    await mongoose.connect(env.mongoUri, {
      serverSelectionTimeoutMS: 5000,
      autoIndex: true,
    });

    return true;
  } catch (error) {
    console.error("Initial MongoDB connection failed:", error.message);
    scheduleReconnect();
    return false;
  } finally {
    isConnecting = false;
  }
};

export default connectDB;
