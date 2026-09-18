export function getConversationTitle(text) {
  if (!text) return "Nova conversa";
  const trimmed = text.trim();
  if (trimmed.length <= 40) return trimmed;
  const parts = trimmed.split(/[.!?]\s+/);
  const sentences = parts.map(s => s.trim()).filter(s => s);
  if (sentences.length === 0) return trimmed.substring(0, 40) + "...";
  if (sentences[0].length <= 50) return sentences[0];
  if (sentences[1] && sentences[1].length <= 50) return sentences[1];
  const shortest = sentences.reduce((a, b) => (a.length <= b.length ? a : b));
  if (shortest.length <= 50) return shortest;
  return sentences[0].substring(0, 40) + "...";
}