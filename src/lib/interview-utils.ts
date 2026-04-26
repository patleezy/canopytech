const STORAGE_KEY = "canopy_interview_v2";

export function restartInterviewKeepingAnswers(): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const state = JSON.parse(raw) as Record<string, unknown>;
      state.phase = "interviewing";
      state.currentLayer = 1;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  } catch {
    // ignore corrupt storage
  }
}
