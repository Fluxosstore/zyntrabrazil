import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { secrets } from 'base44:runtime';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const { modality = "text" } = body;

    const apiKey = secrets.get("OPENROUTER_API_KEY");

    const response = await fetch("https://openrouter.ai/api/v1/models", {
      headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : {},
    });

    if (!response.ok) {
      const errText = await response.text();
      return Response.json({ error: `OpenRouter error: ${errText}` }, { status: 500 });
    }

    const data = await response.json();
    let models = data.data || [];

    // Filtrar por modalidade
    if (modality === "vision") {
      models = models.filter((m) =>
        m.architecture?.input_modalities?.includes("image")
      );
    } else if (modality === "image") {
      models = models.filter((m) =>
        m.architecture?.output_modalities?.includes("image")
      );
    } else if (modality === "audio") {
      models = models.filter((m) =>
        m.architecture?.input_modalities?.includes("audio") ||
        m.architecture?.output_modalities?.includes("audio")
      );
    } else if (modality === "tools") {
      models = models.filter((m) =>
        m.supported_parameters?.includes("tools")
      );
    }

    // Ordenar por janela de contexto (maior primeiro)
    models.sort((a, b) => (b.context_length || 0) - (a.context_length || 0));

    // Limitar aos top 80
    const ranked = models.slice(0, 80).map((m, i) => ({
      rank: i + 1,
      name: m.name || m.id,
      vendor: m.id.split("/")[0],
      id: m.id,
      contextLength: m.context_length || 0,
      promptPrice: parseFloat(m.pricing?.prompt || "0"),
      completionPrice: parseFloat(m.pricing?.completion || "0"),
    }));

    return Response.json({ models: ranked, modality, total: models.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}