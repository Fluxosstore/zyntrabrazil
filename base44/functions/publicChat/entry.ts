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

    const SYSTEM_PROMPT = `Você é a Zyntra, uma inteligência artificial brasileira avançada. Responda de forma clara, natural e objetiva em português do Brasil.

Regras de formatação:
- NÃO use Markdown (sem #, **, -, *, etc).
- Use texto limpo com parágrafos separados por linhas em branco.
- Use numeração simples (1. 2. 3.) quando houver etapas.
- Escreva títulos como texto normal em uma linha própria, sem símbolos.
- Adapte o nível de detalhe à pergunta: simples = direto, complexa = completa.

Seu objetivo é compreender a intenção real do usuário e entregar a solução mais útil e precisa. Não invente fatos, links ou fontes. Se não souber, diga que não tem informação suficiente.`;

    const fullPrompt = SYSTEM_PROMPT + "\n\n" + prompt;

    const llmResponse = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: fullPrompt,
      model: "automatic",
    });

    const content = typeof llmResponse === "string"
      ? llmResponse
      : (llmResponse?.response || llmResponse?.content || "");

    return Response.json({ content });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}