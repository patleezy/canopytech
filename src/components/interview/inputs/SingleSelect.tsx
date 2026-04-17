"use client";

import { cn } from "@/lib/utils";
import type { QuestionOption } from "@/types/interview";

interface SingleSelectProps {
  options: QuestionOption[];
  value: string | undefined;
  onChange: (value: string) => void;
}

export function SingleSelect({ options, value, onChange }: SingleSelectProps) {
  return (
    <div role="radiogroup" className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
      {options.map((opt) => {
        const isSelected = value === opt.id;
        return (
          <button
            key={opt.id}
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(opt.id)}
            className={cn(
              "flex items-center gap-3 px-3.5 py-3 rounded-xl text-left",
              "border transition-all duration-150 cursor-pointer",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-canopy focus-visible:ring-offset-1 focus-visible:ring-offset-forest-950",
              isSelected
                ? "bg-forest-700 border-amber-canopy text-text-primary"
                : "bg-forest-800 border-forest-600 text-text-secondary hover:bg-forest-700 hover:border-forest-500 hover:text-text-primary"
            )}
          >
            <span
              className={cn(
                "flex-shrink-0 w-3.5 h-3.5 rounded-full border-2 transition-all duration-150",
                isSelected ? "border-amber-canopy bg-amber-canopy" : "border-forest-500"
              )}
            />
            <span className="text-sm font-medium">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
