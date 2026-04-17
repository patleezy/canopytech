"use client";

import { LAYERS, TOTAL_LAYERS } from "@/lib/interview-data";
import { cn } from "@/lib/utils";

interface ProgressIndicatorProps {
  currentLayer: number;
}

export function ProgressIndicator({ currentLayer }: ProgressIndicatorProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Step row */}
      <div className="flex items-center gap-0">
        {Array.from({ length: TOTAL_LAYERS }, (_, i) => {
          const layer = i + 1;
          const isDone = layer < currentLayer;
          const isCurrent = layer === currentLayer;
          const isUpcoming = layer > currentLayer;

          return (
            <div key={layer} className="flex items-center flex-1 last:flex-none">
              {/* Node */}
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 border",
                    isDone
                      ? "bg-amber-canopy-dim border-amber-canopy-dim text-amber-canopy"
                      : isCurrent
                      ? "bg-amber-canopy border-amber-canopy text-forest-950 shadow-[0_0_12px_rgba(217,119,6,0.4)]"
                      : "bg-forest-800 border-forest-600 text-text-muted"
                  )}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  {isDone ? (
                    <svg viewBox="0 0 12 10" fill="none" className="w-3 h-2.5" aria-hidden="true">
                      <path d="M1 5l3.5 3.5L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    layer
                  )}
                </div>
                <span
                  className={cn(
                    "text-[10px] font-medium whitespace-nowrap transition-colors duration-300 hidden sm:block",
                    isCurrent ? "text-amber-canopy" : isDone ? "text-amber-canopy-dim" : "text-text-muted"
                  )}
                >
                  {LAYERS[layer]?.name}
                </span>
              </div>

              {/* Connector */}
              {layer < TOTAL_LAYERS && (
                <div className="flex-1 h-px mx-2 mb-5 sm:mb-[1.375rem] relative overflow-hidden bg-forest-600">
                  <div
                    className="absolute inset-y-0 left-0 bg-amber-canopy-dim transition-all duration-500 ease-out"
                    style={{ width: isDone ? "100%" : "0%" }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile: current layer name */}
      <p className="sm:hidden text-xs text-amber-canopy font-medium">
        Layer {currentLayer} — {LAYERS[currentLayer]?.name}
      </p>
    </div>
  );
}
