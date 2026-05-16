"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { QuickResult } from "@/types/quick";

const CARD_ACCENT: Record<string, string> = {
  FRONTEND:   "border-l-amber-400",
  BACKEND:    "border-l-emerald-400",
  DATABASE:   "border-l-blue-400",
  AUTH:       "border-l-violet-400",
  STYLING:    "border-l-pink-400",
  DEPLOYMENT: "border-l-cyan-400",
};

export default function QuickResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<QuickResult | null>(null);
  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    const stored = sessionStorage.getItem("canopy_quick_result");
    const desc = sessionStorage.getItem("canopy_quick_description");
    if (!stored) {
      router.replace("/quick");
      return;
    }
    setResult(JSON.parse(stored) as QuickResult);
    if (desc) setDescription(desc);
  }, [router]);

  if (!result) {
    return (
      <div className="min-h-screen bg-forest-950 flex items-center justify-center">
        <div className="w-5 h-5 rounded-full border-2 border-forest-600 border-t-amber-canopy animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-forest-950 flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 border-b border-forest-700">
        <a href="/" className="flex items-center gap-2">
          <CanopyLogo className="w-6 h-6 text-amber-canopy" />
          <span className="text-sm font-semibold text-text-primary tracking-tight">
            Canopy Tech
          </span>
        </a>
        <span className="text-xs text-text-muted">Quick Stack</span>
      </header>

      <div className="flex-1 flex justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-3xl flex flex-col gap-8">
          {description && (
            <div className="flex flex-col gap-1">
              <p className="text-xs text-text-muted uppercase tracking-wider">You&apos;re building</p>
              <p className="text-text-secondary text-sm leading-relaxed">{description}</p>
            </div>
          )}

          <div>
            <p className="text-xs font-semibold text-amber-canopy uppercase tracking-wider mb-4">
              AI-Recommended Stack
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {result.cards.map((card) => (
                <div
                  key={card.category}
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
                </div>
              ))}
            </div>
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
                The full consultation covers compliance flags, cost estimates, and enterprise readiness.
              </p>
            </div>
            <a
              href="/interview"
              className="flex-shrink-0 px-4 py-2 rounded-lg text-sm font-semibold bg-amber-canopy text-forest-950 hover:bg-amber-canopy-light transition-all"
            >
              Full consultation
            </a>
          </div>

          <a
            href="/quick"
            className="text-xs text-text-muted hover:text-text-secondary transition-colors self-start"
          >
            ← Try a different description
          </a>
        </div>
      </div>
    </main>
  );
}

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
      <path d="M9.5 19h5M10 22h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
