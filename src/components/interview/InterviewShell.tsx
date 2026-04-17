"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useInterview } from "@/lib/use-interview";
import { questionsForLayer } from "@/lib/interview-data";
import { ProgressIndicator } from "./ProgressIndicator";
import { QuestionCard } from "./QuestionCard";
import { NavigationBar } from "./NavigationBar";
import { CompletionScreen } from "./CompletionScreen";

const variants = {
  enter: (direction: "forward" | "backward") => ({
    x: direction === "forward" ? 56 : -56,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: "forward" | "backward") => ({
    x: direction === "forward" ? -56 : 56,
    opacity: 0,
  }),
};

export function InterviewShell() {
  const router = useRouter();
  const {
    state,
    isHydrated,
    layerComplete,
    isFirstLayer,
    isLastLayer,
    setAnswer,
    nextLayer,
    prevLayer,
    reset,
  } = useInterview();

  const isSubmitting = useRef(false);

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

        sessionStorage.setItem("canopy_brief", brief);
        router.push("/brief");
      } catch (err) {
        console.error("Brief generation failed:", err);
        sessionStorage.setItem(
          "canopy_brief",
          "### Error\n\nSomething went wrong generating your brief. Please try again."
        );
        router.push("/brief");
      }
    };

    submit();
  }, [state.phase, state.answers, router]);

  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-5 h-5 rounded-full border-2 border-forest-600 border-t-amber-canopy animate-spin" />
      </div>
    );
  }

  const layerQuestions = questionsForLayer(state.currentLayer);

  return (
    <div className="flex flex-col gap-6">
      {state.phase === "interviewing" && (
        <>
          <ProgressIndicator currentLayer={state.currentLayer} />

          <AnimatePresence mode="wait" custom={state.direction}>
            <motion.div
              key={state.currentLayer}
              custom={state.direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="flex flex-col gap-6"
            >
              {/* Layer heading */}
              <div>
                <p className="text-xs font-semibold text-amber-canopy uppercase tracking-widest mb-1">
                  Layer {state.currentLayer} of 5
                </p>
                <h2 className="text-xl font-bold text-text-primary">
                  {layerQuestions[0]?.layerName}
                </h2>
              </div>

              {/* All questions for this layer */}
              <div className="flex flex-col gap-7">
                {layerQuestions.map((question, i) => (
                  <QuestionCard
                    key={question.id}
                    question={question}
                    answer={state.answers[question.id]}
                    onAnswer={(value) => setAnswer(question.id, value)}
                    isFirst={i === 0}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          <NavigationBar
            onPrev={prevLayer}
            onNext={nextLayer}
            layerComplete={layerComplete}
            isFirstLayer={isFirstLayer}
            isLastLayer={isLastLayer}
            currentLayer={state.currentLayer}
          />
        </>
      )}

      {state.phase === "submitting" && (
        <CompletionScreen onReset={reset} />
      )}
    </div>
  );
}
