import { questionsForLayer, TOTAL_LAYERS } from "./interview-data";
import type {
  AnswerValue,
  InterviewAction,
  InterviewState,
  AnswerMap,
} from "@/types/interview";

export const initialState: InterviewState = {
  currentLayer: 1,
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

    case "NEXT_LAYER": {
      const next = state.currentLayer + 1;
      if (next > TOTAL_LAYERS) {
        return { ...state, direction: "forward", phase: "submitting" };
      }
      return {
        ...state,
        currentLayer: next as InterviewState["currentLayer"],
        direction: "forward",
      };
    }

    case "PREV_LAYER": {
      const prev = Math.max(1, state.currentLayer - 1);
      return {
        ...state,
        currentLayer: prev as InterviewState["currentLayer"],
        direction: "backward",
      };
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

export function isLayerComplete(
  layer: number,
  answers: AnswerMap
): boolean {
  const questions = questionsForLayer(layer);
  return questions.every((q) => {
    const answer = answers[q.id];
    if (!answer) return false;
    if (typeof answer === "string") return answer.trim().length > 0;
    if (Array.isArray(answer)) return answer.length > 0;
    return false;
  });
}

export function currentLayerAnswer(
  questionId: number,
  answers: AnswerMap
): AnswerValue | undefined {
  return answers[questionId];
}
