"use client";

import { useEffect, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useInterview } from "@/lib/use-interview";
import { ProgressIndicator } from "./ProgressIndicator";
import { QuestionCard } from "./QuestionCard";
import { NavigationBar } from "./NavigationBar";
import { CompletionScreen } from "./CompletionScreen";

const variants = {
  enter: (direction: "forward" | "backward") => ({
    x: direction === "forward" ? 48 : -48,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: "forward" | "backward") => ({
    x: direction === "forward" ? -48 : 48,
    opacity: 0,
  }),
};

export function InterviewShell() {
  const router = useRouter();
  const {
    state,
    isHydrated,
    question,
    answer,
    canAdvance,
    isFirstQuestion,
    isLastQuestion,
    setAnswer,
    next,
    prev,
    reset,
  } = useInterview();

  const isSubmitting = useRef(false);

  // When phase becomes "submitting", call the API
  useEffect(() => {
    if (state.phase !== "submitting" || isSubmitting.current) return;
    isSubmitting.current = true;

    const submit = async () => {
      try {
        const res = await fetch("/api/interview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers: state.answers }),
        });

        if (!res.ok) throw new Error("API error");

        // Stream the response text
        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        let brief = "";

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            brief += decoder.decode(value, { stream: true });
          }
        }

        // Store brief and navigate
        sessionStorage.setItem("canopy_brief", brief);
        router.push("/brief");
      } catch (err) {
        console.error("Brief generation failed:", err);
        // Store error state for brief page
        sessionStorage.setItem(
          "canopy_brief",
          "### Error\n\nSomething went wrong generating your brief. Please try again."
        );
        router.push("/brief");
      }
    };

    submit();
  }, [state.phase, state.answers, router]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (state.phase !== "interviewing") return;
      if (!question) return;

      // Enter to advance (only for non-free-text to avoid textarea submit conflicts)
      if (e.key === "Enter" && !e.shiftKey && question.type !== "free-text") {
        if (canAdvance) {
          e.preventDefault();
          next();
        }
      }
    },
    [state.phase, question, canAdvance, next]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-5 h-5 rounded-full border-2 border-forest-600 border-t-amber-canopy animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {state.phase === "interviewing" && question && (
        <>
          <ProgressIndicator currentIndex={state.currentIndex} />

          <div className="min-h-[340px] sm:min-h-[300px]">
            <AnimatePresence mode="wait" custom={state.direction}>
              <motion.div
                key={question.id}
                custom={state.direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                <QuestionCard
                  question={question}
                  answer={answer}
                  onAnswer={(value) => setAnswer(question.id, value)}
                  onAutoAdvance={
                    question.type === "single-select" ? next : undefined
                  }
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <NavigationBar
            onPrev={prev}
            onNext={next}
            canAdvance={canAdvance}
            isFirstQuestion={isFirstQuestion}
            isLastQuestion={isLastQuestion}
          />
        </>
      )}

      {state.phase === "submitting" && (
        <CompletionScreen onReset={reset} />
      )}
    </div>
  );
}
