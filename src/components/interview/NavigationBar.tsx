"use client";

import { cn } from "@/lib/utils";

interface NavigationBarProps {
  onPrev: () => void;
  onNext: () => void;
  canAdvance: boolean;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
}

export function NavigationBar({
  onPrev,
  onNext,
  canAdvance,
  isFirstQuestion,
  isLastQuestion,
}: NavigationBarProps) {
  return (
    <div className="flex items-center justify-between pt-2">
      <button
        onClick={onPrev}
        disabled={isFirstQuestion}
        aria-label="Previous question"
        className={cn(
          "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium",
          "border border-forest-600 transition-all duration-150",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-canopy",
          isFirstQuestion
            ? "opacity-0 pointer-events-none"
            : "text-text-secondary hover:text-text-primary hover:bg-forest-700 hover:border-forest-500"
        )}
      >
        <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5" aria-hidden="true">
          <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back
      </button>

      <button
        onClick={onNext}
        disabled={!canAdvance}
        aria-label={isLastQuestion ? "Generate my project brief" : "Next question"}
        className={cn(
          "flex items-center gap-1.5 px-5 py-2 rounded-lg text-sm font-semibold",
          "transition-all duration-150",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-canopy focus-visible:ring-offset-2 focus-visible:ring-offset-forest-950",
          canAdvance
            ? "bg-amber-canopy text-forest-950 hover:bg-amber-canopy-light shadow-[0_1px_8px_rgba(217,119,6,0.35)]"
            : "bg-forest-700 text-text-muted cursor-not-allowed border border-forest-600"
        )}
      >
        {isLastQuestion ? "Generate Brief" : "Continue"}
        {!isLastQuestion && (
          <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5" aria-hidden="true">
            <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        {isLastQuestion && (
          <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5" aria-hidden="true">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
    </div>
  );
}
