import { randomUUID } from "crypto";

import { getDbPool } from "../config/db.js";

const parseJsonValue = (value, fallback) => {
  if (value === null || value === undefined) {
    return fallback;
  }

  if (typeof value !== "string") {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    return fallback;
  }
};

const serializeJsonValue = (value) => JSON.stringify(value ?? null);

const mapEmailRow = (row) => ({
  id: row.id,
  subject: row.subject,
  body: row.body,
  summary: parseJsonValue(row.summary, []),
  priority: row.priority,
  prioritySignals: parseJsonValue(row.priority_signals, []),
  draftReply: row.draft_reply,
  calendarEvent: parseJsonValue(row.calendar_event, {}),
  taskList: parseJsonValue(row.task_list, []),
  analysisProvider: row.analysis_provider,
  aiModel: row.ai_model,
  openaiResponseId: row.openai_response_id,
  tokenUsage: parseJsonValue(row.token_usage, {}),
  executedActions: parseJsonValue(row.executed_actions, []),
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const getPoolOrThrow = () => {
  const pool = getDbPool();

  if (!pool) {
    throw new Error("Database pool is not initialized");
  }

  return pool;
};

export const isValidEmailId = (value = "") =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    String(value).trim()
  );

export const createEmailRecord = async (emailData) => {
  const pool = getPoolOrThrow();
  const id = randomUUID();

  await pool.execute(
    `
      INSERT INTO emails (
        id,
        subject,
        body,
        summary,
        priority,
        priority_signals,
        draft_reply,
        calendar_event,
        task_list,
        analysis_provider,
        ai_model,
        openai_response_id,
        token_usage,
        executed_actions
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      id,
      emailData.subject ?? "",
      emailData.body ?? "",
      serializeJsonValue(emailData.summary ?? []),
      emailData.priority,
      serializeJsonValue(emailData.prioritySignals ?? []),
      emailData.draftReply ?? "",
      serializeJsonValue(emailData.calendarEvent ?? {}),
      serializeJsonValue(emailData.taskList ?? []),
      emailData.analysisProvider ?? "fallback",
      emailData.aiModel ?? "",
      emailData.openaiResponseId ?? "",
      serializeJsonValue(emailData.tokenUsage ?? {}),
      serializeJsonValue(emailData.executedActions ?? []),
    ]
  );

  return findEmailById(id);
};

export const findEmailById = async (id) => {
  const pool = getPoolOrThrow();
  const [rows] = await pool.execute("SELECT * FROM emails WHERE id = ? LIMIT 1", [id]);

  if (!rows.length) {
    return null;
  }

  return mapEmailRow(rows[0]);
};

export const updateEmailRecord = async (email) => {
  const pool = getPoolOrThrow();

  await pool.execute(
    `
      UPDATE emails
      SET
        subject = ?,
        body = ?,
        summary = ?,
        priority = ?,
        priority_signals = ?,
        draft_reply = ?,
        calendar_event = ?,
        task_list = ?,
        analysis_provider = ?,
        ai_model = ?,
        openai_response_id = ?,
        token_usage = ?,
        executed_actions = ?,
        updated_at = CURRENT_TIMESTAMP(3)
      WHERE id = ?
    `,
    [
      email.subject ?? "",
      email.body ?? "",
      serializeJsonValue(email.summary ?? []),
      email.priority,
      serializeJsonValue(email.prioritySignals ?? []),
      email.draftReply ?? "",
      serializeJsonValue(email.calendarEvent ?? {}),
      serializeJsonValue(email.taskList ?? []),
      email.analysisProvider ?? "fallback",
      email.aiModel ?? "",
      email.openaiResponseId ?? "",
      serializeJsonValue(email.tokenUsage ?? {}),
      serializeJsonValue(email.executedActions ?? []),
      email.id,
    ]
  );

  return findEmailById(email.id);
};

export const listEmails = async ({ priority, limit, offset }) => {
  const pool = getPoolOrThrow();
  const hasPriorityFilter = Boolean(priority);

  const [rows] = hasPriorityFilter
    ? await pool.execute(
        `
          SELECT * FROM emails
          WHERE priority = ?
          ORDER BY created_at DESC
          LIMIT ? OFFSET ?
        `,
        [priority, limit, offset]
      )
    : await pool.execute(
        `
          SELECT * FROM emails
          ORDER BY created_at DESC
          LIMIT ? OFFSET ?
        `,
        [limit, offset]
      );

  return rows.map(mapEmailRow);
};

export const countEmails = async ({ priority }) => {
  const pool = getPoolOrThrow();
  const [rows] = priority
    ? await pool.execute("SELECT COUNT(*) AS total FROM emails WHERE priority = ?", [priority])
    : await pool.execute("SELECT COUNT(*) AS total FROM emails");

  return Number(rows[0]?.total || 0);
};
