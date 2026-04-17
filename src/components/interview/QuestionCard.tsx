"use client";

import { FreeTextInput } from "./inputs/FreeTextInput";
import { SingleSelect } from "./inputs/SingleSelect";
import { MultiSelect } from "./inputs/MultiSelect";
import type { Question, AnswerValue } from "@/types/interview";

interface QuestionCardProps {
  question: Question;
  answer: AnswerValue | undefined;
  onAnswer: (value: AnswerValue) => void;
  onAutoAdvance?: () => void;
}

export function QuestionCard({
  question,
  answer,
  onAnswer,
  onAutoAdvance,
}: QuestionCardProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <h2 className="text-xl sm:text-2xl font-semibold text-text-primary leading-snug">
          {question.text}
        </h2>
      </div>

      <div>
        {question.type === "free-text" && (
          <FreeTextInput
            value={typeof answer === "string" ? answer : ""}
            onChange={onAnswer}
          />
        )}
        {question.type === "single-select" && question.options && (
          <SingleSelect
            options={question.options}
            value={typeof answer === "string" ? answer : undefined}
            onChange={onAnswer}
            onAutoAdvance={onAutoAdvance}
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
