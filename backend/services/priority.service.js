const URGENT_KEYWORDS = [
  "urgent",
  "asap",
  "deadline",
  "immediately",
  "critical",
  "blocker",
  "escalation",
  "overdue",
];

const ACTION_KEYWORDS = [
  "meeting",
  "client",
  "reply",
  "respond",
  "schedule",
  "review",
  "approve",
  "action required",
  "follow up",
  "call",
  "join",
];

const FYI_KEYWORDS = [
  "fyi",
  "for your information",
  "newsletter",
  "announcement",
  "update only",
  "no action needed",
];

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const findMatches = (text, keywords) =>
  keywords.filter((keyword) => {
    const pattern = new RegExp(`\\b${escapeRegExp(keyword)}\\b`, "i");
    return pattern.test(text);
  });

export const getPrioritySignals = ({ subject = "", body = "" }) => {
  const combinedText = `${subject} ${body}`.toLowerCase();

  return {
    urgentSignals: findMatches(combinedText, URGENT_KEYWORDS),
    actionSignals: findMatches(combinedText, ACTION_KEYWORDS),
    fyiSignals: findMatches(combinedText, FYI_KEYWORDS),
  };
};

export const detectPriority = (emailInput) => {
  const { urgentSignals, actionSignals, fyiSignals } = getPrioritySignals(emailInput);

  if (urgentSignals.length > 0) {
    return "Urgent";
  }

  if (actionSignals.length > 0) {
    return "Requires Action";
  }

  if (fyiSignals.length > 0) {
    return "FYI";
  }

  return "FYI";
};
