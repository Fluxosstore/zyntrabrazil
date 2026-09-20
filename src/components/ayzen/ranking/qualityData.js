const LOBE = "https://raw.githubusercontent.com/lobehub/lobe-icons/refs/heads/master/packages/static-png/light";

const GEMINI = "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/c545d8735_gemini.svg";
const DEEPSEEK = "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/d6d9b4c6f_deepseek.svg";
const GPT = "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/698f8c822_chatgpt.svg";
const CLAUDE = "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/c0a57947c_claude.svg";
const GROK = "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/ad894e6fd_grok.svg";

const TENCENT = `${LOBE}/tencent-color.png`;
const ZAI = `${LOBE}/zai.png`;
const XIAOMI = `${LOBE}/xiaomimimo.png`;
const NVIDIA = `${LOBE}/nvidia-color.png`;
const MINIMAX = `${LOBE}/minimax-color.png`;
const KIMI = `${LOBE}/kimi-color.png`;
const META = `${LOBE}/meta-color.png`;
const MISTRAL = `${LOBE}/mistral-color.png`;
const COHERE = `${LOBE}/cohere-color.png`;
const QWEN = `${LOBE}/qwen-color.png`;
const MICROSOFT = `${LOBE}/microsoft-color.png`;
const ZEROONE = `${LOBE}/zeroone-color.png`;
const DBRX = `${LOBE}/dbrx-color.png`;
const UPSTAGE = `${LOBE}/upstage-color.png`;

function circle(letter, color) {
  return { type: "circle", letter, color };
}

const GEMINI_CIRCLE = circle("G", "#4285F4");
const COHERE_CIRCLE = circle("C", "#39594D");

// Rows 1-26 and 87-100 from the reference images
const KNOWN_ROWS = [
  { rank: 1, name: "Claude Fable 5.1", subtitle: "Adaptive Reasoning, Max Effort", logo: CLAUDE, intelligence: 53.4, programming: 81.6, agentic: 58.0 },
  { rank: 2, name: "Qwen3.8 Max", subtitle: "", logo: QWEN, intelligence: 53.4, programming: 68.9, agentic: 49.9 },
  { rank: 3, name: "GPT-6 Astra (max)", subtitle: "", logo: GPT, intelligence: 52.8, programming: 76.9, agentic: 51.5 },
  { rank: 4, name: "Claude Opus 5", subtitle: "Adaptive Reasoning, Max Effort", logo: CLAUDE, intelligence: 50.7, programming: 78.0, agentic: 56.2 },
  { rank: 5, name: "Claude Fable 5", subtitle: "Adaptive Reasoning, Max Effort", logo: CLAUDE, intelligence: 49.7, programming: 76.5, agentic: 51.0 },
  { rank: 6, name: "GPT-5.6 Sol (max)", subtitle: "", logo: GPT, intelligence: 47.1, programming: 77.4, agentic: 50.5 },
  { rank: 7, name: "Qwen3.8 Max (0902)", subtitle: "", logo: QWEN, intelligence: 45.4, programming: 76.2, agentic: 56.1 },
  { rank: 8, name: "GLM-5.3 (max)", subtitle: "", logo: ZAI, intelligence: 44.9, programming: 74.8, agentic: 53.4 },
  { rank: 9, name: "Grok 4.6 (high)", subtitle: "", logo: GROK, intelligence: 44.4, programming: 76.8, agentic: 53.4 },
  { rank: 10, name: "Kimi K3 (max)", subtitle: "", logo: KIMI, intelligence: 43.8, programming: 76.2, agentic: 50.6 },
  { rank: 11, name: "GPT-5.6 Terra (max)", subtitle: "", logo: GPT, intelligence: 42.3, programming: 76.7, agentic: 43.7 },
  { rank: 12, name: "Claude Opus 4.8", subtitle: "Adaptive Reasoning, Max Effort", logo: CLAUDE, intelligence: 42.0, programming: 74.3, agentic: 42.6 },
  { rank: 13, name: "GLM-5.3-Flash", subtitle: "", logo: ZAI, intelligence: 41.9, programming: 71.5, agentic: 51.2 },
  { rank: 14, name: "Gemini 3.8 Flash (high)", subtitle: "", logo: GEMINI, intelligence: 41.2, programming: 76.3, agentic: 41.1 },
  { rank: 15, name: "Qwen3.8 2.4T A95B", subtitle: "", logo: QWEN, intelligence: 40.0, programming: 71.9, agentic: 50.4 },
  { rank: 16, name: "Muse Spark 1.2 (xhigh)", subtitle: "", logo: META, intelligence: 39.8, programming: 72.2, agentic: 44.0 },
  { rank: 17, name: "DeepSeek V4.1 Flash", subtitle: "Reasoning, Max Effort", logo: DEEPSEEK, intelligence: 39.5, programming: null, agentic: null },
  { rank: 18, name: "Gemini 3.7 Flash (high)", subtitle: "", logo: GEMINI, intelligence: 39.4, programming: 76.1, agentic: 36.4 },
  { rank: 19, name: "Grok 4.5 (high)", subtitle: "", logo: GROK, intelligence: 39.1, programming: 72.4, agentic: 42.1 },
  { rank: 20, name: "GPT-5.5 (xhigh)", subtitle: "", logo: GPT, intelligence: 38.6, programming: 74.9, agentic: 37.3 },
  { rank: 21, name: "Claude Sonnet 5", subtitle: "Adaptive Reasoning, Max Effort", logo: CLAUDE, intelligence: 38.4, programming: 71.5, agentic: 44.3 },
  { rank: 22, name: "GPT-5.6 Luna (max)", subtitle: "", logo: GPT, intelligence: 37.5, programming: 71.4, agentic: 42.7 },
  { rank: 23, name: "DeepSeek V4 Pro 0813", subtitle: "Reasoning, Max Effort", logo: DEEPSEEK, intelligence: 36.3, programming: 68.8, agentic: 42.3 },
  { rank: 24, name: "DeepSeek V4 Flash 0731", subtitle: "Reasoning, Max Effort", logo: DEEPSEEK, intelligence: 34.5, programming: 69.1, agentic: 41.7 },
  { rank: 25, name: "Muse Spark 1.1 (xhigh)", subtitle: "", logo: META, intelligence: 34.3, programming: 71.3, agentic: 27.5 },
  { rank: 26, name: "Gemini 3.6 Flash (high)", subtitle: "", logo: GEMINI, intelligence: 34.3, programming: 69.2, agentic: 30.2 },
];

// Rows 27-86 generated with descending scores
const MIDDLE_NAMES = [
  { name: "Gemini 3.5 Flash (high)", logo: GEMINI },
  { name: "Claude Sonnet 4.6", subtitle: "Adaptive Reasoning", logo: CLAUDE },
  { name: "GPT-5.4 (max)", logo: GPT },
  { name: "DeepSeek V4 (max)", logo: DEEPSEEK },
  { name: "Qwen3.8 Plus", logo: QWEN },
  { name: "Grok 4 (high)", logo: GROK },
  { name: "GLM-5.2 (max)", logo: ZAI },
  { name: "Gemini 3.1 Pro", logo: GEMINI },
  { name: "Claude Sonnet 4.5", logo: CLAUDE },
  { name: "GPT-5 Mini (max)", logo: GPT },
  { name: "Kimi K2.6 (max)", logo: KIMI },
  { name: "DeepSeek V3.2 (Reasoning)", logo: DEEPSEEK },
  { name: "Qwen3 235B (Reasoning)", logo: QWEN },
  { name: "Gemini 3 Flash Preview", logo: GEMINI },
  { name: "Mistral Large 2", logo: MISTRAL },
  { name: "GPT-5.6 Luna", logo: GPT },
  { name: "Claude Haiku 4.6", logo: CLAUDE },
  { name: "GLM-5.1 (max)", logo: ZAI },
  { name: "Grok 3.5 (high)", logo: GROK },
  { name: "Qwen3 72B", logo: QWEN },
  { name: "Gemini 2.5 Pro", logo: GEMINI },
  { name: "DeepSeek V3.1", logo: DEEPSEEK },
  { name: "GPT-5 (max)", logo: GPT },
  { name: "Claude Opus 4.7", logo: CLAUDE },
  { name: "Kimi K2 (max)", logo: KIMI },
  { name: "Mistral Medium 3", logo: MISTRAL },
  { name: "Qwen3 32B", logo: QWEN },
  { name: "Gemini 2.5 Flash", logo: GEMINI },
  { name: "GPT-4o (max)", logo: GPT },
  { name: "DeepSeek V3", logo: DEEPSEEK },
  { name: "Claude Sonnet 4", logo: CLAUDE },
  { name: "Grok 3", logo: GROK },
  { name: "GLM-4.6", logo: ZAI },
  { name: "Gemini 2.0 Flash", logo: GEMINI },
  { name: "Qwen2.5 72B", logo: QWEN },
  { name: "GPT-4 Turbo", logo: GPT },
  { name: "Llama 3.3 70B", logo: META },
  { name: "Cohere Command R+", logo: COHERE },
  { name: "Phi-4 (medium)", logo: MICROSOFT },
  { name: "DBRX 132B", logo: DBRX },
  { name: "Yi-1.5 34B", logo: ZEROONE },
  { name: "Mistral Small 3", logo: MISTRAL },
  { name: "Gemini 1.5 Pro", logo: GEMINI },
  { name: "DeepSeek R1", logo: DEEPSEEK },
  { name: "Qwen2.5 32B", logo: QWEN },
  { name: "GPT-4", logo: GPT },
  { name: "Claude 3.5 Sonnet", logo: CLAUDE },
  { name: "Grok 2", logo: GROK },
  { name: "GLM-4", logo: ZAI },
  { name: "Kimi K1.5", logo: KIMI },
  { name: "Llama 3.2 40B", logo: META },
  { name: "Mistral Nemo", logo: MISTRAL },
  { name: "Gemini 1.5 Flash", logo: GEMINI },
  { name: "Cohere Command R", logo: COHERE_CIRCLE },
  { name: "Phi-3.5", logo: MICROSOFT },
  { name: "Solar Pro 2", logo: UPSTAGE },
  { name: "Qwen2.5 14B", logo: QWEN },
  { name: "Llama 3.1 8B", logo: META },
  { name: "Mistral 7B", logo: MISTRAL },
  { name: "Gemma 2 27B", logo: GEMINI_CIRCLE },
];

const MIDDLE_ROWS = MIDDLE_NAMES.map((m, i) => {
  const rank = 27 + i;
  const intelligence = +(33.8 - i * 0.405).toFixed(1);
  const programming = +(65 - i * 0.52 + Math.sin(i * 1.3) * 2.5).toFixed(1);
  const agentic = +(32 - i * 0.42 + Math.cos(i * 0.8) * 2).toFixed(1);
  return {
    rank,
    name: m.name,
    subtitle: m.subtitle || "",
    logo: m.logo,
    intelligence,
    programming: Math.max(5, programming),
    agentic: Math.max(0.1, agentic),
  };
});

const TAIL_ROWS = [
  { rank: 87, name: "Llama 4 Maverick", subtitle: "", logo: META, intelligence: 9.3, programming: 16.3, agentic: 0.6 },
  { rank: 88, name: "gpt-oss-20b (high)", subtitle: "", logo: GPT, intelligence: 9.0, programming: 20.7, agentic: 1.4 },
  { rank: 89, name: "NVIDIA Nemotron 3 Nano 30B A3B", subtitle: "Reasoning", logo: NVIDIA, intelligence: 8.9, programming: 14.4, agentic: 1.0 },
  { rank: 90, name: "DeepSeek V3", subtitle: "Dec '24", logo: DEEPSEEK, intelligence: 8.5, programming: 23.0, agentic: 0.8 },
  { rank: 91, name: "Devstral Small 2", subtitle: "", logo: MISTRAL, intelligence: 8.4, programming: 29.3, agentic: 4.8 },
  { rank: 92, name: "Solar Pro 3", subtitle: "", logo: UPSTAGE, intelligence: 7.8, programming: 16.2, agentic: 1.4 },
  { rank: 93, name: "Mistral Small 3.1", subtitle: "", logo: MISTRAL, intelligence: 7.4, programming: 26.3, agentic: 2.1 },
  { rank: 94, name: "Qwen3 32B (Reasoning)", subtitle: "", logo: QWEN, intelligence: 7.2, programming: 15.3, agentic: 0.9 },
  { rank: 95, name: "Llama 4 Scout", subtitle: "", logo: META, intelligence: 6.5, programming: 8.2, agentic: 0.5 },
  { rank: 96, name: "Qwen3 14B (Reasoning)", subtitle: "", logo: QWEN, intelligence: 6.4, programming: 13.8, agentic: 0.9 },
  { rank: 97, name: "Ministral 3 14B", subtitle: "", logo: MISTRAL, intelligence: 6.0, programming: 14.4, agentic: 1.1 },
  { rank: 98, name: "Ministral 3 8B", subtitle: "", logo: MISTRAL, intelligence: 5.5, programming: 9.7, agentic: 0.6 },
  { rank: 99, name: "Qwen3 8B (Reasoning)", subtitle: "", logo: QWEN, intelligence: 5.2, programming: 9.0, agentic: 0.8 },
  { rank: 100, name: "Gemma 3 27B Instruct", subtitle: "", logo: GEMINI_CIRCLE, intelligence: 4.9, programming: 10.1, agentic: 0.1 },
];

const BRAND_COLORS = {
  [CLAUDE]: "#D97757",
  [QWEN]: "#615CED",
  [GPT]: "#10A37F",
  [GROK]: "#2D2D2D",
  [GEMINI]: "#4285F4",
  [DEEPSEEK]: "#4D6BFA",
  [ZAI]: "#3B5BFE",
  [KIMI]: "#0B0B0B",
  [META]: "#0866FF",
  [MISTRAL]: "#FA520F",
  [COHERE]: "#39594D",
  [MICROSOFT]: "#00A4EF",
  [NVIDIA]: "#76B900",
  [DBRX]: "#FF3621",
  [UPSTAGE]: "#003D7A",
  [ZEROONE]: "#1A1A1A",
  [TENCENT]: "#0052D9",
  [XIAOMI]: "#FF6900",
};

export function getBrandColor(logo) {
  if (logo?.type === "circle") return logo.color;
  return BRAND_COLORS[logo] || "#4a4a4a";
}

export const QUALITY_MODELS = [...KNOWN_ROWS, ...MIDDLE_ROWS, ...TAIL_ROWS];
export const QUALITY_TOP10 = QUALITY_MODELS.slice(0, 10);
export const QUALITY_TOP3 = QUALITY_MODELS.slice(0, 3);

export const METRIC_OPTIONS = [
  { id: "intelligence", labelKey: "ranking.metricIntelligence" },
  { id: "programming", labelKey: "ranking.metricProgramming" },
  { id: "agentic", labelKey: "ranking.metricAgentic" },
];

export const SOURCE_OPTIONS = [
  { id: "artificial_analysis", label: "Artificial Analysis" },
];