import { QUESTIONS, TOTAL_QUESTIONS } from "./interview-data";
import type {
  AnswerValue,
  InterviewAction,
  InterviewState,
} from "@/types/interview";

export const initialState: InterviewState = {
  currentIndex: 0,
  answers: {},
  direction: "forward",
  phase: "interviewing",
};

export function interviewReducer(
  state: InterviewState,
  action: InterviewAction
): InterviewState {
  switch (action.type) {
    case "SET_ANSWER":
      return {
        ...state,
        answers: { ...state.answers, [action.questionId]: action.answer },
      };

    case "NEXT": {
      const nextIndex = state.currentIndex + 1;
      if (nextIndex >= TOTAL_QUESTIONS) {
        return { ...state, direction: "forward", phase: "submitting" };
      }
      return { ...state, currentIndex: nextIndex, direction: "forward" };
    }

    case "PREV": {
      const prevIndex = Math.max(0, state.currentIndex - 1);
      return { ...state, currentIndex: prevIndex, direction: "backward" };
    }

    case "SUBMIT":
      return { ...state, phase: "complete" };

    case "RESET":
      return initialState;

    case "HYDRATE":
      return action.state;

    default:
      return state;
  }
}

export function currentQuestion(state: InterviewState) {
  return QUESTIONS[state.currentIndex];
}

export function currentAnswer(state: InterviewState): AnswerValue | undefined {
  const q = currentQuestion(state);
  return q ? state.answers[q.id] : undefined;
}

export function hasValidAnswer(state: InterviewState): boolean {
  const answer = currentAnswer(state);
  if (!answer) return false;
  if (typeof answer === "string") return answer.trim().length > 0;
  if (Array.isArray(answer)) return answer.length > 0;
  return false;
}
