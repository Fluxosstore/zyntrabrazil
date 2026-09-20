import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { secrets } from 'base44:runtime';

// Mapeia modelos visíveis do site para modelos do OpenRouter
const MODEL_MAP = {
  auto: "openai/gpt-4o-mini",
  deepseek: "deepseek/deepseek-chat-v3-0324",
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
    const {
      prompt,
      model = "auto",
      useWebSearch = false,
      fileUrls = [],
      reasoning = 50,
      saveMemories = false,
      useMemories = false,
    } = body;

    if (!prompt) return Response.json({ error: "Prompt é obrigatório" }, { status: 400 });

    let openrouterModel = MODEL_MAP[model] || MODEL_MAP.auto;

    // OpenRouter suporta busca web com sufixo :online
    if (useWebSearch) {
      openrouterModel = openrouterModel + ":online";
    }

    const apiKey = secrets.get("OPENROUTER_API_KEY");
    if (!apiKey) return Response.json({ error: "OPENROUTER_API_KEY não configurada" }, { status: 500 });

    // Buscar memórias do usuário se useMemories estiver ativo
    let contextPrompt = prompt;
    if (useMemories) {
      try {
        const memories = await base44.entities.Memory.list();
        if (memories && memories.length > 0) {
          const memoryText = memories.map((m) => `- ${m.content}`).join("\n");
          contextPrompt = `Memórias sobre o usuário:\n${memoryText}\n\n${prompt}`;
        }
      } catch (e) {
        // Ignora erros de memória
      }
    }

    // Constrói conteúdo multimodal se houver imagens
    let messageContent;
    const imageUrls = (fileUrls || []).filter((u) =>
      u.match(/\.(png|jpg|jpeg|gif|webp|bmp|svg)$/i)
    );

    if (imageUrls.length > 0) {
      messageContent = [
        { type: "text", text: contextPrompt },
        ...imageUrls.map((url) => ({
          type: "image_url",
          image_url: { url },
        })),
      ];
    } else {
      messageContent = contextPrompt;
    }

    // Mapear reasoning (0-100) para effort
    const reasoningEffort = reasoning < 34 ? "low" : reasoning < 67 ? "medium" : "high";

    const requestBody = {
      model: openrouterModel,
      messages: [{ role: "user", content: messageContent }],
    };

    // Só adiciona reasoning se for > 0
    if (reasoning > 0) {
      requestBody.reasoning = { effort: reasoningEffort };
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errText = await response.text();
      return Response.json({ error: `OpenRouter error: ${errText}` }, { status: 500 });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    // Salvar memórias se saveMemories estiver ativo
    if (saveMemories && content) {
      try {
        const memoryPrompt = `Analise a seguinte conversa e extraia fatos, preferências ou informações importantes sobre o usuário que valham a pena lembrar para conversas futuras. Responda apenas com os fatos extraídos, um por linha, sem numeração e sem prefixos. Se não houver nada relevante, responda apenas "NADA".

Conversa:
Usuário: ${prompt}
Assistente: ${content}`;

        const memResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: MODEL_MAP.auto,
            messages: [{ role: "user", content: memoryPrompt }],
          }),
        });

        if (memResponse.ok) {
          const memData = await memResponse.json();
          const memContent = memData.choices?.[0]?.message?.content || "";
          if (memContent && memContent.trim() !== "NADA") {
            const memoryLines = memContent.trim().split("\n").filter((line) => line.trim());
            for (const mem of memoryLines) {
              await base44.entities.Memory.create({ content: mem.trim() });
            }
          }
        }
      } catch (e) {
        // Ignora erros ao salvar memórias
      }
    }

    return Response.json({ content, model: openrouterModel });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}