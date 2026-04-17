"use client";

import { QUESTIONS, LAYERS, TOTAL_QUESTIONS } from "@/lib/interview-data";
import { cn } from "@/lib/utils";

interface ProgressIndicatorProps {
  currentIndex: number;
}

export function ProgressIndicator({ currentIndex }: ProgressIndicatorProps) {
  const question = QUESTIONS[currentIndex];
  const layer = question?.layer ?? 1;
  const layerInfo = LAYERS[layer];
  const progressPct = ((currentIndex) / (TOTAL_QUESTIONS - 1)) * 100;

  return (
    <div className="flex flex-col gap-3">
      {/* Layer label + question counter */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-forest-700 border border-forest-600 text-xs font-medium text-amber-canopy">
            Layer {layer} of 5
          </span>
          <span className="text-xs text-text-muted font-medium">
            {layerInfo?.name}
          </span>
        </div>
        <span className="text-xs text-text-muted tabular-nums">
          {currentIndex + 1} / {TOTAL_QUESTIONS}
        </span>
      </div>

      {/* Progress bar */}
      <div
        role="progressbar"
        aria-valuenow={currentIndex + 1}
        aria-valuemin={1}
        aria-valuemax={TOTAL_QUESTIONS}
        aria-label={`Question ${currentIndex + 1} of ${TOTAL_QUESTIONS}`}
        className="relative h-1 bg-forest-700 rounded-full overflow-hidden"
      >
        <div
          className="absolute inset-y-0 left-0 bg-amber-canopy rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Layer segment dots */}
      <div className="flex items-center gap-1" aria-hidden="true">
        {QUESTIONS.map((q, i) => {
          const isAnswered = i < currentIndex;
          const isCurrent = i === currentIndex;
          const isLayerStart =
            i === 0 || QUESTIONS[i - 1]?.layer !== q.layer;

          return (
            <div key={q.id} className="flex items-center gap-1">
              {isLayerStart && i > 0 && (
                <div className="w-2 h-px bg-forest-600" />
              )}
              <div
                className={cn(
                  "rounded-full transition-all duration-300",
                  isCurrent
                    ? "w-3 h-3 bg-amber-canopy shadow-[0_0_6px_rgba(217,119,6,0.6)]"
                    : isAnswered
                    ? "w-1.5 h-1.5 bg-amber-canopy-dim"
                    : "w-1.5 h-1.5 bg-forest-600"
                )}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
