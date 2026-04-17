import type { AnswerMap, AnswerValue } from "@/types/interview";

const FREE_TEXT_MAX = 1_000;   // chars per free-text answer
const OPTION_ID_MAX = 64;       // max length of an option ID string
const MAX_QUESTIONS = 20;       // slightly over 18 to be lenient

/**
 * Sanitize and validate the AnswerMap coming from the client before it
 * reaches the AI. Returns a cleaned copy or throws with a descriptive message.
 *
 * Defends against:
 * - Oversized payloads (A03 injection vector)
 * - Unexpected field types
 * - Basic prompt injection via free-text fields (length + control char stripping)
 */
export function sanitizeAnswers(raw: unknown): AnswerMap {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    throw new Error("Invalid answers payload");
  }

  const input = raw as Record<string, unknown>;
  const entries = Object.entries(input);

  if (entries.length > MAX_QUESTIONS) {
    throw new Error("Too many answers");
  }

  const sanitized: AnswerMap = {};

  for (const [key, value] of entries) {
    const id = parseInt(key, 10);
    if (!Number.isInteger(id) || id < 1 || id > MAX_QUESTIONS) continue;

    sanitized[id as keyof AnswerMap] = sanitizeAnswer(value);
  }

  return sanitized;
}

function sanitizeAnswer(value: unknown): AnswerValue {
  if (typeof value === "string") {
    return cleanString(value, FREE_TEXT_MAX);
  }
  if (Array.isArray(value)) {
    return value
      .filter((v): v is string => typeof v === "string")
      .slice(0, 10)
      .map((v) => cleanString(v, OPTION_ID_MAX));
  }
  throw new Error("Invalid answer type");
}

function cleanString(s: string, maxLen: number): string {
  return s
    .slice(0, maxLen)
    // Strip ASCII control characters (potential injection vectors)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    .trim();
}
