import Anthropic from "@anthropic-ai/sdk";
import { checkRateLimit } from "@/lib/rate-limit";
import type { QuickResult } from "@/types/quick";

export const runtime = "nodejs";
export const maxDuration = 30;

const MAX_BODY_BYTES = 2_000;

function getClientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

const SYSTEM_PROMPT = `You are a concise tech stack advisor. Given a brief app description, recommend a modern tech stack.

Return ONLY a valid JSON object with this exact shape — no markdown, no code fences, no preamble:

{
  "cards": [
    { "category": "FRONTEND", "recommendation": "...", "rationale": "..." },
    { "category": "BACKEND", "recommendation": "...", "rationale": "..." },
    { "category": "DATABASE", "recommendation": "...", "rationale": "..." },
    { "category": "AUTH", "recommendation": "...", "rationale": "..." },
    { "category": "STYLING", "recommendation": "...", "rationale": "..." },
    { "category": "DEPLOYMENT", "recommendation": "...", "rationale": "..." }
  ],
  "disclaimer": "..."
}

Rules:
- recommendation: the specific tool or library name, under 8 words
- rationale: one plain-English sentence explaining why, under 20 words
- disclaimer: one sentence noting this is a quick estimate and the full consultation covers compliance, cost, and enterprise readiness
- Be opinionated — pick one thing, not a list
- Never recommend a paid tier when a free tier fits the stated scope`;

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const { allowed, remaining, resetAt } = await checkRateLimit(
    `quick:${ip}`,
    10,
    60_000
  );

  if (!allowed) {
    return Response.json(
      { error: "Too many requests — please wait a moment." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((resetAt - Date.now()) / 1000)),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  const contentLength = req.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > MAX_BODY_BYTES) {
    return Response.json({ error: "Payload too large" }, { status: 413 });
  }

  let rawBody: string;
  try {
    rawBody = await req.text();
  } catch {
    return Response.json({ error: "Could not read request body" }, { status: 400 });
  }

  if (rawBody.length > MAX_BODY_BYTES) {
    return Response.json({ error: "Payload too large" }, { status: 413 });
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawBody);
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const description = (parsed as { description?: unknown })?.description;
  if (typeof description !== "string" || description.trim().length === 0) {
    return Response.json({ error: "Missing description" }, { status: 400 });
  }

  const sanitized = description.trim().slice(0, 1_000);

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1_024,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: `Build me: ${sanitized}` }],
    });

    const text =
      message.content[0]?.type === "text" ? message.content[0].text : "";

    let result: QuickResult;
    try {
      result = JSON.parse(text) as QuickResult;
    } catch {
      return Response.json(
        { error: "Failed to parse AI response" },
        { status: 500 }
      );
    }

    return Response.json(result, {
      headers: {
        "Cache-Control": "no-store",
        "X-RateLimit-Remaining": String(remaining),
      },
    });
  } catch (err) {
    console.error("/api/quick error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
