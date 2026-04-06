import mongoose from "mongoose";

import Email from "../models/Email.js";
import { buildEmptyCalendarEvent } from "../utils/analysisNormalizer.js";
import AppError from "../utils/appError.js";
import { executeStoredAction } from "./action.service.js";
import { analyzeEmailWithAI } from "./ai.service.js";
import { detectPriority, getPrioritySignals } from "./priority.service.js";

const ensureDatabaseConnection = () => {
  if (mongoose.connection.readyState !== 1) {
    throw new AppError(
      503,
      "Database is not connected yet. Please try again once MongoDB is available."
    );
  }
};

export const analyzeAndStoreEmail = async ({ subject = "", body = "" }) => {
  ensureDatabaseConnection();

  const priority = detectPriority({ subject, body });
  const prioritySignalMap = getPrioritySignals({ subject, body });
  const analysis = await analyzeEmailWithAI({
    subject,
    body,
    priority,
  });

  const savedEmail = await Email.create({
    subject,
    body,
    summary: analysis.summary,
    priority,
    prioritySignals: [
      ...prioritySignalMap.urgentSignals,
      ...prioritySignalMap.actionSignals,
      ...prioritySignalMap.fyiSignals,
    ],
    draftReply: analysis.draftReply,
    calendarEvent: analysis.calendarEvent || buildEmptyCalendarEvent(),
    taskList: analysis.taskList,
    analysisProvider: analysis.analysisProvider,
    aiModel: analysis.aiModel,
    openaiResponseId: analysis.openaiResponseId,
    tokenUsage: analysis.tokenUsage,
  });

  return savedEmail;
};

export const executeEmailActionById = async ({ emailId, actionType, payload = {} }) => {
  ensureDatabaseConnection();

  if (!mongoose.isValidObjectId(emailId)) {
    throw new AppError(400, "Invalid emailId");
  }

  const email = await Email.findById(emailId);

  if (!email) {
    throw new AppError(404, "Email not found");
  }

  return executeStoredAction({
    email,
    actionType,
    payload,
  });
};

export const fetchEmailHistory = async (query = {}) => {
  ensureDatabaseConnection();

  const page = Math.max(Number.parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(query.limit, 10) || 10, 1), 100);
  const skip = (page - 1) * limit;
  const filter = {};

  if (query.priority) {
    filter.priority = query.priority;
  }

  const [emails, total] = await Promise.all([
    Email.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Email.countDocuments(filter),
  ]);

  return {
    page,
    limit,
    total,
    totalPages: Math.max(Math.ceil(total / limit), 1),
    emails,
  };
};
