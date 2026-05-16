"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { QuickResult } from "@/types/quick";

export function QuickForm() {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const trimmed = description.trim();
  const tooShort = trimmed.length > 0 && trimmed.length < 10;
  const canSubmit = trimmed.length >= 10 && !loading;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
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

      const result: QuickResult = await res.json();
      sessionStorage.setItem("canopy_quick_result", JSON.stringify(result));
      sessionStorage.setItem("canopy_quick_description", trimmed);
      router.push("/quick/results");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <textarea
        autoFocus
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="e.g. A personal finance tracker that helps me log expenses and visualize spending by category"
        className="w-full min-h-[120px] bg-forest-800 border border-forest-600 rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted text-sm leading-relaxed resize-none focus:outline-none focus:border-amber-canopy/60 transition-all"
        disabled={loading}
        maxLength={1000}
      />

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex items-center justify-between gap-4">
        <span className="text-xs text-text-muted">
          {tooShort ? "Add a bit more detail" : trimmed.length > 0 ? `${trimmed.length}/1000` : ""}
        </span>
        <button
          type="submit"
          disabled={!canSubmit}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-amber-canopy text-forest-950 hover:bg-amber-canopy-light transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_2px_16px_rgba(217,119,6,0.3)]"
        >
          {loading ? (
            <>
              <span className="w-3.5 h-3.5 rounded-full border-2 border-forest-950/30 border-t-forest-950 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              Get stack recommendation
              <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5" aria-hidden="true">
                <path d="M4 8h8M8 4l4 4-4 4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
