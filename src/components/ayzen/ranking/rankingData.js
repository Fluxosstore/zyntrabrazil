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
const POOLSIDE = `${LOBE}/poolside-color.png`;

// Generic colored circle for models without a known logo
function circle(letter, color) {
  return { type: "circle", letter, color };
}

export const RANKING_MODELS = [
  { rank: 1, name: "DeepSeek V4.1 Flash", vendor: "DeepSeek", logo: DEEPSEEK, tokens: "48,6 T", tokensNum: 48.6, share: 10.1 },
  { rank: 2, name: "DeepSeek V4 Flash 0423", vendor: "DeepSeek", logo: DEEPSEEK, tokens: "47,2 T", tokensNum: 47.2, share: 9.8 },
  { rank: 3, name: "Hy4 preview", vendor: "Tencent", logo: TENCENT, tokens: "41,7 T", tokensNum: 41.7, share: 8.6 },
  { rank: 4, name: "GLM 5.3 Flash", vendor: "Z.ai", logo: ZAI, tokens: "37,4 T", tokensNum: 37.4, share: 7.7 },
  { rank: 5, name: "MiMo-V2.5", vendor: "Xiaomi", logo: XIAOMI, tokens: "29,4 T", tokensNum: 29.4, share: 6.1 },
  { rank: 6, name: "Ox Alpha", vendor: "Ox", logo: circle("O", "#2E7D32"), tokens: "27,2 T", tokensNum: 27.2, share: 5.6 },
  { rank: 7, name: "Hy3", vendor: "Tencent", logo: TENCENT, tokens: "21,4 T", tokensNum: 21.4, share: 4.4 },
  { rank: 8, name: "DeepSeek V4 Flash 0423", vendor: "DeepSeek", logo: DEEPSEEK, tokens: "20,4 T", tokensNum: 20.4, share: 4.2 },
  { rank: 9, name: "Nemotron 3 Ultra (free)", vendor: "NVIDIA", logo: NVIDIA, tokens: "17,6 T", tokensNum: 17.6, share: 3.7 },
  { rank: 10, name: "DeepSeek V4.1 Flash", vendor: "DeepSeek", logo: DEEPSEEK, tokens: "12,5 T", tokensNum: 12.5, share: 2.6 },
  { rank: 11, name: "GLM 5.2", vendor: "Z.ai", logo: ZAI, tokens: "9,7 T", tokensNum: 9.7, share: 2.0 },
  { rank: 12, name: "GLM 5.3", vendor: "Z.ai", logo: ZAI, tokens: "9,0 T", tokensNum: 9.0, share: 1.9 },
  { rank: 13, name: "Gemini 3.7 Flash", vendor: "Google", logo: GEMINI, tokens: "8,3 T", tokensNum: 8.3, share: 1.7 },
  { rank: 14, name: "MiniMax M3", vendor: "MiniMax", logo: MINIMAX, tokens: "8,2 T", tokensNum: 8.2, share: 1.7 },
  { rank: 15, name: "GPT-5.6 Sol", vendor: "OpenAI", logo: GPT, tokens: "7,4 T", tokensNum: 7.4, share: 1.5 },
  { rank: 16, name: "Kimi K3", vendor: "MoonshotAI", logo: KIMI, tokens: "6,6 T", tokensNum: 6.6, share: 1.4 },
  { rank: 17, name: "MiniMax M3", vendor: "MiniMax", logo: MINIMAX, tokens: "6,1 T", tokensNum: 6.1, share: 1.3 },
  { rank: 18, name: "DeepSeek V4 Pro 0423", vendor: "DeepSeek", logo: DEEPSEEK, tokens: "6,0 T", tokensNum: 6.0, share: 1.2 },
  { rank: 19, name: "Claude Opus 5", vendor: "Anthropic", logo: CLAUDE, tokens: "6,0 T", tokensNum: 6.0, share: 1.2 },
  { rank: 20, name: "Claude Sonnet 5", vendor: "Anthropic", logo: CLAUDE, tokens: "5,5 T", tokensNum: 5.5, share: 1.1 },
  { rank: 21, name: "Laguna S 2.1 (free)", vendor: "Poolside", logo: POOLSIDE, tokens: "5,4 T", tokensNum: 5.4, share: 1.1 },
  { rank: 22, name: "Gemini 3.8 Flash", vendor: "Google", logo: GEMINI, tokens: "5,1 T", tokensNum: 5.1, share: 1.0 },
  { rank: 23, name: "Solar Pro 4", vendor: "Upstage", logo: UPSTAGE, tokens: "4,8 T", tokensNum: 4.8, share: 1.0 },
  { rank: 24, name: "DeepSeek V4 Pro 0423", vendor: "DeepSeek", logo: DEEPSEEK, tokens: "4,4 T", tokensNum: 4.4, share: 0.9 },
  { rank: 25, name: "Muse Spark 1.3 Contributor", vendor: "Meta", logo: META, tokens: "4,1 T", tokensNum: 4.1, share: 0.8 },
  { rank: 26, name: "Nemotron 3.5 Lightning (free)", vendor: "NVIDIA", logo: NVIDIA, tokens: "3,8 T", tokensNum: 3.8, share: 0.8 },
  { rank: 27, name: "Gemini 3 Flash Preview", vendor: "Google", logo: GEMINI, tokens: "3,4 T", tokensNum: 3.4, share: 0.7 },
  { rank: 28, name: "Claude 4.6 Sonnet", vendor: "Anthropic", logo: CLAUDE, tokens: "3,2 T", tokensNum: 3.2, share: 0.7 },
  { rank: 29, name: "Gemini 2.5 Flash Lite", vendor: "Google", logo: GEMINI, tokens: "3,2 T", tokensNum: 3.2, share: 0.7 },
  { rank: 30, name: "Ling 3.0 Flash Fin (free)", vendor: "inclusionAI", logo: circle("L", "#10B981"), tokens: "2,6 T", tokensNum: 2.6, share: 0.5 },
  { rank: 31, name: "GPT-5.6 Terra", vendor: "OpenAI", logo: GPT, tokens: "2,4 T", tokensNum: 2.4, share: 0.5 },
  { rank: 32, name: "gpt-oss-120b", vendor: "OpenAI", logo: GPT, tokens: "2,2 T", tokensNum: 2.2, share: 0.5 },
  { rank: 33, name: "GPT-6 Astra", vendor: "OpenAI", logo: GPT, tokens: "2,1 T", tokensNum: 2.1, share: 0.4 },
  { rank: 34, name: "Gemini 2.5 Flash", vendor: "Google", logo: GEMINI, tokens: "1,9 T", tokensNum: 1.9, share: 0.4 },
  { rank: 35, name: "Gemini 3.1 Flash Lite", vendor: "Google", logo: GEMINI, tokens: "1,9 T", tokensNum: 1.9, share: 0.4 },
  { rank: 36, name: "DeepSeek V3.2", vendor: "DeepSeek", logo: DEEPSEEK, tokens: "1,8 T", tokensNum: 1.8, share: 0.4 },
  { rank: 37, name: "Grok 4 Heavy", vendor: "xAI", logo: GROK, tokens: "1,6 T", tokensNum: 1.6, share: 0.3 },
  { rank: 38, name: "Claude 4.5 Opus", vendor: "Anthropic", logo: CLAUDE, tokens: "1,5 T", tokensNum: 1.5, share: 0.3 },
  { rank: 39, name: "Gemini 2.5 Pro", vendor: "Google", logo: GEMINI, tokens: "1,4 T", tokensNum: 1.4, share: 0.3 },
  { rank: 40, name: "GPT-5.4 Mini", vendor: "OpenAI", logo: GPT, tokens: "1,3 T", tokensNum: 1.3, share: 0.3 },
  { rank: 41, name: "DeepSeek V3.1", vendor: "DeepSeek", logo: DEEPSEEK, tokens: "1,2 T", tokensNum: 1.2, share: 0.2 },
  { rank: 42, name: "Mistral Large 2", vendor: "Mistral", logo: MISTRAL, tokens: "1,1 T", tokensNum: 1.1, share: 0.2 },
  { rank: 43, name: "Cohere Command R+", vendor: "Cohere", logo: COHERE, tokens: "1,0 T", tokensNum: 1.0, share: 0.2 },
  { rank: 44, name: "Qwen 3 Max", vendor: "Alibaba", logo: QWEN, tokens: "0,9 T", tokensNum: 0.9, share: 0.2 },
  { rank: 45, name: "Llama 4 Maverick", vendor: "Meta", logo: META, tokens: "0,9 T", tokensNum: 0.9, share: 0.2 },
  { rank: 46, name: "Grok 4", vendor: "xAI", logo: GROK, tokens: "0,8 T", tokensNum: 0.8, share: 0.2 },
  { rank: 47, name: "GPT-5 Mini", vendor: "OpenAI", logo: GPT, tokens: "0,8 T", tokensNum: 0.8, share: 0.2 },
  { rank: 48, name: "Claude 3.5 Haiku", vendor: "Anthropic", logo: CLAUDE, tokens: "0,7 T", tokensNum: 0.7, share: 0.1 },
  { rank: 49, name: "Gemini 2.0 Flash", vendor: "Google", logo: GEMINI, tokens: "0,7 T", tokensNum: 0.7, share: 0.1 },
  { rank: 50, name: "DeepSeek R1", vendor: "DeepSeek", logo: DEEPSEEK, tokens: "0,6 T", tokensNum: 0.6, share: 0.1 },
  { rank: 51, name: "Mistral Medium 3", vendor: "Mistral", logo: MISTRAL, tokens: "0,6 T", tokensNum: 0.6, share: 0.1 },
  { rank: 52, name: "Kimi K2", vendor: "MoonshotAI", logo: KIMI, tokens: "0,5 T", tokensNum: 0.5, share: 0.1 },
  { rank: 53, name: "GLM 4.6", vendor: "Z.ai", logo: ZAI, tokens: "0,5 T", tokensNum: 0.5, share: 0.1 },
  { rank: 54, name: "Command R+ 08", vendor: "Cohere", logo: COHERE, tokens: "0,5 T", tokensNum: 0.5, share: 0.1 },
  { rank: 55, name: "Qwen 3 235B", vendor: "Alibaba", logo: QWEN, tokens: "0,4 T", tokensNum: 0.4, share: 0.1 },
  { rank: 56, name: "Llama 4 Scout", vendor: "Meta", logo: META, tokens: "0,4 T", tokensNum: 0.4, share: 0.1 },
  { rank: 57, name: "Grok 3", vendor: "xAI", logo: GROK, tokens: "0,4 T", tokensNum: 0.4, share: 0.1 },
  { rank: 58, name: "GPT-4o", vendor: "OpenAI", logo: GPT, tokens: "0,4 T", tokensNum: 0.4, share: 0.1 },
  { rank: 59, name: "Claude 3 Opus", vendor: "Anthropic", logo: CLAUDE, tokens: "0,3 T", tokensNum: 0.3, share: 0.1 },
  { rank: 60, name: "Gemini 1.5 Pro", vendor: "Google", logo: GEMINI, tokens: "0,3 T", tokensNum: 0.3, share: 0.1 },
  { rank: 61, name: "DeepSeek V3", vendor: "DeepSeek", logo: DEEPSEEK, tokens: "0,3 T", tokensNum: 0.3, share: 0.1 },
  { rank: 62, name: "Mistral Small 3", vendor: "Mistral", logo: MISTRAL, tokens: "0,3 T", tokensNum: 0.3, share: 0.1 },
  { rank: 63, name: "Phi-4", vendor: "Microsoft", logo: MICROSOFT, tokens: "0,2 T", tokensNum: 0.2, share: 0.0 },
  { rank: 64, name: "Yi-1.5 34B", vendor: "01.AI", logo: ZEROONE, tokens: "0,2 T", tokensNum: 0.2, share: 0.0 },
  { rank: 65, name: "DBRX 132B", vendor: "Databricks", logo: DBRX, tokens: "0,2 T", tokensNum: 0.2, share: 0.0 },
  { rank: 66, name: "Mistral Nemo", vendor: "Mistral", logo: MISTRAL, tokens: "357,2 B", tokensNum: 0.357, share: 0.1 },
  { rank: 67, name: "Muse Spark 1.3", vendor: "Meta", logo: META, tokens: "320,0 B", tokensNum: 0.320, share: 0.1 },
  { rank: 68, name: "GPT-5.5", vendor: "OpenAI", logo: GPT, tokens: "268,5 B", tokensNum: 0.269, share: 0.1 },
  { rank: 69, name: "Claude 4.7 Opus", vendor: "Anthropic", logo: CLAUDE, tokens: "242,4 B", tokensNum: 0.242, share: 0.1 },
  { rank: 70, name: "GPT-5 Mini 2025-08-07", vendor: "OpenAI", logo: GPT, tokens: "184,8 B", tokensNum: 0.185, share: 0.0 },
  { rank: 71, name: "North Mini Code (free)", vendor: "Cohere", logo: COHERE, tokens: "183,8 B", tokensNum: 0.184, share: 0.0 },
  { rank: 72, name: "MiniMax M2.7", vendor: "MiniMax", logo: MINIMAX, tokens: "158,9 B", tokensNum: 0.159, share: 0.0 },
  { rank: 73, name: "Kimi K2.6", vendor: "MoonshotAI", logo: KIMI, tokens: "142,5 B", tokensNum: 0.143, share: 0.0 },
  { rank: 74, name: "Gemini 3.5 Flash Lite", vendor: "Google", logo: GEMINI, tokens: "123,7 B", tokensNum: 0.124, share: 0.0 },
  { rank: 75, name: "Claude 4.6 Opus", vendor: "Anthropic", logo: CLAUDE, tokens: "53,4 B", tokensNum: 0.053, share: 0.0 },
  { rank: 76, name: "Claude 4.5 Sonnet", vendor: "Anthropic", logo: CLAUDE, tokens: "45,6 B", tokensNum: 0.046, share: 0.0 },
  { rank: 77, name: "Muse Spark 1.2", vendor: "Meta", logo: META, tokens: "45,0 B", tokensNum: 0.045, share: 0.0 },
  { rank: 78, name: "Gemini 3.5 Flash", vendor: "Google", logo: GEMINI, tokens: "26,2 B", tokensNum: 0.026, share: 0.0 },
  { rank: 79, name: "GPT-5.4", vendor: "OpenAI", logo: GPT, tokens: "26,0 B", tokensNum: 0.026, share: 0.0 },
  { rank: 80, name: "GPT-5.6 Sol Pro", vendor: "OpenAI", logo: GPT, tokens: "21,1 B", tokensNum: 0.021, share: 0.0 },
];

// Chart time-series data (mock daily values, 26 days: 23 ago - 17 set)
const CHART_LABELS = [
  "23 de ago.", "24", "25", "26", "27", "28", "29", "30", "31",
  "1 de set.", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17 de set.",
];

const CHART_COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#F59E0B", "#10B981", "#94A3B8"];

export const CHART_SERIES = [
  { key: "deepseek_flash", name: "DeepSeek V4.1 Flash", color: CHART_COLORS[0] },
  { key: "deepseek_0423", name: "DeepSeek V4 Flash 0423", color: CHART_COLORS[1] },
  { key: "nemotron", name: "Nemotron 3 Ultra (free)", color: CHART_COLORS[2] },
  { key: "gpt_luna", name: "GPT-5.6 Luna", color: CHART_COLORS[3] },
  { key: "outros", name: "Outros", color: CHART_COLORS[5] },
  { key: "ox_alpha", name: "Ox Alpha", color: CHART_COLORS[4] },
  { key: "hy3", name: "Hy3", color: "#0EA5E9" },
  { key: "hy4", name: "Hy4 preview", color: "#0066CC" },
  { key: "mimo", name: "MiMo-V2.5", color: "#FF6900" },
  { key: "glm", name: "GLM 5.3 Flash", color: "#7C3AED" },
];

// Generate mock chart data with some variation
function genChart() {
  const data = [];
  for (let i = 0; i < CHART_LABELS.length; i++) {
    const row = { date: CHART_LABELS[i] };
    CHART_SERIES.forEach((s, idx) => {
      const base = [18, 16, 8, 6, 12, 5, 4, 9, 7, 8][idx] || 3;
      const wave = Math.sin(i * 0.4 + idx) * 2;
      row[s.key] = Math.max(0, base + wave + (Math.random() - 0.5) * 1.5);
    });
    data.push(row);
  }
  return data;
}

export const CHART_DATA = genChart();

export const TOP3 = RANKING_MODELS.slice(0, 3);