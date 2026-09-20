import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { secrets } from 'base44:runtime';

// Mapeia modelos visíveis do site para modelos do OpenRouter
const MODEL_MAP = {
  auto: "openai/gpt-4o-mini",
  deepseek: "deepseek/deepseek-chat-v3-0324:free",
  gemini: "google/gemini-2.5-pro",
  gpt: "openai/gpt-4o",
  gpt5: "openai/gpt-4o",
  claude: "anthropic/claude-sonnet-4.5",
  grok: "x-ai/grok-4",
};

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { prompt, model = "auto", useWebSearch = false, fileUrls = [] } = body;

    if (!prompt) return Response.json({ error: "Prompt é obrigatório" }, { status: 400 });

    let openrouterModel = MODEL_MAP[model] || MODEL_MAP.auto;

    // OpenRouter suporta busca web com sufixo :online
    if (useWebSearch) {
      openrouterModel = openrouterModel + ":online";
    }

    const apiKey = secrets.get("OPENROUTER_API_KEY");
    if (!apiKey) return Response.json({ error: "OPENROUTER_API_KEY não configurada" }, { status: 500 });

    // Constrói conteúdo multimodal se houver imagens
    let messageContent;
    const imageUrls = (fileUrls || []).filter((u) =>
      u.match(/\.(png|jpg|jpeg|gif|webp|bmp|svg)$/i)
    );

    if (imageUrls.length > 0) {
      messageContent = [
        { type: "text", text: prompt },
        ...imageUrls.map((url) => ({
          type: "image_url",
          image_url: { url },
        })),
      ];
    } else {
      messageContent = prompt;
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: openrouterModel,
        messages: [{ role: "user", content: messageContent }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return Response.json({ error: `OpenRouter error: ${errText}` }, { status: 500 });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    return Response.json({ content, model: openrouterModel });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}