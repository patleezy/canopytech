"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface FreeTextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export function FreeTextInput({
  value,
  onChange,
  placeholder,
  autoFocus = false,
}: FreeTextInputProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus) ref.current?.focus();
  }, [autoFocus]);

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder ?? "Type your answer here…"}
      rows={4}
      className={cn(
        "w-full bg-forest-800 border border-forest-600 rounded-xl px-4 py-3",
        "text-text-primary placeholder:text-text-muted",
        // 16px minimum prevents iOS Safari auto-zoom on focus
        "text-[16px] leading-relaxed resize-none",
        "transition-colors duration-150",
        "hover:border-forest-500",
        "focus:outline-none focus:border-amber-canopy focus:ring-1 focus:ring-amber-canopy",
        "min-h-[100px]"
      )}
      aria-label="Your answer"
    />
  );
}
