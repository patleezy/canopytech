#!/usr/bin/env tsx
/**
 * Queries Tavily for the latest recommended models from Anthropic, Google, and OpenAI,
 * then rewrites src/lib/ai-models.ts with updated values.
 *
 * Usage: npx tsx scripts/refresh-ai-models.ts
 * Requires: TAVILY_API_KEY in environment
 */

import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { join, dirname } from "path";

const TAVILY_API_KEY = process.env.TAVILY_API_KEY;
if (!TAVILY_API_KEY) {
  console.error("Error: TAVILY_API_KEY environment variable is required");
  process.exit(1);
}

interface TavilyResult {
  title: string;
  content: string;
  url: string;
}

interface TavilyResponse {
  results: TavilyResult[];
  answer?: string;
}

async function tavilySearch(query: string): Promise<TavilyResponse> {
  const res = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: TAVILY_API_KEY,
      query,
      search_depth: "advanced",
      include_answer: true,
      max_results: 5,
    }),
  });
  if (!res.ok) throw new Error(`Tavily error: ${res.status} ${res.statusText}`);
  return res.json() as Promise<TavilyResponse>;
}

interface ModelInfo {
  name: string;
  id: string;
  useCase: string;
}

function extractClaudeModel(response: TavilyResponse): ModelInfo {
  const text = [response.answer ?? "", ...response.results.map((r) => r.content)].join("\n");

  // Match patterns like "claude-sonnet-X-Y" or "claude-opus-X-Y" or "claude-haiku-X-Y"
  const idMatch = text.match(/claude-(sonnet|opus|haiku)-[\d]+(?:-[\d]+)?(?:-\d{8})?/i);
  const id = idMatch ? idMatch[0].toLowerCase() : "claude-sonnet-4-6";

  // Derive a human-readable name from the ID
  const parts = id.split("-"); // e.g. ["claude", "sonnet", "4", "6"]
  const tier = parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
  const version = parts.slice(2, 4).join(".");
  const name = `Claude ${tier} ${version}`;

  return { name, id, useCase: "reasoning-heavy features" };
}

function extractGeminiModel(response: TavilyResponse): ModelInfo {
  const text = [response.answer ?? "", ...response.results.map((r) => r.content)].join("\n");

  // Match patterns like "gemini-2.5-flash" or "gemini-2.0-flash"
  const idMatch = text.match(/gemini-[\d]+\.[\d]+-flash(?:-[\w-]+)?/i);
  const id = idMatch ? idMatch[0].toLowerCase() : "gemini-2.5-flash";

  const parts = id.split("-"); // e.g. ["gemini", "2.5", "flash"]
  const name = `Gemini ${parts[1]} Flash`;

  return { name, id, useCase: "cost-sensitive or long-context features" };
}

function extractOpenAIModel(response: TavilyResponse): ModelInfo {
  const text = [response.answer ?? "", ...response.results.map((r) => r.content)].join("\n");

  // Prefer o-series reasoning models, fall back to gpt-4o
  const oMatch = text.match(/\bo[\d]+(?:-mini)?\b/);
  const gptMatch = text.match(/gpt-4o(?:-mini)?/i);
  const id = oMatch ? oMatch[0].toLowerCase() : gptMatch ? gptMatch[0].toLowerCase() : "gpt-4o";
  const name = id.startsWith("o") ? id.toUpperCase() : id.toUpperCase().replace("GPT-", "GPT-");

  return { name, id, useCase: "OpenAI-ecosystem projects" };
}

async function main() {
  console.log("Searching for current AI model recommendations...");

  const [claudeRes, geminiRes, openaiRes] = await Promise.all([
    tavilySearch(
      "latest current recommended Claude Anthropic model API 2025 site:anthropic.com OR site:docs.anthropic.com"
    ),
    tavilySearch(
      "latest current recommended Gemini Google AI model API 2025 site:ai.google.dev OR site:cloud.google.com"
    ),
    tavilySearch(
      "latest current recommended OpenAI GPT model API 2025 site:platform.openai.com OR site:openai.com"
    ),
  ]);

  const reasoning = extractClaudeModel(claudeRes);
  const costEffective = extractGeminiModel(geminiRes);
  const openaiAlternative = extractOpenAIModel(openaiRes);
  const updatedAt = new Date().toISOString().split("T")[0];

  console.log(`Claude:  ${reasoning.name} (${reasoning.id})`);
  console.log(`Gemini:  ${costEffective.name} (${costEffective.id})`);
  console.log(`OpenAI:  ${openaiAlternative.name} (${openaiAlternative.id})`);

  const output = `// Current AI model recommendations — updated periodically by scripts/refresh-ai-models.ts
// Do not edit by hand; run \`npx tsx scripts/refresh-ai-models.ts\` to refresh.
// Last updated: ${updatedAt}

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
  updatedAt: "${updatedAt}",
  reasoning: {
    name: "${reasoning.name}",
    id: "${reasoning.id}",
    useCase: "${reasoning.useCase}",
  },
  costEffective: {
    name: "${costEffective.name}",
    id: "${costEffective.id}",
    useCase: "${costEffective.useCase}",
  },
  openaiAlternative: {
    name: "${openaiAlternative.name}",
    id: "${openaiAlternative.id}",
    useCase: "${openaiAlternative.useCase}",
  },
};

export default AI_MODELS;

export function formatAiEngineRule(models: AiModelRecommendations): string {
  const { reasoning, costEffective, openaiAlternative } = models;
  return (
    \`- AI Engine: Route to \${reasoning.name} (\${reasoning.id}) for \${reasoning.useCase}, \` +
    \`\${costEffective.name} (\${costEffective.id}) for \${costEffective.useCase}, \` +
    \`\${openaiAlternative.name} (\${openaiAlternative.id}) as an \${openaiAlternative.useCase}\`
  );
}
`;

  const outPath = join(dirname(fileURLToPath(import.meta.url)), "../src/lib/ai-models.ts");
  writeFileSync(outPath, output, "utf-8");
  console.log(`\nWrote updated models to src/lib/ai-models.ts`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
