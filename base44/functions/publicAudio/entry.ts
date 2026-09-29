import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { prompt } = body;

    if (!prompt || typeof prompt !== "string") {
      return Response.json({ error: "Texto é obrigatório" }, { status: 400 });
    }
    if (prompt.length > 2000) {
      return Response.json({ error: "Texto muito longo" }, { status: 400 });
    }

    const result = await base44.asServiceRole.integrations.Core.GenerateSpeech({
      text: prompt,
      language_code: "pt",
    });

    const audioUrl = result?.url;
    if (!audioUrl) return Response.json({ error: "Nenhum áudio gerado" }, { status: 500 });

    return Response.json({ url: audioUrl });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}