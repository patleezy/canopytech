// Current AI model recommendations — updated periodically by scripts/refresh-ai-models.ts
// Do not edit by hand; run `npx tsx scripts/refresh-ai-models.ts` to refresh.
// Last updated: 2026-11-16

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
  updatedAt: "2026-11-16",
  reasoning: {
    name: "Claude Opus 4.8",
    id: "claude-opus-4-8",
    useCase: "reasoning-heavy features",
  },
  costEffective: {
    name: "Gemini 3.6 Flash",
    id: "gemini-3.6-flash",
    useCase: "cost-sensitive or long-context features",
  },
  openaiAlternative: {
    name: "O3-MINI",
    id: "o3-mini",
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
