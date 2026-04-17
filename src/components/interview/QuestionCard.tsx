"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { FreeTextInput } from "./inputs/FreeTextInput";
import { SingleSelect } from "./inputs/SingleSelect";
import { MultiSelect } from "./inputs/MultiSelect";
import type { Question, AnswerValue } from "@/types/interview";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
  question: Question;
  answer: AnswerValue | undefined;
  onAnswer: (value: AnswerValue) => void;
  isFirst?: boolean;
}

interface TooltipPos {
  top: number;
  left: number;
}

function InfoTooltip({ text }: { text: string }) {
  const [pos, setPos] = useState<TooltipPos | null>(null);
  const [mounted, setMounted] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  // Wait for client mount before using portals
  useEffect(() => {
    setMounted(true);
  }, []);

  const show = useCallback(() => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const tooltipWidth = 264;
    const margin = 12;
    // Clamp horizontally so tooltip never overflows viewport edge
    const left = Math.max(
      margin,
      Math.min(rect.left, window.innerWidth - tooltipWidth - margin)
    );
    setPos({ top: rect.bottom + 6, left });
  }, []);

  const hide = useCallback(() => setPos(null), []);

  // Dismiss on scroll so it doesn't float orphaned on mobile
  useEffect(() => {
    if (!pos) return;
    window.addEventListener("scroll", hide, { passive: true });
    return () => window.removeEventListener("scroll", hide);
  }, [pos, hide]);

  const tooltip =
    mounted && pos
      ? createPortal(
          <div
            role="tooltip"
            style={{ top: pos.top, left: pos.left }}
            className="fixed z-[9999] w-66 max-w-[calc(100vw-24px)] p-3 rounded-xl bg-forest-750 border border-forest-600 shadow-2xl"
          >
            <p className="text-xs text-text-secondary leading-relaxed">{text}</p>
          </div>,
          document.body
        )
      : null;

  return (
    <span className="relative inline-block align-middle ml-1.5 translate-y-[-1px]">
      <button
        ref={btnRef}
        type="button"
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        onClick={() => (pos ? hide() : show())}
        aria-label="Why we ask this"
        aria-expanded={!!pos}
        className={cn(
          "inline-flex items-center justify-center w-[18px] h-[18px] rounded-full border text-[10px] font-bold leading-none transition-all",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-canopy",
          pos
            ? "border-amber-canopy text-amber-canopy bg-amber-canopy/10"
            : "border-forest-500 text-text-muted hover:border-amber-canopy hover:text-amber-canopy"
        )}
      >
        i
      </button>
      {tooltip}
    </span>
  );
}

export function QuestionCard({
  question,
  answer,
  onAnswer,
  isFirst = false,
}: QuestionCardProps) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-base font-semibold text-text-primary leading-snug">
        {question.text}
        {question.helpText && <InfoTooltip text={question.helpText} />}
      </h3>

      <div>
        {question.type === "free-text" && (
          <FreeTextInput
            value={typeof answer === "string" ? answer : ""}
            onChange={onAnswer}
            autoFocus={isFirst}
          />
        )}
        {question.type === "single-select" && question.options && (
          <SingleSelect
            options={question.options}
            value={typeof answer === "string" ? answer : undefined}
            onChange={onAnswer}
          />
        )}
        {question.type === "multi-select" && question.options && (
          <MultiSelect
            options={question.options}
            value={Array.isArray(answer) ? answer : []}
            onChange={onAnswer}
          />
        )}
      </div>
    </div>
  );
}
