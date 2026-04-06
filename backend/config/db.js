import mysql from "mysql2/promise";

import { env } from "./env.js";

let pool = null;
let retryTimer = null;
let isConnecting = false;
let isDatabaseReady = false;

const getSslConfig = () => {
  if (!env.mysqlSsl) {
    return undefined;
  }

  return {
    rejectUnauthorized: false,
  };
};

const getConnectionConfig = () => {
  if (env.mysqlUrl) {
    const connectionUrl = new URL(env.mysqlUrl);

    return {
      host: connectionUrl.hostname,
      port: Number(connectionUrl.port || 3306),
      user: decodeURIComponent(connectionUrl.username),
      password: decodeURIComponent(connectionUrl.password),
      database: connectionUrl.pathname.replace(/^\//, ""),
      ssl: connectionUrl.protocol === "mysqls:" ? { rejectUnauthorized: false } : getSslConfig(),
    };
  }

  return {
    host: env.mysqlHost,
    port: env.mysqlPort,
    user: env.mysqlUser,
    password: env.mysqlPassword,
    database: env.mysqlDatabase,
    ssl: getSslConfig(),
  };
};

const scheduleReconnect = () => {
  if (retryTimer) {
    return;
  }

  retryTimer = setTimeout(async () => {
    retryTimer = null;
    await connectDB();
  }, env.dbRetryDelayMs);
};

const initializeSchema = async (dbPool) => {
  await dbPool.query(`
    CREATE TABLE IF NOT EXISTS emails (
      id CHAR(36) NOT NULL PRIMARY KEY,
      subject VARCHAR(255) NOT NULL DEFAULT '',
      body LONGTEXT NOT NULL,
      summary JSON NOT NULL,
      priority ENUM('Urgent', 'Requires Action', 'FYI') NOT NULL,
      priority_signals JSON NOT NULL,
      draft_reply LONGTEXT NOT NULL,
      calendar_event JSON NOT NULL,
      task_list JSON NOT NULL,
      analysis_provider ENUM('openai', 'fallback') NOT NULL DEFAULT 'fallback',
      ai_model VARCHAR(120) NOT NULL DEFAULT '',
      openai_response_id VARCHAR(191) NOT NULL DEFAULT '',
      token_usage JSON NOT NULL,
      executed_actions JSON NOT NULL,
      created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      INDEX idx_emails_created_at (created_at),
      INDEX idx_emails_priority_created_at (priority, created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
};

const ensureDatabaseExists = async (connectionConfig) => {
  try {
    const adminConnection = await mysql.createConnection({
      host: connectionConfig.host,
      port: connectionConfig.port,
      user: connectionConfig.user,
      password: connectionConfig.password,
      ssl: connectionConfig.ssl,
    });

    await adminConnection.query(
      "CREATE DATABASE IF NOT EXISTS ?? CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci",
      [connectionConfig.database]
    );
    await adminConnection.end();
  } catch (error) {
    console.warn("Database bootstrap step skipped:", error.message);
  }
};

export const getDbPool = () => pool;

export const isDatabaseConnected = () => isDatabaseReady;

const connectDB = async () => {
  if (isConnecting || isDatabaseReady) {
    return isDatabaseReady;
  }

  isConnecting = true;
  const connectionConfig = getConnectionConfig();

  try {
    await ensureDatabaseExists(connectionConfig);

    pool = mysql.createPool({
      ...connectionConfig,
      waitForConnections: true,
      connectionLimit: env.mysqlConnectionLimit,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
      charset: "utf8mb4",
    });

    await pool.query("SELECT 1");
    await initializeSchema(pool);

    isDatabaseReady = true;
    console.log("MySQL connected successfully");
    return true;
  } catch (error) {
    isDatabaseReady = false;
    console.error("Initial MySQL connection failed:", error.message);
    scheduleReconnect();
    return false;
  } finally {
    isConnecting = false;
  }
};

export default connectDB;
