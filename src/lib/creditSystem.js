// Sistema unificado de créditos do Zyntra
// Cada mensagem/imagem/áudio consome créditos diferentes por modelo

// Multiplicadores de crédito por modelo de texto
// Créditos = tokens_consumidos × multiplicador
export const TEXT_CREDIT_MULTIPLIERS = {
  auto: 1.0,
  gemini: 0.8,
  deepseek: 0.6,
  gpt: 1.2,
  gpt5: 1.5,
  claude: 1.3,
  grok: 1.25,
};

// Custos fixos por modelo de imagem (em créditos)
export const IMAGE_CREDIT_COSTS = {
  "gpt-image": 500,
  "gemini-image": 400,
  "claude-image": 600,
};

// Custos fixos por modelo de áudio (em créditos)
export const AUDIO_CREDIT_COSTS = {
  "fish-tts": 300,
  "minimax-tts": 350,
  "qwen-tts": 280,
  "qwen-flash-tts": 250,
  "deepgram-aura-tts": 200,
  "deepgram-flux-tts": 220,
  "microsoft-tts": 300,
  "fish-s2-pro-tts": 320,
};

export function calculateTextCredits(model, totalTokens) {
  const mult = TEXT_CREDIT_MULTIPLIERS[model] || TEXT_CREDIT_MULTIPLIERS.auto;
  return Math.max(1, Math.ceil(totalTokens * mult));
}

export function calculateImageCredits(model) {
  return IMAGE_CREDIT_COSTS[model] || 500;
}

export function calculateAudioCredits(model) {
  return AUDIO_CREDIT_COSTS[model] || 300;
}