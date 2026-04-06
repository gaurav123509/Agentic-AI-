import {
  analyzeAndStoreEmail,
  executeEmailActionById,
  fetchEmailHistory,
} from "../services/email.service.js";

export const analyzeEmail = async (req, res, next) => {
  try {
    const subject =
      typeof req.body.subject === "string" ? req.body.subject : String(req.body.subject ?? "");
    const body = typeof req.body.body === "string" ? req.body.body : "";

    if (!body.trim()) {
      return res.status(400).json({
        success: false,
        message: "body is required",
      });
    }

    const analyzedEmail = await analyzeAndStoreEmail({
      subject,
      body,
    });

    return res.status(201).json({
      id: analyzedEmail.id,
      summary: analyzedEmail.summary,
      priority: analyzedEmail.priority,
      draftReply: analyzedEmail.draftReply,
      calendarEvent: analyzedEmail.calendarEvent,
      taskList: analyzedEmail.taskList,
    });
  } catch (error) {
    next(error);
  }
};

export const executeAction = async (req, res, next) => {
  try {
    const emailId = req.params.id || req.body.emailId;
    const actionType =
      typeof req.body.actionType === "string" ? req.body.actionType.trim() : "";
    const payload =
      req.body.payload && typeof req.body.payload === "object" ? req.body.payload : {};

    if (!emailId) {
      return res.status(400).json({
        success: false,
        message: "emailId is required",
      });
    }

    if (!actionType) {
      return res.status(400).json({
        success: false,
        message: "actionType is required",
      });
    }

    const result = await executeEmailActionById({
      emailId,
      actionType,
      payload,
    });

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export const getEmailHistory = async (req, res, next) => {
  try {
    const history = await fetchEmailHistory(req.query);

    return res.status(200).json({
      success: true,
      ...history,
    });
  } catch (error) {
    next(error);
  }
};
