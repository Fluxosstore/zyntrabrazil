const IMAGE_INTENT_KEYWORDS = [
  "gerar imagem",
  "gerar foto",
  "criar imagem",
  "criar foto",
  "desenhar",
  "gerar uma imagem",
  "gera uma imagem",
  "gere uma imagem",
  "generate image",
  "create image",
  "draw ",
  "make an image",
  "gerar imagem de",
  "criar imagem de",
  "desenhar um",
  "fazer uma imagem",
  "fazer imagem",
  "make image",
  "ilustrar",
  "illustrate",
  "render image",
  "renderizar",
  "gerar uma foto",
  "criar uma foto",
  "gerar ilustração",
  "criar ilustração",
];

export function isImageGenerationIntent(text) {
  if (!text) return false;
  const lower = text.toLowerCase().trim();
  return IMAGE_INTENT_KEYWORDS.some((kw) => lower.includes(kw));
}

// Mapeia modelos visíveis do site para modelos reais da integração nativa InvokeLLM
export const REAL_MODEL_MAP = {
  auto: "automatic",
  deepseek: "gemini_3_flash",
  gemini: "gemini_3_1_pro",
  gpt: "gpt_5_4",
  gpt5: "gpt_5_6_sol",
  claude: "claude_sonnet_4_6",
  grok: "claude_sonnet_4_6",
};

// Apenas gemini_3_flash e gemini_3_1_pro suportam busca na web
export function getRealModel(visibleModelId, useWebSearch = false) {
  let realModel = REAL_MODEL_MAP[visibleModelId] || "automatic";
  if (useWebSearch && realModel !== "gemini_3_flash" && realModel !== "gemini_3_1_pro") {
    realModel = "gemini_3_flash";
  }
  return realModel;
}

// Converte array de mensagens (chat history) em um prompt de texto único para InvokeLLM
export function messagesToPrompt(messages) {
  return messages
    .map((m) => {
      if (typeof m.content === "string") {
        return `${m.role === "user" ? "Usuário" : "Assistente"}: ${m.content}`;
      }
      if (Array.isArray(m.content)) {
        const textPart = m.content.find((c) => c.type === "text")?.text || "";
        return `${m.role === "user" ? "Usuário" : "Assistente"}: ${textPart}`;
      }
      return "";
    })
    .join("\n\n");
}