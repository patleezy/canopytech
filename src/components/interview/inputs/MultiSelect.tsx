"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import type { QuestionOption } from "@/types/interview";

interface MultiSelectProps {
  options: QuestionOption[];
  value: string[];
  onChange: (value: string[]) => void;
}

export function MultiSelect({ options, value, onChange }: MultiSelectProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const firstBtn = containerRef.current?.querySelector("button");
    firstBtn?.focus();
  }, []);

  const toggle = (id: string) => {
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id));
    } else {
      onChange([...value, id]);
    }
  };

  return (
    <div ref={containerRef} className="flex flex-col gap-2">
      <p className="text-xs text-text-muted mb-1">Select all that apply</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((opt) => {
          const isSelected = value.includes(opt.id);
          return (
            <button
              key={opt.id}
              role="checkbox"
              aria-checked={isSelected}
              onClick={() => toggle(opt.id)}
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
                  "flex-shrink-0 w-4 h-4 rounded border-2 transition-all duration-150 flex items-center justify-center",
                  isSelected
                    ? "border-amber-canopy bg-amber-canopy"
                    : "border-forest-500"
                )}
              >
                {isSelected && (
                  <svg
                    viewBox="0 0 10 8"
                    fill="none"
                    className="w-2.5 h-2"
                    aria-hidden="true"
                  >
                    <path
                      d="M1 4l3 3 5-6"
                      stroke="#080d08"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>
              <span className="text-sm font-medium">{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
