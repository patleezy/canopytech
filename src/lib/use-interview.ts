"use client";

import { useReducer, useEffect, useCallback, useState } from "react";
import {
  initialState,
  interviewReducer,
  isLayerComplete,
} from "./interview-reducer";
import type { AnswerValue, InterviewState } from "@/types/interview";

const STORAGE_KEY = "canopy_interview_v2";

export function useInterview() {
  const [state, dispatch] = useReducer(interviewReducer, initialState);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as InterviewState;
        if (parsed.phase === "interviewing") {
          dispatch({ type: "HYDRATE", state: parsed });
        }
      }
    } catch {
      // Corrupt storage — start fresh
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage unavailable
    }
  }, [state, isHydrated]);

  const setAnswer = useCallback((questionId: number, answer: AnswerValue) => {
    dispatch({ type: "SET_ANSWER", questionId, answer });
  }, []);

  const nextLayer = useCallback(() => dispatch({ type: "NEXT_LAYER" }), []);
  const prevLayer = useCallback(() => dispatch({ type: "PREV_LAYER" }), []);

  const reset = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    dispatch({ type: "RESET" });
  }, []);

  const layerComplete = isLayerComplete(state.currentLayer, state.answers);
  const isFirstLayer = state.currentLayer === 1;
  const isLastLayer = state.currentLayer === 5;

  return {
    state,
    dispatch,
    isHydrated,
    layerComplete,
    isFirstLayer,
    isLastLayer,
    setAnswer,
    nextLayer,
    prevLayer,
    reset,
  };
}
