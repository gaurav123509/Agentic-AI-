import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    dueDate: {
      type: Date,
      default: null,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false,
  }
);

const calendarEventSchema = new mongoose.Schema(
  {
    shouldCreate: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    start: {
      type: Date,
      default: null,
    },
    end: {
      type: Date,
      default: null,
    },
    timezone: {
      type: String,
      default: "UTC",
      trim: true,
    },
    location: {
      type: String,
      default: "",
      trim: true,
    },
    attendees: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["none", "suggested", "scheduled"],
      default: "none",
    },
  },
  {
    _id: false,
  }
);

const tokenUsageSchema = new mongoose.Schema(
  {
    inputTokens: {
      type: Number,
      default: 0,
    },
    outputTokens: {
      type: Number,
      default: 0,
    },
    totalTokens: {
      type: Number,
      default: 0,
    },
  },
  {
    _id: false,
  }
);

const executedActionSchema = new mongoose.Schema(
  {
    actionType: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      trim: true,
    },
    payload: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    executedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
  }
);

const emailSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      default: "",
      trim: true,
    },
    body: {
      type: String,
      required: true,
      trim: true,
    },
    summary: {
      type: [String],
      default: [],
    },
    priority: {
      type: String,
      enum: ["Urgent", "Requires Action", "FYI"],
      required: true,
    },
    prioritySignals: {
      type: [String],
      default: [],
    },
    draftReply: {
      type: String,
      default: "",
      trim: true,
    },
    calendarEvent: {
      type: calendarEventSchema,
      default: () => ({}),
    },
    taskList: {
      type: [taskSchema],
      default: [],
    },
    analysisProvider: {
      type: String,
      enum: ["openai", "fallback"],
      default: "fallback",
    },
    aiModel: {
      type: String,
      default: "",
      trim: true,
    },
    openaiResponseId: {
      type: String,
      default: "",
      trim: true,
    },
    tokenUsage: {
      type: tokenUsageSchema,
      default: () => ({}),
    },
    executedActions: {
      type: [executedActionSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

emailSchema.index({ createdAt: -1 });
emailSchema.index({ priority: 1, createdAt: -1 });

const Email = mongoose.model("Email", emailSchema);

export default Email;
