export type QuestionType = "free-text" | "single-select" | "multi-select";

export interface QuestionOption {
  id: string;
  label: string;
}

export interface Question {
  id: number;
  layer: 1 | 2 | 3 | 4 | 5;
  layerName: string;
  type: QuestionType;
  text: string;
  helpText?: string;
  options?: QuestionOption[];
}

export type AnswerValue = string | string[];
export type AnswerMap = Partial<Record<number, AnswerValue>>;

export type InterviewPhase = "interviewing" | "submitting" | "complete";

export interface InterviewState {
  currentLayer: 1 | 2 | 3 | 4 | 5;
  answers: AnswerMap;
  direction: "forward" | "backward";
  phase: InterviewPhase;
}

export type InterviewAction =
  | { type: "SET_ANSWER"; questionId: number; answer: AnswerValue }
  | { type: "NEXT_LAYER" }
  | { type: "PREV_LAYER" }
  | { type: "SUBMIT" }
  | { type: "RESET" }
  | { type: "HYDRATE"; state: InterviewState };
