import Anthropic from "@anthropic-ai/sdk";
import { buildAuditPrompt, type RepoMeta } from "@/lib/build-audit-prompt";
import { checkRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_BODY_BYTES = 10_000;

function getClientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== "github.com") return null;
    const parts = parsed.pathname.replace(/\.git$/, "").split("/").filter(Boolean);
    if (parts.length < 2) return null;
    return { owner: parts[0], repo: parts[1] };
  } catch {
    return null;
  }
}

async function fetchGitHubJson(url: string): Promise<unknown> {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "canopytech",
      Accept: "application/vnd.github+json",
    },
  });
  if (!res.ok) return null;
  return res.json();
}

async function fetchRepoMeta(owner: string, repo: string): Promise<RepoMeta> {
  const [repoData, readmeData, pkgData] = await Promise.allSettled([
    fetchGitHubJson(`https://api.github.com/repos/${owner}/${repo}`),
    fetchGitHubJson(`https://api.github.com/repos/${owner}/${repo}/contents/README.md`),
    fetchGitHubJson(`https://api.github.com/repos/${owner}/${repo}/contents/package.json`),
  ]);

  const r = repoData.status === "fulfilled" && repoData.value
    ? (repoData.value as Record<string, unknown>)
    : null;

  let readme: string | null = null;
  if (readmeData.status === "fulfilled" && readmeData.value) {
    const rd = readmeData.value as Record<string, unknown>;
    if (typeof rd.content === "string") {
      try {
        readme = Buffer.from(rd.content.replace(/\n/g, ""), "base64").toString("utf-8");
      } catch {
        // ignore decode errors
      }
    }
  }

  let dependencies: Record<string, string> | null = null;
  let devDependencies: Record<string, string> | null = null;
  if (pkgData.status === "fulfilled" && pkgData.value) {
    const pd = pkgData.value as Record<string, unknown>;
    if (typeof pd.content === "string") {
      try {
        const pkg = JSON.parse(
          Buffer.from(pd.content.replace(/\n/g, ""), "base64").toString("utf-8")
        ) as Record<string, unknown>;
        if (pkg.dependencies && typeof pkg.dependencies === "object") {
          dependencies = pkg.dependencies as Record<string, string>;
        }
        if (pkg.devDependencies && typeof pkg.devDependencies === "object") {
          devDependencies = pkg.devDependencies as Record<string, string>;
        }
      } catch {
        // ignore parse errors
      }
    }
  }

  return {
    name: typeof r?.name === "string" ? r.name : repo,
    fullName: typeof r?.full_name === "string" ? r.full_name : `${owner}/${repo}`,
    description: typeof r?.description === "string" ? r.description : null,
    language: typeof r?.language === "string" ? r.language : null,
    stars: typeof r?.stargazers_count === "number" ? r.stargazers_count : 0,
    topics: Array.isArray(r?.topics) ? (r.topics as string[]) : [],
    readme,
    dependencies,
    devDependencies,
  };
}

export async function POST(req: Request) {
  // ── Rate limiting ────────────────────────────────────────────────────────────
  const ip = getClientIp(req);
  const { allowed, remaining, resetAt } = checkRateLimit(`audit:${ip}`, 5, 60_000);

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

  // ── Parse body ───────────────────────────────────────────────────────────────
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

  if (!parsed || typeof parsed !== "object" || !("repoUrl" in (parsed as object))) {
    return new Response("Missing repoUrl field", { status: 400 });
  }

  const repoUrl = (parsed as { repoUrl: unknown }).repoUrl;
  if (typeof repoUrl !== "string" || repoUrl.length > 500) {
    return new Response("Invalid repoUrl", { status: 400 });
  }

  const parsed_url = parseGitHubUrl(repoUrl.trim());
  if (!parsed_url) {
    return new Response(
      "Only public GitHub URLs are supported (e.g. https://github.com/owner/repo)",
      { status: 400 }
    );
  }

  const { owner, repo } = parsed_url;

  // ── Fetch repo metadata ──────────────────────────────────────────────────────
  let meta: RepoMeta;
  try {
    meta = await fetchRepoMeta(owner, repo);
  } catch (err) {
    console.error("/api/audit GitHub fetch error:", err);
    meta = {
      name: repo,
      fullName: `${owner}/${repo}`,
      description: null,
      language: null,
      stars: 0,
      topics: [],
      readme: null,
      dependencies: null,
      devDependencies: null,
    };
  }

  // ── Call Claude ──────────────────────────────────────────────────────────────
  try {
    const { systemPrompt, userMessage } = buildAuditPrompt(meta);

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
    console.error("/api/audit error:", err);
    return new Response("Internal server error", { status: 500 });
  }
}
