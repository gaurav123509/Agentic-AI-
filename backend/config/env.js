import dotenv from "dotenv";

dotenv.config();

const toNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const parseOrigins = (value) => {
  if (!value || value.trim() === "*") {
    return ["*"];
  }

  return value
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
};

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: toNumber(process.env.PORT, 5000),
  mongoUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/mailpilot-ai",
  allowedOrigins: parseOrigins(process.env.CLIENT_URL || "*"),
  openAiApiKey: process.env.OPENAI_API_KEY?.trim() || "",
  openAiModel: process.env.OPENAI_MODEL?.trim() || "gpt-5.4-mini",
  openAiReasoningEffort: process.env.OPENAI_REASONING_EFFORT?.trim() || "low",
  dbRetryDelayMs: toNumber(process.env.DB_RETRY_DELAY_MS, 5000),
};

export const hasOpenAIKey = Boolean(env.openAiApiKey);
