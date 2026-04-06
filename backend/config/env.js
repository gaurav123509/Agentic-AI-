import dotenv from "dotenv";

dotenv.config();

const toNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toBoolean = (value, fallback = false) => {
  if (typeof value !== "string") {
    return fallback;
  }

  return ["true", "1", "yes", "on"].includes(value.trim().toLowerCase());
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
  mysqlUrl: process.env.MYSQL_URL?.trim() || "",
  mysqlHost: process.env.MYSQL_HOST || "127.0.0.1",
  mysqlPort: toNumber(process.env.MYSQL_PORT, 3306),
  mysqlUser: process.env.MYSQL_USER || "root",
  mysqlPassword: process.env.MYSQL_PASSWORD || "",
  mysqlDatabase: process.env.MYSQL_DATABASE || "mailpilot_ai",
  mysqlSsl: toBoolean(process.env.MYSQL_SSL, false),
  mysqlConnectionLimit: toNumber(process.env.MYSQL_CONNECTION_LIMIT, 10),
  allowedOrigins: parseOrigins(process.env.CLIENT_URL || "*"),
  openAiApiKey: process.env.OPENAI_API_KEY?.trim() || "",
  openAiModel: process.env.OPENAI_MODEL?.trim() || "gpt-5.4-mini",
  openAiReasoningEffort: process.env.OPENAI_REASONING_EFFORT?.trim() || "low",
  dbRetryDelayMs: toNumber(process.env.DB_RETRY_DELAY_MS, 5000),
};

export const hasOpenAIKey = Boolean(env.openAiApiKey);
