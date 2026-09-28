import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { prompt, model = "auto", referenceImage } = body;

    if (!prompt) return Response.json({ error: "Prompt é obrigatório" }, { status: 400 });

    const result = await base44.asServiceRole.integrations.Core.GenerateImage({
      prompt,
      existing_image_urls: referenceImage ? [referenceImage] : undefined,
    });

    const imageUrl = result?.url;
    if (!imageUrl) return Response.json({ error: "Nenhuma imagem gerada" }, { status: 500 });

    return Response.json({ url: imageUrl, model: "generate-image" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}