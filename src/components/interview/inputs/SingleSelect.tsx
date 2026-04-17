"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import type { QuestionOption } from "@/types/interview";

interface SingleSelectProps {
  options: QuestionOption[];
  value: string | undefined;
  onChange: (value: string) => void;
  onAutoAdvance?: () => void;
}

export function SingleSelect({
  options,
  value,
  onChange,
  onAutoAdvance,
}: SingleSelectProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Focus the first tile on mount for keyboard nav
    const firstBtn = containerRef.current?.querySelector("button");
    firstBtn?.focus();
  }, []);

  const handleSelect = (id: string) => {
    onChange(id);
    if (onAutoAdvance) {
      // Small delay so selection registers visually before transition
      setTimeout(onAutoAdvance, 280);
    }
  };

  return (
    <div
      ref={containerRef}
      role="radiogroup"
      className="grid grid-cols-1 sm:grid-cols-2 gap-3"
    >
      {options.map((opt) => {
        const isSelected = value === opt.id;
        return (
          <button
            key={opt.id}
            role="radio"
            aria-checked={isSelected}
            onClick={() => handleSelect(opt.id)}
            className={cn(
              "relative flex items-center gap-3 px-4 py-3.5 rounded-xl text-left",
              "border transition-all duration-150 cursor-pointer",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-canopy focus-visible:ring-offset-1 focus-visible:ring-offset-forest-950",
              isSelected
                ? "bg-forest-700 border-amber-canopy text-text-primary"
                : "bg-forest-800 border-forest-600 text-text-secondary hover:bg-forest-700 hover:border-forest-500 hover:text-text-primary"
            )}
          >
            <span
              className={cn(
                "flex-shrink-0 w-4 h-4 rounded-full border-2 transition-all duration-150",
                isSelected
                  ? "border-amber-canopy bg-amber-canopy"
                  : "border-forest-500"
              )}
            >
              {isSelected && (
                <span className="block w-full h-full rounded-full bg-amber-canopy" />
              )}
            </span>
            <span className="text-sm font-medium">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
