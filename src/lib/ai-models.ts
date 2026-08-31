// Current AI model recommendations — updated periodically by scripts/refresh-ai-models.ts
// Do not edit by hand; run `npx tsx scripts/refresh-ai-models.ts` to refresh.
// Last updated: 2026-08-31

export interface ModelOption {
  name: string;
  id: string;
  useCase: string;
}

export interface AiModelRecommendations {
  updatedAt: string;
  reasoning: ModelOption;
  costEffective: ModelOption;
  openaiAlternative: ModelOption;
}

const AI_MODELS: AiModelRecommendations = {
  updatedAt: "2026-08-31",
  reasoning: {
    name: "Claude Haiku 4.5",
    id: "claude-haiku-4-5-20251001",
    useCase: "reasoning-heavy features",
  },
  costEffective: {
    name: "Gemini 3.1 Flash",
    id: "gemini-3.1-flash-lite",
    useCase: "cost-sensitive or long-context features",
  },
  openaiAlternative: {
    name: "O1",
    id: "o1",
    useCase: "OpenAI-ecosystem projects",
  },
};

export default AI_MODELS;

export function formatAiEngineRule(models: AiModelRecommendations): string {
  const { reasoning, costEffective, openaiAlternative } = models;
  return (
    `- AI Engine: Route to ${reasoning.name} (${reasoning.id}) for ${reasoning.useCase}, ` +
    `${costEffective.name} (${costEffective.id}) for ${costEffective.useCase}, ` +
    `${openaiAlternative.name} (${openaiAlternative.id}) as an ${openaiAlternative.useCase}`
  );
}
