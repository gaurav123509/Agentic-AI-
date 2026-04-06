import OpenAI from "openai";

import { env, hasOpenAIKey } from "../config/env.js";
import {
  normalizeEmailAnalysis,
  parseStructuredOutput,
} from "../utils/analysisNormalizer.js";
import { buildAnalysisPrompt } from "../utils/promptBuilder.js";
import { buildFallbackEmailArtifacts } from "./action.service.js";

const openaiClient = hasOpenAIKey
  ? new OpenAI({
      apiKey: env.openAiApiKey,
    })
  : null;

const buildUsage = (usage = {}) => ({
  inputTokens: usage.input_tokens ?? 0,
  outputTokens: usage.output_tokens ?? 0,
  totalTokens: usage.total_tokens ?? 0,
});

export const analyzeEmailWithAI = async ({ subject, body, priority }) => {
  const fallbackArtifacts = buildFallbackEmailArtifacts({ subject, body, priority });

  if (!openaiClient) {
    return {
      ...fallbackArtifacts,
      analysisProvider: "fallback",
      aiModel: "",
      openaiResponseId: "",
      tokenUsage: buildUsage(),
    };
  }

  try {
    const response = await openaiClient.responses.create({
      model: env.openAiModel,
      reasoning: {
        effort: env.openAiReasoningEffort,
      },
      temperature: 0.2,
      max_output_tokens: 900,
      store: false,
      instructions:
        "You are MailPilot AI, a production-grade email triage assistant. Return only valid JSON and do not wrap it in markdown fences.",
      input: buildAnalysisPrompt({ subject, body, priority }),
    });

    const parsedAnalysis = parseStructuredOutput(response.output_text);
    const normalizedAnalysis = normalizeEmailAnalysis(parsedAnalysis, {
      subject,
      body,
      priority,
    });

    return {
      ...normalizedAnalysis,
      analysisProvider: "openai",
      aiModel: response.model ?? env.openAiModel,
      openaiResponseId: response.id ?? "",
      tokenUsage: buildUsage(response.usage),
    };
  } catch (error) {
    console.error("OpenAI analysis failed, switching to fallback:", error.message);

    return {
      ...fallbackArtifacts,
      analysisProvider: "fallback",
      aiModel: "",
      openaiResponseId: "",
      tokenUsage: buildUsage(),
    };
  }
};
