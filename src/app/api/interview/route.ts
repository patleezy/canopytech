import Anthropic from "@anthropic-ai/sdk";
import { buildPrompt } from "@/lib/build-prompt";
import { sanitizeAnswers } from "@/lib/sanitize";
import { checkRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 60;

// Maximum raw request body size (50 KB is generous for 18 answers)
const MAX_BODY_BYTES = 50_000;

function getClientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

export async function POST(req: Request) {
  // ── Rate limiting ────────────────────────────────────────────────────────────
  const ip = getClientIp(req);
  const { allowed, remaining, resetAt } = await checkRateLimit(ip, 10, 60_000);

  if (!allowed) {
    return new Response("Too many requests — please wait a moment.", {
      status: 429,
      headers: {
        "Retry-After": String(Math.ceil((resetAt - Date.now()) / 1000)),
        "X-RateLimit-Remaining": "0",
      },
    });
  }

  // ── Payload size guard ───────────────────────────────────────────────────────
  const contentLength = req.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > MAX_BODY_BYTES) {
    return new Response("Payload too large", { status: 413 });
  }

  // ── Parse + validate body ────────────────────────────────────────────────────
  let rawBody: string;
  try {
    rawBody = await req.text();
  } catch {
    return new Response("Could not read request body", { status: 400 });
  }

  if (rawBody.length > MAX_BODY_BYTES) {
    return new Response("Payload too large", { status: 413 });
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawBody);
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  if (
    !parsed ||
    typeof parsed !== "object" ||
    !("answers" in (parsed as object))
  ) {
    return new Response("Missing answers field", { status: 400 });
  }

  // ── Sanitize answers ─────────────────────────────────────────────────────────
  let answers;
  try {
    answers = sanitizeAnswers((parsed as { answers: unknown }).answers);
  } catch (err) {
    return new Response(
      err instanceof Error ? err.message : "Invalid answers",
      { status: 400 }
    );
  }

  // ── Call Claude ──────────────────────────────────────────────────────────────
  try {
    const { systemPrompt, userMessage } = buildPrompt(answers);

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const stream = client.messages.stream({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    });

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (
              chunk.type === "content_block_delta" &&
              chunk.delta.type === "text_delta"
            ) {
              controller.enqueue(new TextEncoder().encode(chunk.delta.text));
            }
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
        "X-RateLimit-Remaining": String(remaining),
      },
    });
  } catch (err) {
    console.error("/api/interview error:", err);
    return new Response("Internal server error", { status: 500 });
  }
}
