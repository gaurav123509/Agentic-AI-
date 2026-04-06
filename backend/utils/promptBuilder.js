export const buildAnalysisPrompt = ({ subject = "", body = "", priority = "FYI" }) => `
Analyze the following email for the MailPilot AI backend.

Email subject:
${subject || "(no subject)"}

Email body:
${body}

The rule-based priority already determined this label:
${priority}

Return only valid JSON with this exact shape:
{
  "summary": ["string", "string"],
  "draftReply": "string",
  "calendarEvent": {
    "shouldCreate": false,
    "title": "",
    "description": "",
    "start": null,
    "end": null,
    "timezone": "UTC",
    "location": "",
    "attendees": [],
    "status": "none"
  },
  "taskList": [
    {
      "title": "string",
      "dueDate": null,
      "completed": false
    }
  ]
}

Rules:
- summary must be an array of 2 to 4 concise bullet strings
- draftReply must be polite, professional, and ready to send
- keep the response grounded in the email content
- if no calendar event is clearly implied, set shouldCreate to false and status to "none"
- if meeting details are unclear, keep start and end as null
- taskList must contain actionable items only
- completed must always be false for every task
`.trim();
