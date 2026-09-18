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