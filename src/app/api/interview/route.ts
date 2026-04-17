import Anthropic from "@anthropic-ai/sdk";
import { buildPrompt } from "@/lib/build-prompt";
import type { AnswerMap } from "@/types/interview";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { answers: AnswerMap };
    const { answers } = body;

    if (!answers || typeof answers !== "object") {
      return new Response("Invalid request body", { status: 400 });
    }

    const { systemPrompt, userMessage } = buildPrompt(answers);

    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

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
              controller.enqueue(
                new TextEncoder().encode(chunk.delta.text)
              );
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
        "Cache-Control": "no-cache",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err) {
    console.error("/api/interview error:", err);
    return new Response("Internal server error", { status: 500 });
  }
}
