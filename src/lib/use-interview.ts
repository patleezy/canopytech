"use client";

import { useReducer, useEffect, useCallback, useState } from "react";
import {
  initialState,
  interviewReducer,
  currentQuestion,
  currentAnswer,
  hasValidAnswer,
} from "./interview-reducer";
import { QUESTIONS } from "./interview-data";
import type { AnswerValue, InterviewState } from "@/types/interview";

const STORAGE_KEY = "canopy_interview_state";

export function useInterview() {
  const [state, dispatch] = useReducer(interviewReducer, initialState);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as InterviewState;
        // Don't restore a "submitting" or "complete" phase — restart
        if (parsed.phase === "interviewing") {
          dispatch({ type: "HYDRATE", state: parsed });
        }
      }
    } catch {
      // Corrupt storage — start fresh
    }
    setIsHydrated(true);
  }, []);

  // Persist to localStorage on every state change
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage unavailable — continue without persistence
    }
  }, [state, isHydrated]);

  const setAnswer = useCallback(
    (questionId: number, answer: AnswerValue) => {
      dispatch({ type: "SET_ANSWER", questionId, answer });
    },
    []
  );

  const next = useCallback(() => dispatch({ type: "NEXT" }), []);
  const prev = useCallback(() => dispatch({ type: "PREV" }), []);

  const reset = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    dispatch({ type: "RESET" });
  }, []);

  const question = currentQuestion(state);
  const answer = currentAnswer(state);
  const canAdvance = hasValidAnswer(state);
  const isFirstQuestion = state.currentIndex === 0;
  const isLastQuestion = state.currentIndex === QUESTIONS.length - 1;

  return {
    state,
    dispatch,
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
  };
}
