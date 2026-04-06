import AppError from "../utils/appError.js";
import {
  buildEmptyCalendarEvent,
  normalizeCalendarEvent,
  normalizeTaskList,
} from "../utils/analysisNormalizer.js";

const DEFAULT_REPLY =
  "Thank you for your email. I have reviewed it and will follow up with the appropriate next steps shortly.";

const taskSignalRegex =
  /\b(please|kindly|can you|could you|need to|action required|review|approve|reply|respond|schedule|send|prepare|join)\b/i;

const sentenceCase = (value) => {
  const trimmed = value.trim().replace(/\s+/g, " ");

  if (!trimmed) {
    return "";
  }

  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
};

const splitIntoSentences = (body = "") =>
  body
    .split(/\r?\n|(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

const buildFallbackSummary = ({ subject = "", body = "" }) => {
  const sentences = splitIntoSentences(body);
  const summary = [];

  if (subject.trim()) {
    summary.push(`Subject: ${subject.trim()}`);
  }

  for (const sentence of sentences) {
    if (summary.length >= 3) {
      break;
    }

    const conciseSentence = sentence.replace(/\s+/g, " ").trim();

    if (conciseSentence) {
      summary.push(conciseSentence);
    }
  }

  if (summary.length === 0) {
    summary.push("Email received with no additional summary details available.");
  }

  return summary.slice(0, 3);
};

const buildFallbackDraftReply = ({ subject = "", priority }) => {
  const priorityLine =
    priority === "Urgent"
      ? "I understand this is time-sensitive and I am prioritizing it."
      : "I appreciate the update and I am reviewing the details.";

  const subjectLine = subject.trim()
    ? `Regarding "${subject.trim()}", ${priorityLine.toLowerCase()}`
    : priorityLine;

  return `${DEFAULT_REPLY}\n\n${subjectLine}\n\nBest regards,\nMailPilot AI`;
};

const deriveTaskCandidates = (body = "", subject = "") => {
  const matches = splitIntoSentences(body)
    .filter((sentence) => taskSignalRegex.test(sentence))
    .map((sentence) => sentenceCase(sentence.replace(/[.]+$/, "")));

  if (matches.length > 0) {
    return matches;
  }

  if (subject.trim()) {
    return [`Review email regarding ${subject.trim()}`];
  }

  return [];
};

const extractLocation = (text = "") => {
  const locationPatterns = [
    /(zoom)/i,
    /(google meet)/i,
    /(microsoft teams|teams)/i,
    /(office)/i,
  ];

  const match = locationPatterns
    .map((pattern) => text.match(pattern))
    .find(Boolean);

  return match ? sentenceCase(match[0]) : "";
};

const buildFallbackCalendarEvent = ({ subject = "", body = "" }) => {
  const text = `${subject} ${body}`;
  const mentionsMeeting = /\b(meeting|call|sync|demo|interview|calendar)\b/i.test(text);

  if (!mentionsMeeting) {
    return buildEmptyCalendarEvent();
  }

  return normalizeCalendarEvent(
    {
      shouldCreate: true,
      title: subject.trim() || "Follow-up Meeting",
      description: body.trim() || "Meeting requested from incoming email.",
      start: null,
      end: null,
      timezone: "UTC",
      location: extractLocation(text),
      attendees: [],
      status: "suggested",
    },
    { subject, body }
  );
};

export const buildFallbackEmailArtifacts = ({ subject = "", body = "", priority }) => ({
  summary: buildFallbackSummary({ subject, body }),
  draftReply: buildFallbackDraftReply({ subject, priority }),
  calendarEvent: buildFallbackCalendarEvent({ subject, body }),
  taskList: normalizeTaskList(
    deriveTaskCandidates(body, subject).map((title) => ({
      title,
      dueDate: null,
      completed: false,
    })),
    { subject, body, priority }
  ),
});

const normalizeActionType = (actionType = "") => {
  const value = actionType.trim().toLowerCase();

  if (["reply", "send_reply", "send-reply"].includes(value)) {
    return "send_reply";
  }

  if (["task", "create_task", "create-task"].includes(value)) {
    return "create_task";
  }

  if (["calendar", "schedule_event", "schedule-event"].includes(value)) {
    return "schedule_event";
  }

  return value;
};

const getPlainObject = (value) => value;

export const executeStoredAction = async ({ email, actionType, payload = {}, saveEmail }) => {
  const normalizedActionType = normalizeActionType(actionType);

  switch (normalizedActionType) {
    case "send_reply": {
      const replyToSend = String(payload.reply ?? email.draftReply ?? "").trim();

      if (!replyToSend) {
        throw new AppError(400, "No draft reply is available to execute");
      }

      email.executedActions.push({
        actionType: normalizedActionType,
        status: "completed",
        payload: {
          reply: replyToSend,
        },
        executedAt: new Date(),
      });

      await saveEmail(email);

      return {
        emailId: email.id,
        actionType: normalizedActionType,
        message: "Draft reply marked as executed",
        draftReply: replyToSend,
      };
    }

    case "create_task": {
      const incomingTasks = Array.isArray(payload.tasks) ? payload.tasks : [];
      const sourceTasks = incomingTasks.length > 0 ? incomingTasks : getPlainObject(email.taskList);
      const normalizedTasks = normalizeTaskList(sourceTasks, {
        subject: email.subject,
        body: email.body,
        priority: email.priority,
      });

      if (normalizedTasks.length === 0) {
        throw new AppError(400, "No task data is available to execute");
      }

      email.taskList = normalizedTasks;
      email.executedActions.push({
        actionType: normalizedActionType,
        status: "completed",
        payload: {
          taskCount: normalizedTasks.length,
        },
        executedAt: new Date(),
      });

      await saveEmail(email);

      return {
        emailId: email.id,
        actionType: normalizedActionType,
        message: "Task action executed successfully",
        taskList: email.taskList,
      };
    }

    case "schedule_event": {
      const mergedEvent = normalizeCalendarEvent(
        {
          ...getPlainObject(email.calendarEvent),
          ...payload.calendarEvent,
          shouldCreate: true,
          status: "scheduled",
        },
        {
          subject: email.subject,
          body: email.body,
        }
      );

      email.calendarEvent = mergedEvent;
      email.executedActions.push({
        actionType: normalizedActionType,
        status: "completed",
        payload: {
          title: mergedEvent.title,
          start: mergedEvent.start,
          end: mergedEvent.end,
        },
        executedAt: new Date(),
      });

      await saveEmail(email);

      return {
        emailId: email.id,
        actionType: normalizedActionType,
        message: "Calendar event action executed successfully",
        calendarEvent: email.calendarEvent,
      };
    }

    default:
      throw new AppError(
        400,
        "Unsupported actionType. Use send_reply, create_task, or schedule_event."
      );
  }
};
