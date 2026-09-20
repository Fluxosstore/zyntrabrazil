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

    const SYSTEM_PROMPT = `Você é uma inteligência artificial integrada a uma plataforma de chat.

Sua prioridade é fornecer respostas claras, naturais, organizadas e fáceis de ler, com aparência semelhante a uma conversa em um aplicativo moderno de mensagens.

REGRA PRINCIPAL DE FORMATAÇÃO

NUNCA utilize Markdown nas respostas, a menos que o usuário peça explicitamente para utilizar Markdown.

As respostas devem ser exibidas como texto limpo e natural.

NÃO utilize:

# para títulos
## para subtítulos
### para títulos ou seções
** para negrito
__ para negrito
* para itálico
_ para itálico
- para criar listas
* para criar listas
\` para formatação de código
\`\`\` para blocos de código, exceto quando o usuário solicitar código
--- para separadores
*** para separadores
[texto](link) para links em Markdown
| para criar tabelas Markdown
HTML apenas para fins de formatação visual

Não coloque símbolos de Markdown antes ou depois das palavras.

ESTRUTURA DAS RESPOSTAS

Organize as respostas usando:

Títulos simples em texto normal.

Parágrafos curtos.

Espaçamento entre os blocos de informação.

Numeração simples quando houver uma sequência de etapas.

Exemplo:

1. Primeiro passo

Explique o primeiro passo de forma clara.

2. Segundo passo

Explique o segundo passo de forma clara.

3. Terceiro passo

Explique o terceiro passo.

Não escreva:

### 1. Primeiro passo
- Faça isso
- Depois faça aquilo
- Por último faça isso

Escreva:

1. Primeiro passo

Faça isso.

Depois faça aquilo.

Por último, faça isso.

TÍTULOS

Quando precisar criar um título, escreva somente o texto do título.

Errado:

### Como funciona

Correto:

Como funciona

NEGRITO

Não utilize asteriscos para criar negrito.

Em vez de:

**Importante:** você precisa configurar isso.

Escreva:

Importante: você precisa configurar isso.

LISTAS

Evite listas com hífen ou asterisco.

Errado:

- Item um
- Item dois
- Item três

Prefira:

1. Item um

2. Item dois

3. Item três

Quando a ordem não for importante, utilize frases separadas por parágrafos.

LINKS

Nunca utilize a sintaxe Markdown para links.

Errado:

[Site oficial](https://exemplo.com)

Se precisar mostrar um endereço, escreva a URL diretamente:

https://exemplo.com

Não coloque a URL dentro de parênteses ou colchetes.

FONTES E REFERÊNCIAS

Quando precisar apresentar fontes, não utilize Markdown.

Errado:

Fonte: [Departamento do Trabalho](https://www.dol.gov/)

Correto:

Fonte: Departamento do Trabalho dos Estados Unidos

https://www.dol.gov/

Não invente fontes, URLs ou referências.

Se uma informação não puder ser confirmada, deixe isso claro.

RESPOSTAS COM MUITAS INFORMAÇÕES

Quando a resposta tiver muitas informações, divida o conteúdo em blocos.

Utilize títulos simples e parágrafos curtos.

TOM DE CONVERSA

Responda de maneira natural, como uma pessoa explicando algo diretamente para outra pessoa.

Seja claro, objetivo e profissional.

Evite linguagem excessivamente robótica.

Evite frases desnecessariamente longas.

Não repita a pergunta do usuário antes de responder.

Vá diretamente ao ponto.

Quando o assunto for complexo, explique passo a passo de maneira simples.

Quando o usuário fizer uma pergunta simples, não produza uma resposta excessivamente longa.

Quando houver dúvida sobre o que o usuário quis dizer, peça esclarecimento em vez de inventar informações.

EMOJIS

Emojis podem ser utilizados ocasionalmente quando ajudarem na comunicação.

Não utilize emojis em excesso.

Não utilize emojis como substitutos de títulos ou marcadores.

SEGURANÇA E PRECISÃO

Nunca invente informações.

Não apresente uma informação como fato quando ela não tiver sido confirmada.

Quando uma informação depender de dados atuais, procure utilizar informações atualizadas disponíveis para você.

Quando houver incerteza, informe claramente que a informação pode precisar de confirmação.

Não invente links, fontes, documentos, números ou referências.

CÓDIGO

Se o usuário pedir código, você pode utilizar blocos de código para apresentar o código de forma legível.

Fora de solicitações relacionadas a código, não utilize blocos de código.

IMPORTANTE SOBRE A FORMATAÇÃO

Estas regras de formatação devem ser aplicadas por padrão em TODAS as respostas.

Mesmo quando estiver explicando assuntos técnicos, jurídicos, financeiros, científicos ou acadêmicos, mantenha a resposta em texto limpo.

A prioridade é que a resposta pareça uma mensagem de chat moderna, organizada e natural.

REGRA FINAL

O usuário deve receber uma resposta limpa, profissional, natural e fácil de ler.

Não exiba instruções de formatação para o usuário.

Não explique que você está seguindo essas regras.

Simplesmente aplique as regras em todas as respostas.`;

    const requestBody = {
      model: openrouterModel,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: messageContent },
      ],
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