"use client";

import { useState, useRef, useEffect } from "react";
import { BriefRenderer } from "@/components/brief/BriefRenderer";
import { saveAudit } from "@/lib/saved-briefs";
import { decodeShare, buildShareUrl } from "@/lib/share";
import { cn } from "@/lib/utils";

const SESSION_KEY = "canopy_audit";

type Phase = "idle" | "loading" | "done" | "error";
type InputMode = "github" | "manual";

// ── Export helpers ────────────────────────────────────────────────────────────

function downloadText(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function markdownToPlainText(md: string): string {
  return md
    // H3 headings → uppercase with blank lines around
    .replace(/^### (.+)$/gm, (_, t) => `\n\n${t.toUpperCase()}\n`)
    // H4 sub-headings → uppercase with blank line before
    .replace(/^#### (.+)$/gm, (_, t) => `\n${t.toUpperCase()}\n`)
    // Bold and italic — strip markers, keep text
    .replace(/\*{1,2}([^*\n]+)\*{1,2}/g, "$1")
    // Fenced code blocks — keep content, drop fences
    .replace(/^```[^\n]*\n([\s\S]*?)^```$/gm, "$1")
    // Inline code — keep text
    .replace(/`([^`]+)`/g, "$1")
    // Table separator rows (|---|---|) — remove entirely
    .replace(/^\|[-| :]+\|$/gm, "")
    // Table data rows — join cells with spaces
    .replace(/^\|(.+)\|$/gm, (_, cells: string) =>
      cells
        .split("|")
        .map((c) => c.trim())
        .filter(Boolean)
        .join("   ")
    )
    // Horizontal rules → single blank line
    .replace(/^---+$/gm, "")
    // Collapse 3+ blank lines to 2
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function openEmail(content: string, repoName: string) {
  const subject = encodeURIComponent(`Canopy Tech Audit: ${repoName}`);
  const plain = markdownToPlainText(content);
  // Truncate at a paragraph boundary near 2 000 chars to stay under mailto limits
  let body = plain;
  if (plain.length > 2_000) {
    const cutoff = plain.lastIndexOf("\n\n", 2_000);
    body =
      plain.slice(0, cutoff > 1_200 ? cutoff : 2_000) +
      "\n\n────────────────────────────────────────\nView the full report at canopytech.app/audit";
  }
  window.location.href = `mailto:?subject=${subject}&body=${encodeURIComponent(body)}`;
}

// ── Section splitting ─────────────────────────────────────────────────────────

function splitSections(content: string): { title: string | null; text: string }[] {
  const parts: { title: string | null; text: string }[] = [];
  const lines = content.split("\n");
  let buffer: string[] = [];
  let currentTitle: string | null = null;

  for (const line of lines) {
    if (line.startsWith("#### ")) {
      if (buffer.length > 0) {
        parts.push({ title: currentTitle, text: buffer.join("\n").trim() });
        buffer = [];
      }
      currentTitle = line.replace(/^####\s+/, "").trim();
      buffer.push(line);
    } else {
      buffer.push(line);
    }
  }
  if (buffer.length > 0) {
    parts.push({ title: currentTitle, text: buffer.join("\n").trim() });
  }
  return parts.filter((p) => p.text);
}

function buildFixItPrompt(content: string, repoUrl: string): string {
  const parts = splitSections(content);
  const improvements = parts.find((p) =>
    p.title?.toUpperCase().includes("IMPROVEMENTS")
  );
  const improvementsText = improvements?.text ?? content;

  return `You are a senior software engineer. I ran a readiness audit on ${repoUrl} and got the following recommended improvements. Please implement them in priority order.

${improvementsText}

For each improvement:
1. Identify the specific files that need to change
2. Make the change with a minimal, focused diff
3. Briefly explain what you changed and why

Start with #1 and wait for my confirmation before moving to the next.

---
This prompt works with Claude Code, Cursor, Windsurf, GitHub Copilot, Lovable, Bolt, OpenAI Codex, or any AI coding assistant that can read and edit files.`;
}

// ── Components ────────────────────────────────────────────────────────────────

function CanopyLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 3C8.5 3 5 6 5 10c0 3 2 5.5 4.5 6.5V19h5v-2.5C17 15.5 19 13 19 10c0-4-3.5-7-7-7z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 19h5M10 22h4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-canopy",
        copied
          ? "border-amber-canopy text-amber-canopy bg-amber-canopy/10"
          : "border-forest-600 text-text-secondary hover:bg-forest-700 hover:text-text-primary"
      )}
    >
      {copied ? "Copied" : label}
    </button>
  );
}

function SaveButton({ content, repoUrl }: { content: string; repoUrl: string }) {
  const [saved, setSaved] = useState(false);
  return (
    <button
      onClick={() => {
        saveAudit(content, repoUrl);
        setSaved(true);
      }}
      disabled={saved}
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-canopy",
        saved
          ? "border-amber-canopy text-amber-canopy bg-amber-canopy/10 cursor-default"
          : "border-forest-600 text-text-secondary hover:bg-forest-700 hover:text-text-primary"
      )}
    >
      {saved ? "Saved" : "Save audit"}
    </button>
  );
}

function ExportMenu({ content, repoName }: { content: string; repoName: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const slug = repoName.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-canopy",
          "border-forest-600 text-text-secondary hover:bg-forest-700 hover:text-text-primary"
        )}
      >
        Export
        <svg
          viewBox="0 0 12 12"
          fill="none"
          className={cn("w-3 h-3 transition-transform", open && "rotate-180")}
          aria-hidden="true"
        >
          <path
            d="M2 4l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-9 z-30 w-52 rounded-xl bg-forest-800 border border-forest-600 shadow-xl overflow-hidden py-1"
        >
          {[
            {
              label: "Download as .txt",
              action: () => {
                downloadText(content, `audit-${slug}.txt`);
                setOpen(false);
              },
            },
            {
              label: "PDF (ink optimized)",
              action: () => {
                window.print();
                setOpen(false);
              },
            },
            {
              label: "Send via email",
              action: () => {
                openEmail(content, repoName);
                setOpen(false);
              },
            },
          ].map((item) => (
            <button
              key={item.label}
              role="menuitem"
              onClick={item.action}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-text-secondary hover:bg-forest-700 hover:text-text-primary transition-colors text-left"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ShareButton({ url, report }: { url: string; report: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        const payload = JSON.stringify({ u: url, c: report });
        const shareUrl = buildShareUrl("/audit", payload);
        await navigator.clipboard.writeText(shareUrl).catch(() => {});
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-canopy",
        copied
          ? "border-amber-canopy text-amber-canopy bg-amber-canopy/10"
          : "border-forest-600 text-text-secondary hover:bg-forest-700 hover:text-text-primary"
      )}
    >
      {copied ? "✓ Link copied" : "Share"}
    </button>
  );
}

// Per-section rendering with hover copy button
function SectionedReport({ content }: { content: string }) {
  const parts = splitSections(content);

  return (
    <div className="flex flex-col">
      {parts.map((part, i) => (
        <div
          key={i}
          className={cn(
            "relative group",
            i > 0 && part.title && "border-t border-forest-800 pt-1"
          )}
        >
          {part.title && (
            <div className="absolute top-3 right-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity print:hidden">
              <CopyButton text={part.text} label="Copy" />
            </div>
          )}
          <BriefRenderer content={part.text} />
        </div>
      ))}
    </div>
  );
}

// Expandable fix-it prompt card
function FixItPromptCard({ prompt }: { prompt: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-forest-700 bg-forest-900 overflow-hidden print:hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-forest-800 transition-colors"
      >
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold text-text-primary">
            Get fix-it prompt
          </span>
          <span className="text-xs text-text-muted">
            Ready-to-paste prompt for Claude, Cursor, or Windsurf
          </span>
        </div>
        <svg
          viewBox="0 0 16 16"
          fill="none"
          className={cn(
            "w-4 h-4 text-text-muted flex-shrink-0 transition-transform",
            open && "rotate-180"
          )}
          aria-hidden="true"
        >
          <path
            d="M4 6l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div className="border-t border-forest-700 px-5 pb-5 flex flex-col gap-3">
          <div className="flex items-center justify-between pt-3 flex-wrap gap-2">
            <p className="text-xs text-text-muted">
              Copy and paste into your code agent to implement all improvements.
            </p>
            <CopyButton text={prompt} label="Copy prompt" />
          </div>
          <pre className="bg-forest-950 border border-forest-700 rounded-xl px-4 py-3 text-xs text-text-secondary font-mono leading-relaxed whitespace-pre-wrap overflow-x-auto max-h-72 overflow-y-auto">
            {prompt}
          </pre>
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function AuditPage() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [inputMode, setInputMode] = useState<InputMode>("github");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [codeContext, setCodeContext] = useState("");
  const [report, setReport] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const isSubmitting = useRef(false);

  useEffect(() => {
    // Check for share link hash first (#s=BASE64)
    const hash = window.location.hash;
    if (hash.startsWith("#s=")) {
      try {
        const decoded = decodeShare(hash.slice(3));
        if (decoded) {
          const parsed = JSON.parse(decoded) as { u: string; c: string };
          history.replaceState(null, "", window.location.pathname);
          setUrl(parsed.u ?? "");
          setReport(parsed.c ?? "");
          setPhase("done");
          return;
        }
      } catch {
        // fall through to sessionStorage
      }
    }

    // Restore from sessionStorage (same-session navigation + landing "View" resume)
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { url: string; content: string };
        setUrl(parsed.url);
        setReport(parsed.content);
        setPhase("done");
      }
    } catch {
      // ignore corrupt session data
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isManual = inputMode === "manual";
    if (isSubmitting.current) return;
    if (isManual && !description.trim()) return;
    if (!isManual && !url.trim()) return;
    isSubmitting.current = true;
    setPhase("loading");
    setReport("");
    setErrorMsg("");

    try {
      const body = isManual
        ? { mode: "manual", description: description.trim(), codeContext: codeContext.trim() || undefined }
        : { mode: "github", repoUrl: url.trim() };

      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const text = await res.text();
        setErrorMsg(text || "Something went wrong. Please try again.");
        setPhase("error");
        return;
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          accumulated += decoder.decode(value, { stream: true });
          setReport(accumulated);
        }
      }

      const sessionUrl = isManual ? "" : url.trim();
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({ url: sessionUrl, content: accumulated }));
      setPhase("done");
    } catch {
      setErrorMsg("Network error — please check your connection and try again.");
      setPhase("error");
    } finally {
      isSubmitting.current = false;
    }
  };

  const handleReset = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setPhase("idle");
    setUrl("");
    setDescription("");
    setCodeContext("");
    setReport("");
    setErrorMsg("");
  };

  const repoName =
    url
      ? url.replace(/^https?:\/\/github\.com\//, "").split("/").slice(0, 2).join("/") || "repo"
      : description.slice(0, 40) || "manual-audit";

  const fixItPrompt =
    phase === "done" ? buildFixItPrompt(report, url) : "";

  return (
    <>
      <main className="min-h-screen bg-forest-950 flex flex-col print:bg-white">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-forest-700 print:hidden">
          <a href="/" className="flex items-center gap-2 group">
            <CanopyLogo className="w-6 h-6 text-amber-canopy" />
            <span className="text-sm font-semibold text-text-primary tracking-tight">
              Canopy Tech
            </span>
          </a>
          <span className="text-xs text-text-muted">Repo Audit</span>
        </header>

        <div className="flex-1 flex items-start justify-center px-4 py-8 sm:py-12">
          <div className="w-full max-w-2xl">

            {/* ── Idle: form ──────────────────────────────────────────────────── */}
            {phase === "idle" && (
              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-semibold text-amber-canopy uppercase tracking-widest">
                    Audit Existing Project
                  </p>
                  <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
                    Get a readiness report
                  </h1>
                </div>

                {/* Mode tabs */}
                <div className="flex gap-1 p-1 bg-forest-800 border border-forest-700 rounded-xl self-start">
                  {(["github", "manual"] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setInputMode(m)}
                      className={cn(
                        "px-4 py-1.5 rounded-lg text-sm font-medium transition-all",
                        inputMode === m
                          ? "bg-amber-canopy text-forest-950"
                          : "text-text-secondary hover:text-text-primary"
                      )}
                    >
                      {m === "github" ? "GitHub URL" : "Describe manually"}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  {inputMode === "github" ? (
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="repo-url" className="text-sm font-medium text-text-secondary">
                        GitHub repository URL
                      </label>
                      {/* text-[16px] prevents iOS zoom on focus */}
                      <input
                        id="repo-url"
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://github.com/owner/repo"
                        required
                        className="w-full px-4 py-3 rounded-xl bg-forest-800 border border-forest-600 text-text-primary placeholder:text-text-muted text-[16px] sm:text-sm focus:outline-none focus:border-amber-canopy/60 focus:ring-2 focus:ring-amber-canopy/20 transition-all"
                      />
                      <p className="text-xs text-text-muted">Works with any public GitHub repository</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="description" className="text-sm font-medium text-text-secondary">
                          Describe your project
                        </label>
                        <textarea
                          id="description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value.slice(0, 2000))}
                          placeholder="e.g. A React + Express SaaS app with PostgreSQL. We handle payments via Stripe and auth via JWT. Currently on a single DigitalOcean droplet."
                          required
                          rows={4}
                          className="w-full px-4 py-3 rounded-xl bg-forest-800 border border-forest-600 text-text-primary placeholder:text-text-muted text-[16px] sm:text-sm focus:outline-none focus:border-amber-canopy/60 focus:ring-2 focus:ring-amber-canopy/20 transition-all resize-none"
                        />
                        <p className="text-xs text-text-muted text-right">{description.length}/2000</p>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="code-context" className="text-sm font-medium text-text-secondary">
                          Paste relevant code or config{" "}
                          <span className="font-normal text-text-muted">(optional)</span>
                        </label>
                        <textarea
                          id="code-context"
                          value={codeContext}
                          onChange={(e) => setCodeContext(e.target.value.slice(0, 3000))}
                          placeholder="package.json, docker-compose.yml, schema, etc."
                          rows={5}
                          className="w-full px-4 py-3 rounded-xl bg-forest-800 border border-forest-600 text-text-primary placeholder:text-text-muted font-mono text-[16px] sm:text-sm focus:outline-none focus:border-amber-canopy/60 focus:ring-2 focus:ring-amber-canopy/20 transition-all resize-none"
                        />
                        <p className="text-xs text-text-muted text-right">{codeContext.length}/3000</p>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={inputMode === "github" ? !url.trim() : !description.trim()}
                    className="self-start flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-canopy text-forest-950 text-sm font-semibold transition-all hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-canopy"
                  >
                    {inputMode === "github" ? "Audit this repo" : "Audit this project"}
                    <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4" aria-hidden="true">
                      <path d="M4 8h8M8 4l4 4-4 4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </form>
              </div>
            )}

            {/* ── Loading: spinner + live preview ─────────────────────────────── */}
            {phase === "loading" && (
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-forest-600 border-t-amber-canopy animate-spin flex-shrink-0" />
                  <span className="text-sm text-text-secondary">
                    {report.length === 0 ? "Fetching repo…" : "Analyzing…"}
                  </span>
                </div>
                {report.length > 0 && (
                  <div className="opacity-70">
                    <BriefRenderer content={report} />
                  </div>
                )}
              </div>
            )}

            {/* ── Done: full report ────────────────────────────────────────────── */}
            {phase === "done" && (
              <div className="flex flex-col gap-6">
                {/* Action bar */}
                <div className="flex items-center justify-between flex-wrap gap-3 print:hidden">
                  <p className="text-xs font-semibold text-amber-canopy uppercase tracking-widest">
                    Audit complete
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <CopyButton text={report} label="Copy all" />
                    <SaveButton content={report} repoUrl={url} />
                    <ShareButton url={url} report={report} />
                    <ExportMenu content={report} repoName={repoName} />
                    <button
                      onClick={handleReset}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-canopy",
                        "border-forest-600 text-text-secondary hover:bg-forest-700 hover:text-text-primary"
                      )}
                    >
                      Audit another
                    </button>
                  </div>
                </div>

                {/* Print-only header */}
                <div className="hidden print:block mb-4">
                  <p className="text-lg font-bold text-black">
                    Canopy Tech — Audit Report
                  </p>
                  <p className="text-sm text-gray-500">
                    {repoName} · canopytech.app ·{" "}
                    {new Date().toLocaleDateString()}
                  </p>
                </div>

                {/* Sectioned report with per-section copy */}
                <div className="bg-forest-900 border border-forest-700 rounded-2xl p-5 sm:p-8 shadow-xl print:shadow-none print:border-gray-200 print:rounded-none audit-content">
                  <SectionedReport content={report} />
                </div>

                {/* Fix-it prompt */}
                <FixItPromptCard prompt={fixItPrompt} />
              </div>
            )}

            {/* ── Error ───────────────────────────────────────────────────────── */}
            {phase === "error" && (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2 p-4 rounded-xl bg-forest-800 border border-red-900/60">
                  <p className="text-sm font-semibold text-red-400">
                    Audit failed
                  </p>
                  <p className="text-sm text-text-secondary">{errorMsg}</p>
                </div>
                <button
                  onClick={handleReset}
                  className="self-start flex items-center gap-2 px-4 py-2 rounded-xl bg-forest-700 border border-forest-600 text-sm font-medium text-text-secondary hover:text-text-primary transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-canopy"
                >
                  Try again
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
