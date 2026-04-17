"use client";

import { useState } from "react";
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

function InfoTooltip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);

  return (
    // inline-block so it sits on the same line as the surrounding text
    <span className="relative inline-block align-middle ml-1.5 translate-y-[-1px]">
      <button
        type="button"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen((v) => !v)}
        aria-label="Why we ask this"
        aria-expanded={open}
        className={cn(
          "inline-flex items-center justify-center w-[18px] h-[18px] rounded-full border text-[10px] font-bold leading-none transition-all",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-canopy",
          open
            ? "border-amber-canopy text-amber-canopy bg-amber-canopy/10"
            : "border-forest-500 text-text-muted hover:border-amber-canopy hover:text-amber-canopy"
        )}
      >
        i
      </button>

      {open && (
        <span
          role="tooltip"
          className="absolute left-0 top-6 z-20 block w-64 p-3 rounded-xl bg-forest-750 border border-forest-600 shadow-xl"
        >
          <span className="block text-xs text-text-secondary leading-relaxed">
            {text}
          </span>
          <span className="absolute -top-1.5 left-1.5 w-3 h-3 rotate-45 bg-forest-750 border-l border-t border-forest-600" />
        </span>
      )}
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
      {/* Question heading — icon is inline in the text flow */}
      <h3 className="text-base font-semibold text-text-primary leading-snug">
        {question.text}
        {question.helpText && <InfoTooltip text={question.helpText} />}
      </h3>

      {/* Input */}
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
