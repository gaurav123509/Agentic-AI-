import express from "express";
import cors from "cors";

import connectDB, { isDatabaseConnected } from "./config/db.js";
import { env } from "./config/env.js";
import emailRoutes from "./routes/email.routes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

const app = express();

const buildCorsOptions = () => {
  if (env.allowedOrigins.includes("*")) {
    return {
      origin: true,
      credentials: true,
    };
  }

  return {
    origin(origin, callback) {
      if (!origin || env.allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
    credentials: true,
  };
};

app.use(cors(buildCorsOptions()));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    service: "MailPilot AI",
    message: "MailPilot AI backend is running",
    endpoints: {
      health: "/health",
      analyzeEmail: "/api/emails/analyze",
      executeAction: "/api/emails/execute-action",
      emailHistory: "/api/emails/history",
    },
  });
});

app.get("/health", (req, res) => {
  const databaseStatus = isDatabaseConnected() ? "connected" : "disconnected";

  res.status(isDatabaseConnected() ? 200 : 503).json({
    success: true,
    service: "MailPilot AI",
    environment: env.nodeEnv,
    database: databaseStatus,
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/emails", emailRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async () => {
  await connectDB();

  app.listen(env.port, () => {
    console.log(`MailPilot AI backend running on port ${env.port}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start MailPilot AI backend:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled promise rejection:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
  process.exit(1);
});
