// Catálogo de automações prontas para a aba Automações
// trigger: "schedule" (agendado), "connector" (tempo real via conector), "entity" (evento no banco)

export const AUTOMATION_CATEGORIES = {
  email: { label: "E-mail & Comunicação", order: 1 },
  agenda: { label: "Agenda & Produtividade", order: 2 },
  arquivos: { label: "Arquivos & Documentos", order: 3 },
  dev: { label: "Desenvolvimento", order: 4 },
  gestao: { label: "Gestão & Uso", order: 5 },
};

export const AUTOMATION_TEMPLATES = [
  // E-mail & Comunicação
  {
    id: "digest-emails",
    category: "email",
    icon: "Mail",
    title: "Resumo diário de e-mails",
    desc: "Todo dia às 8h, consolida os e-mails não lidos do Gmail e envia um resumo no chat.",
    trigger: "schedule",
    needs: ["gmail"],
  },
  {
    id: "resposta-prioritarios",
    category: "email",
    icon: "Reply",
    title: "Resposta automática de prioritários",
    desc: "Rascunha respostas para e-mails marcados como importantes e deixa para você aprovar.",
    trigger: "connector",
    needs: ["gmail"],
  },
  {
    id: "digest-slack",
    category: "email",
    icon: "MessageSquare",
    title: "Digest semanal de Slack/Discord",
    desc: "Resume as mensagens mais relevantes dos canais que você acompanha toda segunda-feira.",
    trigger: "connector",
    needs: ["slack"],
    soon: true,
  },

  // Agenda & Produtividade
  {
    id: "briefing-matinal",
    category: "agenda",
    icon: "Sunrise",
    title: "Briefing matinal da agenda",
    desc: "Todo dia às 7h, lista os compromissos do dia com contexto dos e-mails relacionados.",
    trigger: "schedule",
    needs: ["gcalendar", "gmail"],
  },
  {
    id: "lembrete-tarefas",
    category: "agenda",
    icon: "CheckSquare",
    title: "Lembrete de tarefas pendentes",
    desc: "Diariamente, lembra das tarefas do Google Tasks não concluídas e sugere prioridades.",
    trigger: "schedule",
    needs: ["gtasks"],
  },
  {
    id: "evento-de-email",
    category: "agenda",
    icon: "CalendarPlus",
    title: "Evento a partir de e-mail",
    desc: "Quando chega um e-mail com data e hora, cria automaticamente o evento na Agenda.",
    trigger: "connector",
    needs: ["gmail", "gcalendar"],
  },
  {
    id: "resumo-reuniao",
    category: "agenda",
    icon: "Video",
    title: "Resumo pós-reunião",
    desc: "Depois de uma chamada no Meet, gera um resumo e salva no Google Docs.",
    trigger: "connector",
    needs: ["gmeet", "gdocs"],
  },

  // Arquivos & Documentos
  {
    id: "backup-conversas",
    category: "arquivos",
    icon: "FolderSync",
    title: "Backup de conversas no Drive",
    desc: "Salva conversas fixadas no Google Drive em PDF toda sexta-feira.",
    trigger: "schedule",
    needs: ["gdrive"],
  },
  {
    id: "organizar-drive",
    category: "arquivos",
    icon: "FolderTree",
    title: "Organização de arquivos",
    desc: "Categoriza novos arquivos do Drive por tipo e tema automaticamente.",
    trigger: "schedule",
    needs: ["gdrive"],
  },
  {
    id: "traduzir-docs",
    category: "arquivos",
    icon: "Languages",
    title: "Tradução automática de docs",
    desc: "Traduz novos documentos do Google Docs para português brasileiro.",
    trigger: "connector",
    needs: ["gdocs"],
  },

  // Desenvolvimento
  {
    id: "monitor-prs",
    category: "dev",
    icon: "GitPullRequest",
    title: "Monitor de PRs do GitHub",
    desc: "Avisa no chat quando um pull request é aberto ou mergeado nos seus repositórios.",
    trigger: "connector",
    needs: ["github"],
  },
  {
    id: "digest-repo",
    category: "dev",
    icon: "BarChart3",
    title: "Digest semanal de atividade",
    desc: "Resume commits, issues e PRs da semana toda segunda às 9h.",
    trigger: "schedule",
    needs: ["github"],
  },

  // Gestão & Uso
  {
    id: "relatorio-consumo",
    category: "gestao",
    icon: "TrendingUp",
    title: "Relatório semanal de consumo",
    desc: "Envia um relatório de tokens e mensagens usados, divididos por modelo, toda segunda.",
    trigger: "schedule",
    needs: [],
  },
  {
    id: "alerta-cota",
    category: "gestao",
    icon: "AlertCircle",
    title: "Alerta de cota próxima do limite",
    desc: "Avisa quando faltam 10% da cota do seu plano para evitar interrupções.",
    trigger: "entity",
    needs: [],
  },
  {
    id: "aniversarios-contatos",
    category: "gestao",
    icon: "Cake",
    title: "Lembrete de aniversários",
    desc: "Notifica aniversários vindouros dos seus contatos do Google Contacts.",
    trigger: "schedule",
    needs: ["gcontacts"],
  },
];

export const TRIGGER_LABELS = {
  schedule: { label: "Agendado", icon: "Clock" },
  connector: { label: "Tempo real", icon: "Zap" },
  entity: { label: "Por evento", icon: "Bell" },
};