import { base44 } from "@/api/base44Client";

const CACHE_KEY = "aa_quality_ranking";
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Fetches real AI model quality data from Artificial Analysis via InvokeLLM
 * with web search. Results are cached in localStorage for 24h to minimize
 * LLM credit usage.
 *
 * Returns an array of models: { rank, name, vendor, intelligence, programming, agentic }
 * Returns null if the fetch fails (caller should fall back to mock data).
 */
export async function fetchQualityRanking() {
  // Check cache
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_TTL && Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch {
    // ignore cache read errors
  }

  try {
    const response = await base44.integrations.Core.InvokeLLM({
      prompt:
        "Access the Artificial Analysis website (artificialanalysis.ai). Look at the LLM leaderboard at artificialanalysis.ai/leaderboards/models and the evaluations page at artificialanalysis.ai/evaluations. Extract the top 100 AI models listed there. For each model return: name (the full model name as shown on the site), vendor (the company that created it — e.g. OpenAI, Anthropic, Google, DeepSeek, xAI, Meta, Mistral, Alibaba, NVIDIA, Microsoft, Cohere, MiniMax, Moonshot AI, Tencent, Zhipu/Z.ai), intelligence (the Artificial Analysis Intelligence Index score as a number, typically 0–60), and programming (the Artificial Analysis Coding Index score as a number if available, typically 0–100). Sort the models by intelligence score descending. Return as many models as you can find, up to 100.",
      add_context_from_internet: true,
      model: "gemini_3_flash",
      response_json_schema: {
        type: "object",
        properties: {
          models: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                vendor: { type: "string" },
                intelligence: { type: "number" },
                programming: { type: "number" },
              },
            },
          },
        },
      },
    });

    const raw = Array.isArray(response?.models) ? response.models : [];
    if (raw.length === 0) return null;

    const models = raw
      .filter((m) => m.name && m.intelligence != null)
      .sort((a, b) => (b.intelligence || 0) - (a.intelligence || 0))
      .map((m, i) => ({
        rank: i + 1,
        name: m.name,
        vendor: m.vendor || "",
        subtitle: "",
        intelligence: m.intelligence,
        programming: m.programming ?? null,
        agentic: null,
      }));

    if (models.length === 0) return null;

    // Cache
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ data: models, timestamp: Date.now() }));
    } catch {
      // ignore cache write errors
    }

    return models;
  } catch (error) {
    console.error("fetchQualityRanking failed:", error);
    return null;
  }
}