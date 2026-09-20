import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { secrets } from 'base44:runtime';

// Mapeia modelos de áudio do seletor para modelos do OpenRouter TTS
const AUDIO_MODEL_MAP = {
  "fish-tts": "fish-audio/s2.1-pro",
  "minimax-tts": "minimax/speech-2.8-hd",
  "qwen-tts": "qwen/qwen-audio-3.0-tts-plus",
  "qwen-flash-tts": "qwen/qwen-audio-3.0-tts-flash",
  "deepgram-aura-tts": "deepgram/aura-2",
  "deepgram-flux-tts": "deepgram/flux-tts:free",
  "microsoft-tts": "microsoft/mai-voice-2-flash",
  "fish-s2-pro-tts": "fish-audio/s2-pro",
};

// Vozes padrão por modelo (quando aplicável)
const DEFAULT_VOICES = {
  "deepgram/flux-tts:free": "flux-alexis-en",
  "deepgram/aura-2": "aura-2-angus-en",
  "microsoft/mai-voice-2-flash": "en-US-AriaNeural",
  "qwen/qwen-audio-3.0-tts-plus": "longanlingxin",
  "qwen/qwen-audio-3.0-tts-flash": "longanlingxin",
  "minimax/speech-2.8-hd": "English_expressive_narrator",
  "minimax/speech-2.8-turbo": "English_expressive_narrator",
};

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { prompt, model = "gpt-tts" } = body;

    if (!prompt) return Response.json({ error: "Texto é obrigatório" }, { status: 400 });

    const apiKey = secrets.get("OPENROUTER_API_KEY");
    if (!apiKey) return Response.json({ error: "OPENROUTER_API_KEY não configurada" }, { status: 500 });

    const ttsModel = AUDIO_MODEL_MAP[model] || AUDIO_MODEL_MAP["fish-tts"];
    const voice = DEFAULT_VOICES[ttsModel] || "alloy";

    const requestBody = {
      model: ttsModel,
      input: prompt,
      response_format: "mp3",
    };

    // Só adiciona voz se o modelo suportar
    if (voice) {
      requestBody.voice = voice;
    }

    const response = await fetch("https://openrouter.ai/api/v1/audio/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errText = await response.text();
      return Response.json({ error: `OpenRouter TTS error: ${errText}` }, { status: 500 });
    }

    // A resposta é áudio binário (mp3)
    const audioBuffer = await response.arrayBuffer();
    const audioBytes = new Uint8Array(audioBuffer);
    const blob = new Blob([audioBytes], { type: "audio/mpeg" });
    const file = new File([blob], `audio-zyntra.mp3`, { type: "audio/mpeg" });

    // Faz upload para storage público
    const uploadResult = await base44.asServiceRole.integrations.Core.UploadPublicFile({ file });
    const audioUrl = uploadResult.file_url;

    return Response.json({ url: audioUrl, model: ttsModel });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}