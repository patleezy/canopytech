"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { QuickResult } from "@/types/quick";
import { saveQuickStack } from "@/lib/saved-briefs";
import { cn } from "@/lib/utils";

const CARD_ACCENT: Record<string, string> = {
  FRONTEND:   "border-l-amber-400",
  BACKEND:    "border-l-emerald-400",
  DATABASE:   "border-l-blue-400",
  AUTH:       "border-l-violet-400",
  STYLING:    "border-l-pink-400",
  DEPLOYMENT: "border-l-cyan-400",
};

type Phase = "idle" | "loading" | "done";

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatQuickResult(description: string, result: QuickResult): string {
  const date = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const lines = [
    "CANOPY TECH — QUICK STACK",
    `Building: ${description}`,
    `Generated: ${date}`,
    "",
    ...result.cards.flatMap((c) => [
      c.category,
      `  Recommendation: ${c.recommendation}`,
      `  Rationale: ${c.rationale}`,
      "",
    ]),
    result.disclaimer ?? "",
    "",
    "For compliance flags, cost estimates, and enterprise readiness:",
    "canopytech.app/interview",
  ];
  return lines.join("\n").trim();
}

function downloadText(text: string, filename: string) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function openEmail(text: string) {
  const subject = encodeURIComponent("My Canopy Tech Quick Stack");
  const body = encodeURIComponent(
    text.length > 1_800
      ? text.slice(0, 1_800) + "\n\n[Truncated — full version at canopytech.app/quick]"
      : text
  );
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
}

// ── CopyButton ────────────────────────────────────────────────────────────────

function CopyButton({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(content).catch(() => {});
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
      {copied ? "✓ Copied" : "Copy"}
    </button>
  );
}

// ── ExportMenu ────────────────────────────────────────────────────────────────

function ExportMenu({ content, slug }: { content: string; slug: string }) {
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

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-canopy",
          open
            ? "border-amber-canopy/60 text-text-primary bg-forest-700"
            : "border-forest-600 text-text-secondary hover:bg-forest-700 hover:text-text-primary"
        )}
      >
        Export
        <svg viewBox="0 0 10 6" fill="none" className="w-2.5 h-2.5" aria-hidden="true">
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 z-20 flex flex-col bg-forest-800 border border-forest-600 rounded-xl shadow-xl overflow-hidden w-44">
          {[
            {
              label: "Download .txt",
              action: () => { downloadText(content, `canopy-stack-${slug}.txt`); setOpen(false); },
            },
            {
              label: "Export PDF",
              action: () => { window.print(); setOpen(false); },
            },
            {
              label: "Send via email",
              action: () => { openEmail(content); setOpen(false); },
            },
          ].map(({ label, action }) => (
            <button
              key={label}
              onClick={action}
              className="flex items-center gap-2 px-4 py-2.5 text-xs text-text-secondary hover:bg-forest-700 hover:text-text-primary transition-colors text-left"
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── SaveButton ────────────────────────────────────────────────────────────────

function SaveButton({ description, content }: { description: string; content: string }) {
  const [saved, setSaved] = useState(false);
  return (
    <button
      onClick={() => {
        saveQuickStack(description, content);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }}
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-canopy",
        saved
          ? "border-amber-canopy text-amber-canopy bg-amber-canopy/10"
          : "border-forest-600 text-text-secondary hover:bg-forest-700 hover:text-text-primary"
      )}
    >
      {saved ? "✓ Saved" : "Save"}
    </button>
  );
}

// ── QuickShell ────────────────────────────────────────────────────────────────

export function QuickShell() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [description, setDescription] = useState("");
  const [result, setResult] = useState<QuickResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const trimmed = description.trim();
  const tooShort = trimmed.length > 0 && trimmed.length < 10;
  const canSubmit = trimmed.length >= 10 && phase === "idle";

  async function runFetch(desc: string) {
    setPhase("loading");
    setError(null);

    try {
      const res = await fetch("/api/quick", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: desc }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(body.error ?? `Error ${res.status}`);
      }

      const data: QuickResult = await res.json();
      setResult(data);
      setPhase("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setPhase("idle");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    await runFetch(trimmed);
  }

  async function handleRegenerate() {
    await runFetch(trimmed);
  }

  function reset() {
    setPhase("idle");
    setResult(null);
    setError(null);
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <AnimatePresence mode="wait">
        {phase === "idle" && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="flex flex-col gap-8 max-w-xl"
          >
            <div className="flex flex-col gap-3">
              <h1 className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight">
                What are we building?
              </h1>
              <p className="text-sm text-text-muted leading-relaxed">
                Describe your app in a sentence or two and get an instant stack recommendation.
                For compliance flags, cost estimates, and enterprise readiness,{" "}
                <a
                  href="/interview"
                  className="text-amber-canopy hover:text-amber-canopy-light transition-colors underline underline-offset-2"
                >
                  take the full consultation
                </a>
                .
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <textarea
                autoFocus
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. A personal finance tracker that helps me log expenses and visualize spending by category"
                className="w-full min-h-[120px] bg-forest-800 border border-forest-600 rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted text-sm leading-relaxed resize-none focus:outline-none focus:border-amber-canopy/60 transition-all"
                maxLength={1000}
              />

              {error && <p className="text-sm text-red-400">{error}</p>}

              <div className="flex items-center justify-between gap-4">
                <span className="text-xs text-text-muted">
                  {tooShort
                    ? "Add a bit more detail"
                    : trimmed.length > 0
                    ? `${trimmed.length}/1000`
                    : ""}
                </span>
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-amber-canopy text-forest-950 hover:bg-amber-canopy-light transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_2px_16px_rgba(217,119,6,0.3)]"
                >
                  Get stack recommendation
                  <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5" aria-hidden="true">
                    <path
                      d="M4 8h8M8 4l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {phase === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex flex-col items-center justify-center gap-4 py-24"
          >
            <div className="flex items-center gap-1.5">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="w-2 h-2 rounded-full bg-amber-canopy"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
            <p className="text-sm text-text-muted">Recommending your stack...</p>
          </motion.div>
        )}

        {phase === "done" && result && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex flex-col gap-8 quick-result"
          >
            {trimmed && (
              <div className="flex flex-col gap-1">
                <p className="text-xs text-text-muted uppercase tracking-wider">
                  You&apos;re building
                </p>
                <p className="text-text-secondary text-sm leading-relaxed">{trimmed}</p>
              </div>
            )}

            <div>
              {/* Label + action bar */}
              <div className="flex items-center justify-between gap-4 mb-4">
                <p className="text-xs font-semibold text-amber-canopy uppercase tracking-wider">
                  AI-Recommended Stack
                </p>
                {(() => {
                  const formatted = formatQuickResult(trimmed, result);
                  const slug = trimmed.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").slice(0, 40);
                  return (
                    <div className="flex items-center gap-2 print:hidden flex-wrap">
                      <CopyButton content={formatted} />
                      <ExportMenu content={formatted} slug={slug} />
                      <SaveButton description={trimmed} content={formatted} />
                      <button
                        onClick={handleRegenerate}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-forest-600 text-text-secondary hover:bg-forest-700 hover:text-text-primary transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-canopy"
                      >
                        <svg viewBox="0 0 14 14" fill="none" className="w-3 h-3" aria-hidden="true">
                          <path d="M1 7a6 6 0 1 0 1.5-3.9M1 3v4h4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Regenerate
                      </button>
                    </div>
                  );
                })()}
              </div>

              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
                initial="hidden"
                animate="show"
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
              >
                {result.cards.map((card) => (
                  <motion.div
                    key={card.category}
                    variants={{
                      hidden: { opacity: 0, y: 12 },
                      show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
                    }}
                    className={`flex flex-col gap-2 p-4 rounded-xl bg-forest-900 border border-forest-700 border-l-2 ${CARD_ACCENT[card.category] ?? "border-l-forest-500"}`}
                  >
                    <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                      {card.category}
                    </span>
                    <span className="text-sm font-semibold text-text-primary leading-snug">
                      {card.recommendation}
                    </span>
                    <span className="text-xs text-text-secondary leading-relaxed">
                      {card.rationale}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {result.disclaimer && (
              <p className="text-xs text-text-muted leading-relaxed">{result.disclaimer}</p>
            )}

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-forest-800 border border-forest-700 rounded-xl">
              <div>
                <p className="text-sm font-medium text-text-primary">
                  Need a more tailored recommendation?
                </p>
                <p className="text-xs text-text-muted mt-0.5">
                  The full consultation covers compliance flags, cost estimates, and enterprise
                  readiness.
                </p>
              </div>
              <a
                href="/interview"
                className="flex-shrink-0 px-4 py-2 rounded-lg text-sm font-semibold bg-amber-canopy text-forest-950 hover:bg-amber-canopy-light transition-all"
              >
                Full consultation
              </a>
            </div>

            <button
              onClick={reset}
              className="text-xs text-text-muted hover:text-text-secondary transition-colors self-start"
            >
              ← Try a different description
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
