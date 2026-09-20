import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { secrets } from 'base44:runtime';

const MODEL_MAP = {
  "gpt-image": "openai/gpt-image-1",
  "gemini-image": "google/gemini-2.5-flash-image",
  "claude-image": "google/gemini-2.5-flash-image",
  auto: "google/gemini-2.5-flash-image",
};

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { prompt, model = "auto", referenceImage } = body;

    if (!prompt) return Response.json({ error: "Prompt é obrigatório" }, { status: 400 });

    const apiKey = secrets.get("OPENROUTER_API_KEY");
    if (!apiKey) return Response.json({ error: "OPENROUTER_API_KEY não configurada" }, { status: 500 });

    const imageModel = MODEL_MAP[model] || MODEL_MAP.auto;

    const requestBody = {
      model: imageModel,
      prompt,
    };

    if (referenceImage) {
      requestBody.image_url = referenceImage;
    }

    const response = await fetch("https://openrouter.ai/api/v1/images", {
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
    const imageData = data.data?.[0];

    if (!imageData?.b64_json) {
      return Response.json({ error: "Nenhuma imagem retornada pela API" }, { status: 500 });
    }

    // Converte base64 para Blob
    const byteCharacters = atob(imageData.b64_json);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const mediaType = imageData.media_type || "image/png";
    const ext = mediaType.includes("svg") ? "svg" : "png";
    const blob = new Blob([byteArray], { type: mediaType });
    const file = new File([blob], `imagem-zyntra.${ext}`, { type: mediaType });

    // Faz upload para storage público
    const uploadResult = await base44.asServiceRole.integrations.Core.UploadPublicFile({ file });
    const imageUrl = uploadResult.file_url;

    return Response.json({ url: imageUrl, model: imageModel });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}