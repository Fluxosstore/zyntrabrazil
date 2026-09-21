// Biblioteca de conceitos do Codrax — mistura tech + IA
// Cada conceito: id, name, category, summary, content (explicação detalhada), related[]

export const CONCEPT_CATEGORIES = [
  { id: "all", label: "Todos" },
  { id: "frontend", label: "Frontend" },
  { id: "backend", label: "Backend" },
  { id: "ai", label: "Inteligência Artificial" },
  { id: "data", label: "Dados" },
  { id: "devops", label: "DevOps" },
  { id: "concepts", label: "Conceitos" },
];

export const CONCEPTS = [
  // ===== FRONTEND =====
  {
    id: "react",
    name: "React",
    category: "frontend",
    summary: "Biblioteca JavaScript para construir interfaces de usuário baseadas em componentes.",
    content: "React é uma biblioteca declarativa criada pelo Facebook (Meta) que usa componentes reutilizáveis para montar interfaces. Cada componente gerencia seu próprio estado e reage a mudanças re-renderizando apenas o necessário, graças ao Virtual DOM. Usa JSX (HTML dentro de JavaScript) e hooks como useState e useEffect para lógica. É a base do ecossistema Next.js, Remix e React Native.",
    related: ["hooks", "jsx", "virtual-dom"],
  },
  {
    id: "hooks",
    name: "Hooks",
    category: "frontend",
    summary: "Funções do React que permitem usar estado e ciclo de vida em componentes funcionais.",
    content: "Hooks são funções especiais (prefixadas com 'use') que dão a componentes funcionais acesso a recursos antes exclusivos de classes. useState gerencia estado local, useEffect lida com efeitos colaterais (fetch, subscriptions), useContext acessa contexto global, useMemo e useCallback otimizam performance. A regra de ouro: hooks só podem ser chamados no topo do componente, nunca em loops ou condicionais.",
    related: ["react", "state", "use-effect"],
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    category: "frontend",
    summary: "Framework CSS utility-first que usa classes pré-definidas para estilizar diretamente no HTML.",
    content: "Tailwind é um framework utility-first: em vez de escrever CSS customizado, você compõe estilos com classes como 'flex', 'pt-4', 'text-center', 'rotate-90'. Isso elimina a troca de contexto entre HTML e CSS, mantém o design consistente e reduz o tamanho do bundle final (purge de classes não usadas). Usa um sistema de design tokens configurável via tailwind.config.js.",
    related: ["css", "design-tokens", "responsive"],
  },
  {
    id: "jsx",
    name: "JSX",
    category: "frontend",
    summary: "Extensão de sintaxe que permite escrever HTML dentro de JavaScript.",
    content: "JSX é uma extensão de sintaxe que produz elementos React. Parece HTML mas é JavaScript: expressões vão em chaves {}, atributos usam camelCase (className em vez de class). É transformado em chamadas React.createElement pelo Babel/SWC. Permite lógica e marcação no mesmo arquivo, o que facilita raciocinar sobre a UI.",
    related: ["react", "babel", "components"],
  },

  // ===== BACKEND =====
  {
    id: "api",
    name: "API",
    category: "backend",
    summary: "Interface de programação que permite sistemas se comunicarem entre si.",
    content: "API (Application Programming Interface) define como diferentes softwares conversam. APIs REST usam HTTP (GET, POST, PUT, DELETE) e retornam JSON. GraphQL é uma alternativa flexível onde o cliente define exatamente quais campos quer. APIs podem ser públicas (Twitter API), internas (entre microserviços) ou de terceiros (Stripe, GitHub). Autenticação comum: API keys, OAuth2, JWT.",
    related: ["rest", "graphql", "oauth", "webhooks"],
  },
  {
    id: "rest",
    name: "REST",
    category: "backend",
    summary: "Padrão de arquitetura para APIs que usa verbos HTTP e recursos nomeados.",
    content: "REST (Representational State Transfer) é um estilo arquitetural para APIs web. Usa verbos HTTP semanticamente: GET (ler), POST (criar), PUT/PATCH (atualizar), DELETE (remover). Recursos são identificados por URLs (/users/123). Stateless — cada requisição contém tudo que o servidor precisa. Respostas geralmente em JSON com códigos de status HTTP (200, 201, 404, 500).",
    related: ["api", "http", "json"],
  },
  {
    id: "nodejs",
    name: "Node.js",
    category: "backend",
    summary: "Runtime de JavaScript no servidor, baseado no motor V8 do Chrome.",
    content: "Node.js permite executar JavaScript fora do navegador, no servidor. Usa o motor V8 do Chrome e um modelo assíncrono orientado a eventos (event loop), ideal para I/O intensivo. Acompanha npm, o maior repositório de pacotes do mundo. Frameworks populares: Express (minimalista), NestJS (opinionado, TypeScript), Fastify (performance).",
    related: ["npm", "express", "javascript"],
  },
  {
    id: "database",
    name: "Banco de Dados",
    category: "backend",
    summary: "Sistema que armazena, organiza e recupera dados de forma estruturada.",
    content: "Bancos de dados dividem-se em SQL (relacionais: PostgreSQL, MySQL, SQLite — tabelas, joins, ACID) e NoSQL (MongoDB, Redis, DynamoDB — documentos, chave-valor, grafos). Conceitos chave: índices (aceleram buscas), transações (atomicidade), normalização (evitar redundância), migrações (versionar schema). ORMs (Prisma, TypeORM) abstraem SQL em código.",
    related: ["sql", "nosql", "orm", "index"],
  },

  // ===== IA =====
  {
    id: "llm",
    name: "LLM",
    category: "ai",
    summary: "Large Language Model — modelo de IA treinado para entender e gerar texto humano.",
    content: "LLMs (Large Language Models) são modelos de IA treinados em vastos corpora de texto para prever a próxima palavra/token. Aprendem padrões, gramática, conhecimento factual e raciocínio emergente. Exemplos: GPT (OpenAI), Claude (Anthropic), Gemini (Google), Llama (Meta). Capacidades: geração de texto, tradução, sumarização, código, análise. Limitações: alucinações, janela de contexto finita, custo por token.",
    related: ["tokens", "prompt-engineering", "rag", "fine-tuning"],
  },
  {
    id: "tokens",
    name: "Tokens",
    category: "ai",
    summary: "Unidades básicas que um LLM processa — pedaços de palavras ou caracteres.",
    content: "Tokens são as unidades atômicas que um LLM lê e gera. Um token equivale a ~4 caracteres em inglês ou ~0.75 palavras. 'ChatGPT' pode virar ['Chat', 'G', 'PT']. Modelos têm uma janela de contexto (ex: 128k tokens) que limita quanto texto processam de uma vez. Custo é cobrado por token (input + output). Tokenizadores diferentes (BPE, SentencePiece) dividem texto de formas diferentes.",
    related: ["llm", "context-window", "pricing"],
  },
  {
    id: "prompt-engineering",
    name: "Prompt Engineering",
    category: "ai",
    summary: "Arte de estruturar instruções para extrair o melhor de um LLM.",
    content: "Prompt Engineering é o conjunto de técnicas para guiar LLMs a respostas melhores. Táticas: ser específico e dar contexto, usar exemplos (few-shot), definir o papel da IA ('Você é um especialista em...'), estruturar com seções (Contexto, Tarefa, Formato), encadear prompts (chain-of-thought), pedir JSON estruturado com response_json_schema. Prompts ruins geram respostas vagas; prompts bons geram precisão.",
    related: ["llm", "few-shot", "chain-of-thought", "system-prompt"],
  },
  {
    id: "rag",
    name: "RAG",
    category: "ai",
    summary: "Retrieval-Augmented Generation — combina busca de dados com geração de LLM.",
    content: "RAG (Retrieval-Augmented Generation) resolve o problema de LLMs não terem acesso a dados privados ou recentes. Fluxo: 1) Indexa documentos em um banco vetorial (embeddings). 2) Quando o usuário pergunta, busca os trechos mais relevantes. 3) Injeta esses trechos no prompt do LLM como contexto. 4) O LLM gera uma resposta fundamentada nesses trechos. Reduz alucinações e permite citar fontes.",
    related: ["embeddings", "vector-db", "llm", "retrieval"],
  },
  {
    id: "embeddings",
    name: "Embeddings",
    category: "ai",
    summary: "Representações vetoriais de texto que capturam significado semântico.",
    content: "Embeddings convertem texto (palavras, frases, documentos) em vetores numéricos de alta dimensão (ex: 1536 dimensões). Textos com significado similar ficam próximos no espaço vetorial. Permitem busca semântica ('encontre textos sobre IA' encontra artigos sobre machine learning mesmo sem a palavra exata). Modelos: OpenAI text-embedding-3, Cohere, Sentence-BERT. Base do RAG e de sistemas de recomendação.",
    related: ["rag", "vector-db", "similarity"],
  },
  {
    id: "vector-db",
    name: "Banco Vetorial",
    category: "ai",
    summary: "Banco de dados otimizado para armazenar e buscar embeddings (vetores).",
    content: "Bancos vetoriais armazenam embeddings e permitem busca por similaridade (nearest neighbors) em escala. Pinecone, Weaviate, Qdrant, Milvus, pgvector (extensão do PostgreSQL). Suportam milhões de vetores com índices como HNSW. Essenciais para RAG, busca semântica e sistemas de recomendação. Combinam metadados filtráveis com similaridade vetorial.",
    related: ["embeddings", "rag", "similarity"],
  },
  {
    id: "agents",
    name: "Agentes de IA",
    category: "ai",
    summary: "Sistemas de IA que usam ferramentas e tomam decisões autônomas para cumprir objetivos.",
    content: "Agentes de IA vão além de chat: recebem um objetivo, planejam passos, usam ferramentas (APIs, busca, código), observam resultados e iteram. Padrões: ReAct (Reason + Act), tool-use, function calling. Frameworks: LangChain, CrewAI, AutoGen. Um agente pode: ler e-mails, buscar na web, chamar APIs, escrever arquivos. Diferente de um LLM puro, agentes têm estado, memória e autonomia.",
    related: ["llm", "tools", "function-calling", "memory"],
  },
  {
    id: "function-calling",
    name: "Function Calling",
    category: "ai",
    summary: "Capacidade de um LLM de chamar funções estruturadas definidas pelo desenvolvedor.",
    content: "Function Calling (ou tool use) permite que um LLM decida chamar uma função externa com argumentos estruturados (JSON). Você descreve as funções disponíveis (nome, descrição, parâmetros), o LLM decide quando chamá-las e com quais argumentos. Habilita agentes: a IA pode buscar dados, enviar e-mails, executar código. Padronizado por OpenAI, Anthropic e outros. Base dos agentes modernos.",
    related: ["agents", "tools", "llm", "json"],
  },
  {
    id: "fine-tuning",
    name: "Fine-Tuning",
    category: "ai",
    summary: "Treinar um modelo pré-treinado com dados específicos para um domínio.",
    content: "Fine-Tuning ajusta um modelo pré-treinado (ex: GPT-4) com dados específicos do seu caso de uso. Diferente do RAG (que injeta contexto na hora), fine-tuning altera os pesos do modelo permanentemente. Útil para: estilo consistente, domínio especializado (médico, jurídico), formato fixo de saída. Custo: precisa de centenas a milhares de exemplos, tempo de treino, e pode causar catastrophic forgetting.",
    related: ["llm", "training", "rag"],
  },
  {
    id: "context-window",
    name: "Janela de Contexto",
    category: "ai",
    summary: "Quantidade máxima de tokens que um LLM consegue processar em uma única interação.",
    content: "A janela de contexto é o limite de tokens (input + output) que um modelo consegue lidar de uma vez. Modelos antigos: 4k tokens. Atuais: 128k (GPT-4o), 200k (Claude), 1M+ (Gemini). Janelas maiores permitem: analisar livros inteiros, bases de código, longas conversas. Mas custo cresce linearmente e qualidade pode degradar no meio ('lost in the middle').",
    related: ["tokens", "llm", "long-context"],
  },

  // ===== DATA =====
  {
    id: "json",
    name: "JSON",
    category: "data",
    summary: "Formato leve de troca de dados, legível por humanos e máquinas.",
    content: "JSON (JavaScript Object Notation) é o formato de dados mais usado na web. Estrutura: objetos ({}) e arrays ([]), com pares chave-valor. Tipos: string, number, boolean, null, array, object. Linguagem-agnóstica (todo lenguaje tem parser). Base de APIs REST, arquivos de config (package.json), e NoSQL (MongoDB armazena BSON). Alternativas: YAML (mais legível), Protobuf (mais rápido, binário).",
    related: ["api", "rest", "yaml"],
  },
  {
    id: "sql",
    name: "SQL",
    category: "data",
    summary: "Linguagem padrão para consultar e manipular bancos de dados relacionais.",
    content: "SQL (Structured Query Language) é a linguagem dos bancos relacionais (PostgreSQL, MySQL, SQLite). Comandos: SELECT (ler), INSERT (criar), UPDATE (modificar), DELETE (remover), JOIN (combinar tabelas), WHERE (filtrar), GROUP BY (agrupar). ACID garante transações seguras. ORM abstrai SQL em código, mas entender SQL raw é essencial para performance e debugging.",
    related: ["database", "nosql", "orm"],
  },
  {
    id: "orm",
    name: "ORM",
    category: "data",
    summary: "Mapeamento objeto-relacional: abstrai SQL em código, mapeando tabelas a classes.",
    content: "ORMs (Object-Relational Mappers) traduzem entre o mundo dos objetos (código) e o relacional (SQL). Prisma (TypeScript-first, schema declarativa), TypeORM, Sequelize (Node.js), SQLAlchemy (Python), Hibernate (Java). Vantagens: type safety, migrations, menos SQL boilerplate. Desvantagens: queries complexas podem ser difíceis, overhead de performance. Para queries críticas, usa-se SQL raw.",
    related: ["database", "sql", "prisma"],
  },

  // ===== DEVOPS =====
  {
    id: "git",
    name: "Git",
    category: "devops",
    summary: "Sistema de controle de versão distribuído que rastreia mudanças no código.",
    content: "Git é um sistema de controle de versão distribuído criado por Linus Torvalds. Cada clone é um repositório completo com histórico. Fluxo: working directory → staging (git add) → commit (git commit) → remote (git push). Branches permitem trabalho paralelo. Pull requests no GitHub/GitLab propõem merges com revisão. Conceitos: merge, rebase, cherry-pick, stash. Essencial para colaboração e CI/CD.",
    related: ["github", "branch", "pull-request", "ci-cd"],
  },
  {
    id: "github",
    name: "GitHub",
    category: "devops",
    summary: "Plataforma de hospedagem de código com Git, colaboração e CI/CD integrados.",
    content: "GitHub é a maior plataforma de hospedagem de código Git do mundo. Recursos: repositórios (públicos/privados), pull requests (revisão de código), issues (rastreamento de bugs/features), Actions (CI/CD), Pages (hospedagem estática), Packages (registros). Workflow comum: fork → branch → commit → push → PR → review → merge. É onde o Codrax atua: cria repos, gera código, abre PRs.",
    related: ["git", "pull-request", "ci-cd", "branch"],
  },
  {
    id: "pull-request",
    name: "Pull Request",
    category: "devops",
    summary: "Proposta de mudança que permite revisão antes de integrar código à branch principal.",
    content: "Pull Request (PR) é o coração da colaboração no GitHub. Fluxo: 1) Cria uma branch a partir da principal. 2) Faz commits com suas mudanças. 3) Abre um PR propondo o merge. 4) Revisores comentam, pedem mudanças, aprovam. 5) Merge (ou rejeita). Permite code review, CI automático (testes, lint), e rastreabilidade. O Codrax cria PRs com código gerado por IA para revisão humana.",
    related: ["github", "branch", "code-review", "ci-cd"],
  },
  {
    id: "ci-cd",
    name: "CI/CD",
    category: "devops",
    summary: "Integração e entrega contínuas: automatiza testes e deploys a cada mudança.",
    content: "CI/CD automatiza o pipeline de software. CI (Continuous Integration): a cada push, roda testes e lint automaticamente. CD (Continuous Deployment/Delivery): se os testes passam, deploy automático para produção (ou staging). Ferramentas: GitHub Actions, GitLab CI, Jenkins, CircleCI. Pipeline típico: build → test → lint → deploy. Reduz bugs em produção e acelera entregas.",
    related: ["github", "testing", "deployment", "automation"],
  },
  {
    id: "docker",
    name: "Docker",
    category: "devops",
    summary: "Empacota aplicações e dependências em containers portáveis.",
    content: "Docker cria containers: ambientes isolados e reproduzíveis com sua app + dependências. Um Dockerfile descreve a imagem (base OS + código + libs). 'docker build' cria a imagem, 'docker run' executa. Resolve 'funciona na minha máquina' — o container é idêntico em dev, staging e prod. Docker Compose orquestra múltiplos containers. Base do Kubernetes.",
    related: ["kubernetes", "container", "deployment"],
  },

  // ===== CONCEITOS GERAIS =====
  {
    id: "components",
    name: "Componentes",
    category: "concepts",
    summary: "Blocos reutilizáveis e independentes que compõem uma interface.",
    content: "Componentes são a unidade fundamental do React e de frameworks modernos. Um componente encapsula markup (JSX), estilos e lógica. Props são entradas (dados que recebe), state é estado interno. Componentes se compõem: um Button dentro de um Form dentro de uma Page. Boas práticas: pequenos, focados, reutilizáveis, pura (mesmas props = mesmo resultado). Padrões: controlled/uncontrolled, compound components, render props.",
    related: ["react", "props", "state", "jsx"],
  },
  {
    id: "state",
    name: "Estado",
    category: "concepts",
    summary: "Dados que um componente mantém e que mudam ao longo do tempo.",
    content: "Estado (state) são dados que mudam durante a vida de um componente e disparam re-renders. useState é o hook básico. Estado local (dentro do componente) vs global (Redux, Zustand, Context). Regras: imutável (nunca mutar diretamente), assíncrono (não confie no valor logo após setState). Lift state up: quando dois componentes precisam do mesmo estado, mova para o pai comum.",
    related: ["react", "hooks", "props", "redux"],
  },
  {
    id: "props",
    name: "Props",
    category: "concepts",
    summary: "Dados passados de um componente pai para um filho, somente leitura.",
    content: "Props (properties) são a forma de passar dados de um componente pai para um filho. São read-only — o filho nunca modifica suas props. Comunicam-se de cima para baixo (one-way data flow). Para o filho afetar o pai, o pai passa uma função callback via props. Padrão: destructuring ({ title, onClick }). Props vs state: props vêm de fora, state é interno.",
    related: ["react", "components", "state"],
  },
  {
    id: "webhooks",
    name: "Webhooks",
    category: "concepts",
    summary: "Notificações HTTP que um sistema envia a outro quando um evento acontece.",
    content: "Webhooks são 'APIs reversas': em vez de você pedir dados, o sistema te avisa quando algo acontece. Ex: GitHub envia um POST quando um PR é aberto, Stripe avisa quando um pagamento é confirmado. Você registra uma URL (endpoint) no provedor; ele faz POST com payload JSON quando o evento dispara. É assíncrono e em tempo real. Segurança: validar assinatura (HMAC) para garantir que veio do provedor certo.",
    related: ["api", "http", "automation", "events"],
  },
  {
    id: "authentication",
    name: "Autenticação",
    category: "concepts",
    summary: "Processo de verificar quem é o usuário (identidade).",
    content: "Autenticação (authN) responde 'quem é você?'. Métodos: senha, OAuth (Google/GitHub login), biometria (Passkeys/WebAuthn), 2FA. Diferente de autorização (authZ: 'o que você pode fazer?'). JWT (JSON Web Token) é comum: após login, o servidor emite um token assinado que o cliente envia nas próximas requisições. Sessões (server-side) vs tokens (stateless). OAuth2 flow: redirect → consent → code → token.",
    related: ["oauth", "jwt", "passkeys", "security"],
  },
  {
    id: "oauth",
    name: "OAuth",
    category: "concepts",
    summary: "Protocolo que permite acesso delegado a recursos sem compartilhar senhas.",
    content: "OAuth 2.0 é o padrão para 'login com Google/GitHub'. Fluxo: 1) App pede permissão ao usuário. 2) Usuário aprova no provedor. 3) Provedor dá um código temporário. 4) App troca código por access token. 5) App usa token para acessar a API. Scopes limitam o que o app pode fazer (ex: 'repo' no GitHub). Refresh tokens renovam acesso. Base de como o Codrax conecta ao GitHub do usuário.",
    related: ["authentication", "api", "tokens", "github"],
  },
  {
    id: "passkeys",
    name: "Passkeys",
    category: "concepts",
    summary: "Autenticação sem senha usando biometria e chaves criptográficas (WebAuthn).",
    content: "Passkeys substituem senhas por criptografia de chave pública. O dispositivo gera um par de chaves: a privada fica segura (Secure Enclave/TPM), a pública vai pro servidor. Ao autenticar, o servidor manda um desafio; o dispositivo o assina com a chave privada (após biometria). Sem senha, sem phishing, sem reutilização. Baseado em WebAuthn/FIDO2. Multi-dispositivo via sincronização (iCloud Keychain, Google Password Manager).",
    related: ["authentication", "webauthn", "security", "biometria"],
  },
  {
    id: "typescript",
    name: "TypeScript",
    category: "concepts",
    summary: "Superset do JavaScript que adiciona tipagem estática opcional.",
    content: "TypeScript adiciona tipos ao JavaScript. Tipos são verificados em compile time (não em runtime), pegando bugs antes de executar. Tipos básicos: string, number, boolean, arrays, tuples. Avançado: generics, unions, intersections, utility types (Pick, Omit, Partial). Interfaces e type aliases descrevem formas de objetos. tsconfig.json configura o compilador. Compila para JavaScript puro (erasing types). Padrão em projetos React e Node modernos.",
    related: ["javascript", "types", "react", "nodejs"],
  },
  {
    id: "automation",
    name: "Automação",
    category: "concepts",
    summary: "Execução automática de tarefas com base em gatilhos e regras.",
    content: "Automação elimina trabalho manual repetitivo. Tipos: scripts (tarefa única), workflows (multi-passos com gatilhos), pipelines (CI/CD). Gatilhos: agendados (cron), eventos (webhook, mudança de dados), manuais. Ferramentas: Zapier, n8n, Make (no-code); GitHub Actions, Temporal (código). Automações com IA: agentes que decidem ações com base em contexto. O Codrax é automação de criação de código.",
    related: ["webhooks", "ci-cd", "agents", "workflows"],
  },
];

export function searchConcepts(query, category = "all") {
  const q = query.toLowerCase().trim();
  return CONCEPTS.filter((c) => {
    const matchesCategory = category === "all" || c.category === category;
    if (!matchesCategory) return false;
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.summary.toLowerCase().includes(q) ||
      c.content.toLowerCase().includes(q)
    );
  });
}

export function getConceptById(id) {
  return CONCEPTS.find((c) => c.id === id);
}