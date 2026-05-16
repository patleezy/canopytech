"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { QuickResult } from "@/types/quick";

const CARD_ACCENT: Record<string, string> = {
  FRONTEND:   "border-l-amber-400",
  BACKEND:    "border-l-emerald-400",
  DATABASE:   "border-l-blue-400",
  AUTH:       "border-l-violet-400",
  STYLING:    "border-l-pink-400",
  DEPLOYMENT: "border-l-cyan-400",
};

type Phase = "idle" | "loading" | "done";

export function QuickShell() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [description, setDescription] = useState("");
  const [result, setResult] = useState<QuickResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const trimmed = description.trim();
  const tooShort = trimmed.length > 0 && trimmed.length < 10;
  const canSubmit = trimmed.length >= 10 && phase === "idle";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setPhase("loading");
    setError(null);

    try {
      const res = await fetch("/api/quick", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: trimmed }),
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
            className="flex flex-col gap-8"
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
              <p className="text-xs font-semibold text-amber-canopy uppercase tracking-wider mb-4">
                AI-Recommended Stack
              </p>
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
                    <span className="text-xs text-text-secondary leading-relaxed line-clamp-2">
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
