export const CONNECTOR_CATEGORIES = {
  google: { pt: "Google", en: "Google", es: "Google", order: 1 },
  comunicacao: { pt: "Comunicação", en: "Communication", es: "Comunicación", order: 2 },
  produtividade: { pt: "Produtividade", en: "Productivity", es: "Productividad", order: 3 },
  armazenamento: { pt: "Armazenamento", en: "Storage", es: "Almacenamiento", order: 4 },
  crm: { pt: "CRM", en: "CRM", es: "CRM", order: 5 },
  calendario: { pt: "Calendário", en: "Calendar", es: "Calendario", order: 6 },
  dev: { pt: "Desenvolvimento", en: "Development", es: "Desarrollo", order: 7 },
  docs: { pt: "Documentos", en: "Documents", es: "Documentos", order: 8 },
};

const SI = "https://cdn.simpleicons.org";
const WM = "https://upload.wikimedia.org/wikipedia/commons";

// Map catalog connector IDs → registered workspace connector IDs (for OAuth)
export const WORKSPACE_CONNECTOR_MAP = {
  gmail: "6aafb4130290983a5537e0ee",
  gcalendar: "6aafb41e8e6cf43ae36c519d",
  gcontacts: "6aafb4259c31d3a1619b5ef6",
  gtasks: "6aafb428590567e4c76bcf98",
  gdrive: "6aafb42265da4d497f1b1801",
  gdocs: "6aafb6297ac5b0557625e838",
  gsheets: "6aafb626d111421c4bad5174",
  gmeet: "6aafb623aef5c24738fbbc92",
  github: "6aafb964b05c265a56e30631",
};

export const CONNECTORS = [
  // Google
  { id: "gmail", name: "Gmail", category: "google", logo: `${SI}/gmail`, desc: { pt: "Resuma, redija e responda e-mails", en: "Summarize, draft and reply to emails", es: "Resume, redacta y responde correos" } },
  { id: "gcalendar", name: "Google Agenda", category: "google", logo: `${SI}/googlecalendar`, desc: { pt: "Agende e reorganize compromissos", en: "Schedule and reorganize appointments", es: "Agenda y reorganiza citas" } },
  { id: "gcontacts", name: "Contatos", category: "google", logo: `${WM}/a/a8/Google_Contacts_icon_%282022%29.svg`, desc: { pt: "Enriqueça sua base de contatos", en: "Enrich your contact base", es: "Enriquece tu base de contactos" } },
  { id: "gtasks", name: "Tarefas", category: "google", logo: `${SI}/googletasks`, desc: { pt: "Crie e priorize tarefas", en: "Create and prioritize tasks", es: "Crea y prioriza tareas" } },
  { id: "gdrive", name: "Drive", category: "google", logo: `${SI}/googledrive`, desc: { pt: "Busque e analise documentos", en: "Search and analyze documents", es: "Busca y analiza documentos" } },
  { id: "gdocs", name: "Google Docs", category: "google", logo: `${SI}/googledocs`, desc: { pt: "Leia e crie documentos", en: "Read and create documents", es: "Lee y crea documentos" } },
  { id: "gsheets", name: "Google Sheets", category: "google", logo: `${SI}/googlesheets`, desc: { pt: "Consulte e edite planilhas", en: "Query and edit spreadsheets", es: "Consulta y edita hojas de cálculo" } },
  { id: "gmeet", name: "Google Meet", category: "google", logo: `${SI}/googlemeet`, desc: { pt: "Agende reuniões e chamadas", en: "Schedule meetings and calls", es: "Agenda reuniones y llamadas" } },

  // Comunicação
  { id: "slack", name: "Slack", category: "comunicacao", logo: `${WM}/d/d5/Slack_icon_2019.svg`, desc: { pt: "Resuma conversas e responda canais", en: "Summarize conversations and reply to channels", es: "Resume conversaciones y responde a canales" } },
  { id: "discord", name: "Discord", category: "comunicacao", logo: `${SI}/discord`, desc: { pt: "Busque mensagens e interaja em servidores", en: "Search messages and interact in servers", es: "Busca mensajes e interactúa en servidores" } },
  { id: "msteams", name: "Microsoft Teams", category: "comunicacao", logo: `${WM}/0/07/Microsoft_Office_Teams_%282025%E2%80%93present%29.svg`, desc: { pt: "Resuma conversas e agende reuniões", en: "Summarize conversations and schedule meetings", es: "Resume conversaciones y agenda reuniones" } },

  // Produtividade
  { id: "notion", name: "Notion", category: "produtividade", logo: `${SI}/notion`, desc: { pt: "Busque páginas e crie documentos", en: "Search pages and create documents", es: "Busca páginas y crea documentos" } },
  { id: "asana", name: "Asana", category: "produtividade", logo: `${SI}/asana`, desc: { pt: "Crie e acompanhe tarefas e projetos", en: "Create and track tasks and projects", es: "Crea y sigue tareas y proyectos" } },
  { id: "clickup", name: "ClickUp", category: "produtividade", logo: `${SI}/clickup`, desc: { pt: "Gerencie tarefas e sprints", en: "Manage tasks and sprints", es: "Gestiona tareas y sprints" } },
  { id: "linear", name: "Linear", category: "produtividade", logo: `${SI}/linear`, desc: { pt: "Busque issues e acompanhe o roadmap", en: "Search issues and track the roadmap", es: "Busca issues y sigue el roadmap" } },
  { id: "todoist", name: "Todoist", category: "produtividade", logo: `${SI}/todoist`, desc: { pt: "Crie e organize tarefas pessoais", en: "Create and organize personal tasks", es: "Crea y organiza tareas personales" } },
  { id: "jira", name: "Jira", category: "produtividade", logo: `${SI}/jira`, desc: { pt: "Gerencie issues e sprints do time", en: "Manage team issues and sprints", es: "Gestiona issues y sprints del equipo" } },

  // Armazenamento
  { id: "dropbox", name: "Dropbox", category: "armazenamento", logo: `${SI}/dropbox`, desc: { pt: "Busque e analise arquivos", en: "Search and analyze files", es: "Busca y analiza archivos" } },
  { id: "box", name: "Box", category: "armazenamento", logo: `${SI}/box`, desc: { pt: "Acesse e compartilhe documentos", en: "Access and share documents", es: "Accede y comparte documentos" } },
  { id: "onedrive", name: "OneDrive", category: "armazenamento", logo: `${WM}/e/e7/Microsoft_OneDrive_Icon_%282025_-_present%29.svg`, desc: { pt: "Busque arquivos na nuvem Microsoft", en: "Search files in Microsoft cloud", es: "Busca archivos en la nube de Microsoft" } },

  // CRM
  { id: "hubspot", name: "HubSpot", category: "crm", logo: `${SI}/hubspot`, desc: { pt: "Enriqueça contatos e busque deals", en: "Enrich contacts and search deals", es: "Enriquece contactos y busca deals" } },
  { id: "salesforce", name: "Salesforce", category: "crm", logo: `${WM}/f/f9/Salesforce.com_logo.svg`, desc: { pt: "Consulte oportunidades e clientes", en: "Query opportunities and customers", es: "Consulta oportunidades y clientes" } },
  { id: "attio", name: "Attio", category: "crm", logo: "", desc: { pt: "Gerencie seu CRM moderno", en: "Manage your modern CRM", es: "Gestiona tu CRM moderno" } },

  // Calendário
  { id: "calendly", name: "Calendly", category: "calendario", logo: `${SI}/calendly`, desc: { pt: "Agende reuniões sem troca de e-mails", en: "Schedule meetings without email back-and-forth", es: "Agenda reuniones sin intercambio de correos" } },

  // Desenvolvimento
  { id: "github", name: "GitHub", category: "dev", logo: `${SI}/github`, desc: { pt: "Revise PRs e busque issues", en: "Review PRs and search issues", es: "Revisa PRs y busca issues" } },
  { id: "gitlab", name: "GitLab", category: "dev", logo: `${SI}/gitlab`, desc: { pt: "Acompanhe merges e pipelines CI", en: "Track merges and CI pipelines", es: "Sigue merges y pipelines CI" } },

  // Documentos
  { id: "confluence", name: "Confluence", category: "docs", logo: `${SI}/confluence`, desc: { pt: "Busque e crie documentação do time", en: "Search and create team documentation", es: "Busca y crea documentación del equipo" } },
];