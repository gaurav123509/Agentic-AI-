const toTrimmedString = (value, fallback = "") => {
  if (typeof value === "string") {
    return value.trim();
  }

  if (value === null || value === undefined) {
    return fallback;
  }

  return String(value).trim();
};

const dedupeStrings = (values) => [...new Set(values.filter(Boolean))];

const isValidDateInput = (value) => {
  if (!value) {
    return false;
  }

  const parsed = new Date(value);
  return !Number.isNaN(parsed.getTime());
};

export const buildEmptyCalendarEvent = () => ({
  shouldCreate: false,
  title: "",
  description: "",
  start: null,
  end: null,
  timezone: "UTC",
  location: "",
  attendees: [],
  status: "none",
});

export const normalizeSummary = (rawSummary, context = {}) => {
  const values = Array.isArray(rawSummary)
    ? rawSummary
    : typeof rawSummary === "string"
      ? rawSummary.split(/\r?\n|[•-]\s+/)
      : [];

  const normalized = values
    .map((item) => toTrimmedString(item))
    .filter(Boolean)
    .slice(0, 4);

  if (normalized.length > 0) {
    return normalized;
  }

  const fallbackText = `${context.subject || ""} ${context.body || ""}`.trim();

  if (!fallbackText) {
    return ["Email received."];
  }

  const conciseText = fallbackText.replace(/\s+/g, " ").trim();
  return [conciseText.slice(0, 180)];
};

export const normalizeTaskList = (rawTaskList, context = {}) => {
  const tasks = Array.isArray(rawTaskList) ? rawTaskList : [];

  const normalized = tasks
    .map((task) => {
      if (typeof task === "string") {
        return {
          title: toTrimmedString(task),
          dueDate: null,
          completed: false,
        };
      }

      if (!task || typeof task !== "object") {
        return null;
      }

      return {
        title: toTrimmedString(task.title),
        dueDate: isValidDateInput(task.dueDate) ? new Date(task.dueDate) : null,
        completed: Boolean(task.completed),
      };
    })
    .filter((task) => task?.title);

  if (normalized.length > 0) {
    const uniqueTitles = dedupeStrings(normalized.map((task) => task.title.toLowerCase()));

    return uniqueTitles.map((title) => {
      const sourceTask = normalized.find((task) => task.title.toLowerCase() === title);
      return sourceTask;
    });
  }

  if (context.subject && ["Urgent", "Requires Action"].includes(context.priority)) {
    return [
      {
        title: `Review email regarding ${context.subject}`,
        dueDate: null,
        completed: false,
      },
    ];
  }

  return [];
};

export const normalizeCalendarEvent = (rawCalendarEvent, context = {}) => {
  if (!rawCalendarEvent || typeof rawCalendarEvent !== "object") {
    return buildEmptyCalendarEvent();
  }

  const shouldCreate = Boolean(rawCalendarEvent.shouldCreate);
  const start = isValidDateInput(rawCalendarEvent.start)
    ? new Date(rawCalendarEvent.start)
    : null;
  const end = isValidDateInput(rawCalendarEvent.end)
    ? new Date(rawCalendarEvent.end)
    : null;

  if (!shouldCreate) {
    return buildEmptyCalendarEvent();
  }

  return {
    shouldCreate: true,
    title: toTrimmedString(rawCalendarEvent.title, context.subject || "Email Follow-up"),
    description: toTrimmedString(
      rawCalendarEvent.description,
      context.body || "Suggested from email analysis."
    ),
    start,
    end,
    timezone: toTrimmedString(rawCalendarEvent.timezone, "UTC"),
    location: toTrimmedString(rawCalendarEvent.location),
    attendees: Array.isArray(rawCalendarEvent.attendees)
      ? dedupeStrings(rawCalendarEvent.attendees.map((item) => toTrimmedString(item)))
      : [],
    status: ["none", "suggested", "scheduled"].includes(rawCalendarEvent.status)
      ? rawCalendarEvent.status
      : "suggested",
  };
};

export const normalizeEmailAnalysis = (rawAnalysis = {}, context = {}) => ({
  summary: normalizeSummary(rawAnalysis.summary, context),
  draftReply: toTrimmedString(
    rawAnalysis.draftReply,
    "Thank you for your email. I will review it and follow up shortly."
  ),
  calendarEvent: normalizeCalendarEvent(rawAnalysis.calendarEvent, context),
  taskList: normalizeTaskList(rawAnalysis.taskList, context),
});

const stripCodeFences = (value) =>
  value
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "");

export const parseStructuredOutput = (outputText = "") => {
  const cleaned = stripCodeFences(outputText);
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1) {
    throw new Error("AI response did not contain a JSON object");
  }

  const jsonCandidate = cleaned.slice(firstBrace, lastBrace + 1);
  return JSON.parse(jsonCandidate);
};
