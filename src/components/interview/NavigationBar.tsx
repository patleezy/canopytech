"use client";

import { cn } from "@/lib/utils";
import { LAYERS, TOTAL_LAYERS } from "@/lib/interview-data";

interface NavigationBarProps {
  onPrev: () => void;
  onNext: () => void;
  layerComplete: boolean;
  isFirstLayer: boolean;
  isLastLayer: boolean;
  currentLayer: number;
}

export function NavigationBar({
  onPrev,
  onNext,
  layerComplete,
  isFirstLayer,
  isLastLayer,
  currentLayer,
}: NavigationBarProps) {
  const nextLayerName =
    !isLastLayer ? LAYERS[currentLayer + 1]?.name : null;

  return (
    <div className="flex items-center justify-between pt-4 border-t border-forest-700">
      <button
        onClick={onPrev}
        disabled={isFirstLayer}
        aria-label="Previous section"
        className={cn(
          "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150",
          "border border-forest-600",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-canopy",
          isFirstLayer
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
        disabled={!layerComplete}
        aria-label={isLastLayer ? "Generate my project brief" : `Continue to ${nextLayerName}`}
        className={cn(
          "flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-canopy focus-visible:ring-offset-2 focus-visible:ring-offset-forest-950",
          layerComplete
            ? "bg-amber-canopy text-forest-950 hover:bg-amber-canopy-light shadow-[0_2px_12px_rgba(217,119,6,0.3)]"
            : "bg-forest-750 text-text-muted cursor-not-allowed border border-forest-600"
        )}
      >
        {isLastLayer ? (
          <>
            Generate Brief
            <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </>
        ) : (
          <>
            {nextLayerName ? `Next: ${nextLayerName}` : "Continue"}
            <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5" aria-hidden="true">
              <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </>
        )}
      </button>
    </div>
  );
}
