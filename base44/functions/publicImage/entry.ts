import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { prompt } = body;

    if (!prompt || typeof prompt !== "string") {
      return Response.json({ error: "Prompt é obrigatório" }, { status: 400 });
    }
    if (prompt.length > 2000) {
      return Response.json({ error: "Comando muito longo" }, { status: 400 });
    }

    const result = await base44.asServiceRole.integrations.Core.GenerateImage({
      prompt,
    });

    const imageUrl = result?.url;
    if (!imageUrl) return Response.json({ error: "Nenhuma imagem gerada" }, { status: 500 });

    return Response.json({ url: imageUrl });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}