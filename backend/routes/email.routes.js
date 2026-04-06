import { Router } from "express";

import {
  analyzeEmail,
  executeAction,
  getEmailHistory,
} from "../controllers/email.controller.js";

const router = Router();

router.post("/analyze", analyzeEmail);
router.post("/execute-action", executeAction);
router.post("/:id/actions", executeAction);
router.get("/history", getEmailHistory);

export default router;
