import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { prompt, model = "fish-tts" } = body;

    if (!prompt) return Response.json({ error: "Texto é obrigatório" }, { status: 400 });

    const result = await base44.asServiceRole.integrations.Core.GenerateSpeech({
      text: prompt,
      language_code: "pt",
    });

    const audioUrl = result?.url;
    if (!audioUrl) return Response.json({ error: "Nenhum áudio gerado" }, { status: 500 });

    return Response.json({ url: audioUrl, model: "generate-speech" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}