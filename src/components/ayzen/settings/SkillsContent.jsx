import React, { useState, useEffect } from "react";
import { Plus, Loader2, ChevronDown, Trash2, Pencil, MoreVertical, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/lib/LanguageContext";
import { base44 } from "@/api/base44Client";

const ASTRONAUT_IMG =
  "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/81e46fe3d_empty-astronaut-removebg-preview.png";

// Habilidades atribuídas (globais / da empresa) — exemplo estático
const ASSIGNED_SKILLS = [
  {
    id: "a1",
    name: "acabamento-pro",
    description:
      "Craft verificável: grid 4/8px, anatomia de botão, todos os estados, movimento e hierarquia de superfície.",
    tag: "Global",
    instructions:
      "Craft verificável: cada valor de spacing, timing e alinhamento é uma escolha que você consegue defender.\n\nGRID: todo espaçamento em incrementos de 4/8px (proibido valor fora da escala); ritmo vertical por hierarquia: 16/24/32/48px. Container max-w-6xl/7xl no desktop. Breakpoints 375/768/1024/1440, mobile-first, zero scroll horizontal, min-h-dvh (nunca 100vh).\n\nBOTÕES (anatomia exata): padding horizontal = 2x o vertical (ex: py-2.5 px-5); altura mínima 40px (44px no mobile); gap ícone-texto de 8px com ícone 16-20px alinhado à baseline; grupos de ação SEMPRE com flex + gap + flex-wrap (nunca empilhar por acidente); min-width pra label não dançar; estado pressed com scale(0.97) em 100ms ease-out no :active SEM mudar bounds (zero jitter de layout); cursor-pointer e touch-action: manipulation em tudo clicável; alvo de toque 44x44px com 8px de folga entre vizinhos (expanda a hit area se o ícone for menor).\n\nESTADOS (todos, sempre): hover, focus-visible com anel COM COR, active, disabled (opacity 0.4 + cursor), loading (skeleton se passar de 300ms, nunca spinner bloqueante), empty com ação, error com explicação. Validação de formulário no blur com erro abaixo do campo; label visível (placeholder não é label).\n\nMOVIMENTO: micro-interações 150-300ms, nada acima de 400ms; só transform e opacity (nunca width/height/top/left); ease-out na entrada, saída com 60-70% da duração da entrada; stagger de lista 30-50ms por item; UM momento orquestrado por tela, não confete espalhado; menu/popover nasce do elemento que o disparou (transform-origin no trigger, nunca do centro); entrar e sair pelo MESMO caminho; prefers-reduced-motion vira cross-fade de 200ms.\n\nHIERARQUIA DE SUPERFÍCIE: uma escala única de elevação pra card/sheet/modal no app inteiro; sombra proporcional ao tamanho; scrim de modal 40-60% de preto; nunca duas superfícies translúcidas empilhadas.\n\nCHECKLIST ANTES DE ENTREGAR: testa mentalmente em 375px, botões alinhados em linha com wrap, contraste dos dois temas, alvos 44px, nada escondido atrás de barra fixa."
  },
  {
    id: "a2",
    name: "animacao-de-interface",
    description:
      "Animação como decisão: gate de frequência, propósito nomeado, tabela de durações e curvas.",
    tag: "Global",
    instructions:
      "Animação boa é decisão, não enfeite. Sequência obrigatória antes de animar QUALQUER coisa (destilado do material de motion mais respeitado do ecossistema):\n\nGATE DE FREQUÊNCIA: ação usada dezenas de vezes por dia (abrir menu principal, trocar aba, busca) NÃO anima, ou anima em até 150ms. Animação em ação frequente vira atrito.\n\nNOMEIE O PROPÓSITO: toda animação tem um destes nomes: feedback (confirmou a ação), coerência espacial (de onde veio, pra onde foi), indicação de estado (carregando, sucesso), ou deleite (SÓ em evento raro: primeira vez, conquista). Sem nome = não anima.\n\nFERRAMENTA MAIS BARATA: CSS transition resolve 90%; keyframes pra sequência; lib de spring (motion) só pra gesto/interrupção.\n\nDURAÇÕES POR CONTEXTO (tabela, não invente): botão/toggle 100-160ms; tooltip/dropdown 125-200ms; modal/sheet 200-300ms; troca de página 250-400ms. NADA acima de 400ms em UI. Saída dura 60-70% da entrada.\n\nCURVAS: entrada ease-out; saída ease-in-out; NUNCA ease-in em UI (começo lento parece travado); nunca linear exceto progresso contínuo (spinner, barra). Nunca scale partindo de 0 (parece brotar do nada): scale de 0.95-0.97 pra 1.\n\nPROPRIEDADES: só transform e opacity. Animar width/height/top/left/margin causa reflow e trava em celular fraco. Nunca transition: all.\n\nLISTAS: stagger de 30-50ms por item, máximo nos 8 primeiros (o resto entra junto); reordenação anima posição, entrada/saída anima opacity+translateY curto.\n\nSEMPRE: prefers-reduced-motion vira cross-fade de 200ms; animação interruptível (nunca bloquear input esperando terminar); transform-origin no elemento que disparou.\n\nREVISÃO (aplique nos apps existentes): animação sem propósito nomeado, remove; acima da tabela de duração, encurta; com ease-in, troca; em propriedade de layout, reescreve pra transform."
  },
  {
    id: "a3",
    name: "apple-design",
    description:
      "Interface fluida estilo Apple: resposta imediata, gesto 1:1, interruptibilidade, física no release.",
    tag: "Global",
    instructions:
      "Interface viva é a que responde ao toque como objeto físico. Regras destiladas dos princípios de interface fluida da Apple, adaptadas pra web:\n\nRESPOSTA IMEDIATA: feedback no pointer-down, nunca no release: botão pressionado ganha scale(0.97) em 100ms ease-out no :active. Nada de espera artificial no caminho do input (sem debounce desnecessário, sem esperar transição acabar).\n\nDURANTE O GESTO: em drag, slider, sheet e carrossel, a UI acompanha o dedo 1:1 o tempo todo; exige ~10px de movimento antes de se comprometer com uma direção; respeita o ponto onde o usuário PEGOU o elemento (nunca dá snap pro centro no grab).\n\nINTERRUPTIBILIDADE (regra número 1): toda animação pode ser pega e revertida no meio; nunca bloqueie input durante transição; anime sempre A PARTIR do valor visível na tela no instante da interrupção, nunca do valor alvo. Para movimento guiado por gesto, use springs (bounce 0, duration 0.4 como padrão; bounce 0.2 SÓ quando o gesto carregou momentum), nunca CSS transition/keyframes.\n\nFÍSICA NO RELEASE: a animação começa com a velocidade exata do dedo no soltar; decisão de confirmar ou reverter (fechar sheet, voltar card) vem do SINAL da velocidade, não da posição; nos limites, resistência progressiva (rubber-band), nunca parada seca.\n\nCOERÊNCIA ESPACIAL: menu/popover/sheet nasce do elemento que o disparou (transform-origin no trigger); o que entra pela direita sai pela direita; só transform e opacity (compositor), com will-change onde o movimento é iminente.\n\nSOBRIEDADE: um momento orquestrado por tela; feedback reservado pra eventos significativos (sucesso, erro, commit, snap): excesso treina o usuário a ignorar. prefers-reduced-motion: reduce troca slide/spring por cross-fade de 200ms e corta overshoot."
  },
  {
    id: "a4",
    name: "auditoria-de-ui",
    description:
      "Passe objetivo de acessibilidade, foco, formulários, overflow, imagens, dark mode e toque.",
    tag: "Global",
    instructions:
      "Passe de revisão OBJETIVA no app inteiro (destilado das Web Interface Guidelines da Vercel, ~100 regras). Varra o código e corrija cada violação; reporte no summary como arquivo:regra.\n\nACESSIBILIDADE: botão só-ícone exige aria-label; todo campo tem <label> ligado (placeholder não é label); imagem informativa tem alt (decorativa tem alt=\"\"); elemento clicável é <button>/<a>, nunca <div onClick>; toast/aviso dinâmico tem aria-live=polite; modal fecha com Esc e devolve o foco pra quem abriu.\n\nFOCO E TECLADO: focus-visible com anel visível COM COR em tudo interativo; NUNCA outline:none sem substituto; ordem de tab segue a ordem visual; dropdown/menu navega com setas.\n\nFORMULÁRIOS: input com type e inputmode certos (email, tel, numeric); autocomplete nos campos padrão (name, email, cc-number); NUNCA bloquear colar; erro inline abaixo do campo com foco automático no primeiro erro após submit; botão de submit com estado de envio.\n\nCONTEÚDO E OVERFLOW: texto longo trunca com ellipsis ou quebra, nunca vaza do card; tabela larga rola dentro do próprio container (nunca a página inteira de lado); número em coluna alinhado à direita com tabular-nums; datas e moeda no formato pt-BR.\n\nIMAGENS: width/height ou aspect-ratio declarados (zero layout shift); lazy loading fora da dobra; object-fit cover em avatar/thumb.\n\nANIMAÇÃO: prefers-reduced-motion respeitado; só transform/opacity; nunca transition:all.\n\nDARK MODE: separadores e bordas visíveis nos DOIS temas; nenhuma cor chumbada que só funciona em um; imagem com fundo branco ganha tratamento (borda ou fundo).\n\nESTADO E URL: filtro/aba/página refletidos na URL (compartilhável e sobrevive ao F5); botão voltar do navegador nunca quebra o app.\n\nTOQUE: alvos 44px no mobile; touch-action: manipulation; hover nunca é a ÚNICA forma de descobrir uma ação."
  },
  {
    id: "a5",
    name: "catalogo-de-estilos",
    description:
      "Sete direções prontas (Preciso, Editorial, Brutal, Orgânico, Noturno, Luxo, Vitrine) pra executar por inteiro.",
    tag: "Global",
    instructions:
      "Escolha UMA direção e execute ela por inteiro (paleta+tipografia+forma+movimento coerentes). Estilos prontos pra citar pelo nome no pedido:\n\nPRECISO (SaaS/ferramenta séria): fundo quase-branco frio, cinzas azulados, UM acento elétrico usado com avareza; sans geométrica; cantos 6-8px; bordas hairline; densidade alta; movimento mínimo e seco (120ms). Nada de sombra pesada.\n\nEDITORIAL (conteúdo/portfólio/estúdio): serifa de display GRANDE nos títulos + sans neutra no corpo; preto quente sobre off-white; muito espaço em branco; imagens grandes; regras tipográficas (hairline entre seções); movimento só no scroll-reveal.\n\nBRUTAL (marca jovem/evento/portfolio ousado): contraste máximo, cores chapadas saturadas, borda preta grossa 2-3px, sombra dura deslocada (4px 4px 0), cantos retos, tipografia pesada uppercase; hover com deslocamento físico.\n\nORGÂNICO (saúde/bem-estar/comida): tons terrosos ou verdes dessaturados, cantos generosos 16-24px, formas suaves (blob discreto no fundo), serifa humanista ou rounded sans; fotos com pessoas; movimento suave 250ms.\n\nNOTURNO (dev tool/fintech/gaming): fundo #0A-#12 com UMA cor neon de assinatura (não arco-íris), glow sutil SÓ no elemento primário, mono nos dados; grid visível fraco; densidade média.\n\nLUXO DISCRETO (premium/joalheria/imobiliário alto padrão): preto e creme, dourado APENAS em detalhe fino (1px, ícone), serifa clássica espaçada, letter-spacing largo em uppercase pequeno, fotos escuras dramáticas; movimento lento e raro (400ms só na entrada).\n\nVITRINE (e-commerce): produto é o herói (foto grande fundo neutro), UI recua (cinzas + 1 acento de ação), cards de produto SEM borda (só espaço), preço em destaque tabular, badges semânticos discretos.\n\nREGRAS DO CATÁLOGO: nunca misture dois estilos na mesma tela; o estilo escolhido entra numa frase no topo do summary; dark mode respeita o estilo (PRECISO escuro continua frio e seco, não vira NOTURNO)."
  },
  {
    id: "a6",
    name: "copy-que-vende",
    description:
      "Texto que converte em pt-BR: específico vence criativo, benefício antes de feature, palavras banidas.",
    tag: "Global",
    instructions:
      "Texto de produto que converte, em português BRASILEIRO de verdade (não tradução de gringo):\n\nREGRA MESTRA: específico vence criativo. \"Corte o fechamento de caixa de 2 horas pra 10 minutos\" vence \"Otimize seu tempo\". Todo benefício com número, prazo ou cenário concreto; se não tem o número real, descreva o cenário (\"sem planilha, sem WhatsApp perdido\"), NUNCA invente estatística ou depoimento.\n\nBENEFÍCIO ANTES DE FEATURE: a feature é o como, o benefício é o porquê. Formato: resultado primeiro, mecanismo depois (\"Receba na sexta sem atraso: a cobrança sai sozinha todo dia 1º\").\n\nVOZ: ativa e direta, segunda pessoa (você), frases de até 15 palavras nos títulos. Fale como o CLIENTE fala (a palavra que ele usa no WhatsApp, não o jargão interno): \"agenda cheia\" vence \"otimização de ocupação\".\n\nPALAVRAS BANIDAS: revolucionário, inovador, otimize, potencialize, alavancar, solução completa, líder de mercado, simplesmente, incrível, \"o melhor do Brasil\" sem prova. Superlativo só com número do lado.\n\nBOTÕES: verbo de ação + resultado (\"Começar grátis\", \"Agendar horário\", \"Ver meu plano\"); NUNCA \"Saiba mais\", \"Clique aqui\", \"Enviar\". O texto do botão diz o que acontece depois do clique.\n\nMICROCOPY: erro diz o que houve E como resolver (\"CPF inválido: confira os 11 dígitos\"); estado vazio convida à ação (\"Nenhum cliente ainda. Cadastre o primeiro em 30 segundos\"); confirmação afirma o feito (\"Agendado pra terça, 14h\").\n\nESTRUTURA DE ARGUMENTO (landing/página de venda): promessa > prova > como funciona em 3 passos > objeção respondida > chamada. Uma ideia por seção; se a frase funciona sem uma palavra, corte a palavra."
  },
  {
    id: "a7",
    name: "design-anti-generico",
    description:
      "Regras verificáveis contra o visual médio de IA: cores, tipografia, composição e labels.",
    tag: "Global",
    instructions:
      "Você tende a convergir pro visual médio de IA. Combata de propósito, com regras VERIFICÁVEIS:\n\nCORES: 3 a 5 cores no total (1 dominante + neutros tintados na matiz dela + 1 acento afiado). Roxo/violeta NUNCA como padrão. Sem gradiente, exceto pedido explícito. Toda cor via token semântico do tema (bg-background, text-foreground, bg-primary); PROIBIDO hex cru, text-white, bg-black ou cor literal do Tailwind (bg-zinc-900) dentro de componente. Dark mode com variantes dessaturadas, nunca inversão. Contraste: texto normal 4.5:1, texto grande e ícones 3:1, conferido nos DOIS temas (borda que some no dark é defeito).\n\nTIPOGRAFIA: máximo 2 famílias, fora da lista de cara de IA (Inter, Roboto, Open Sans, Lato, Arial, Poppins, DM Sans, Space Grotesk, Syne, Playfair Display, Fraunces, IBM Plex, Outfit, Plus Jakarta Sans, Instrument Sans/Serif, system-ui sozinha). Padrão SÓBRIO, como Replit e Lovable: título de abertura entre 2,25rem e 3,5rem (hero de landing até 4,5rem), peso 600-700; corpo 16px, peso 400-500, line-height 1.5; tracking no máximo -0.02em e só acima de 2rem. NUNCA pôster tipográfico: nada de título acima de 4,5rem, de peso 100-200 contra 900, de painel de \"tipografia como identidade\" nem de texto de template. A identidade vem de cor, espaço, composição e conteúdo; tipografia expressiva só quando o usuário pedir. Números tabulares em contadores e timers.\n\nCOMPOSIÇÃO: fundo com atmosfera (camadas sutis, profundidade, textura leve), nunca cor chapada default. Um único CTA primário por tela. Proibido: emoji como ícone, ícones de famílias misturadas (uma só: Lucide), hero centrado + badge + 3 cards em linha, card dentro de card, sombra pesada em tudo, borda 1px cinza como único separador (use espaço, luminosidade 3-5% ou sombra), rounded-2xl + shadow-lg + p-6 repetido como carimbo.\n\nLABELS: nome específico vence genérico (\"Progresso\", \"Biblioteca\", nunca \"Home\"). Estado vazio com frase útil + ação, nunca \"Nenhum item\".\n\nANTES DE CODAR: declare em 1 frase o conceito visual (o que o app evoca, de que mundo vem a paleta) e valide cada decisão contra ele. Decisão que não cabe na frase está fora da identidade."
  },
  {
    id: "a8",
    name: "landing-que-converte",
    description:
      "Landing como máquina de uma decisão: dobra 1, estrutura, ritmo visual, copy e confiança.",
    tag: "Global",
    instructions:
      "Landing page é máquina de UMA decisão. Cada dobra existe pra empurrar a próxima; o que não empurra, sai.\n\nDOBRA 1 (a tese): headline específica de RESULTADO em até 9 palavras (o que a pessoa GANHA, não o que o produto é), subtítulo de 1 frase com o como, UM CTA primário com verbo de ação (\"Começar grátis\", nunca \"Saiba mais\"), e prova social imediata (número real, logo ou nota). Proibido: carrossel na dobra 1, dois CTAs competindo, headline com nome do produto como sujeito.\n\nESTRUTURA (nesta ordem, corte o que não tiver conteúdo real): problema em 1 parágrafo que dói > solução mostrada FUNCIONANDO (screenshot/demo real do app, nunca ilustração abstrata) > 3 benefícios como RESULTADO (métrica ou cenário, nunca lista de features) > prova social com nome e contexto > preço claro sem asterisco > FAQ com as 4 objeções reais > CTA final repetindo o da dobra 1.\n\nRITMO VISUAL: alterne fundo das seções (base e elevada) pra dar cadência de leitura; largura de texto máxima 65 caracteres; UMA seção pode ser ousada (tipografia gigante, número destacado), o resto quieto. CTA sempre com o MESMO texto e cor do início ao fim da página.\n\nCOPY: voz ativa, segunda pessoa, específico vence esperto (\"Publique em 40 segundos\" vence \"Rapidez incrível\"). Proibido: \"revolucionário\", \"o melhor\", \"simplesmente\", superlativo sem número. Todo botão diz o que acontece ao clicar.\n\nCONFIANÇA: rodapé com empresa real, termos e privacidade linkados; nada de contador fake de urgência nem depoimento sem nome. Formulário pede o MÍNIMO (e-mail só, se possível)."
  },
  {
    id: "a9",
    name: "metodo-karpathy",
    description:
      "Contra os vícios de IA codando: pensar antes, simplicidade, mudança cirúrgica e objetivo verificável.",
    tag: "Global",
    instructions:
      "Contra os vícios clássicos de IA codando (as 4 regras mais compartilhadas do ecossistema, adaptadas):\n\nPENSE ANTES DE CODAR: declare as suposições no summary; pedido ambíguo com duas leituras razoáveis, diga qual escolheu e por quê; se algo do projeto contradiz o pedido, aponte em vez de esconder.\n\nSIMPLICIDADE PRIMEIRO: o mínimo de código que resolve O PEDIDO. Nada de feature extra \"aproveitando\", nada de abstração pra uso único, nada de configurável que ninguém pediu, nada de tratamento de erro pra cenário impossível. Se dá pra fazer em 50 linhas, não faça em 200.\n\nMUDANÇA CIRÚRGICA: toque SÓ nos arquivos que o pedido exige; não \"melhore\" código vizinho, não renomeie o que funciona, não reformate arquivo inteiro pra mudar 3 linhas; estilo novo segue o estilo que o projeto já tem. Toda linha alterada precisa se explicar pelo pedido.\n\nOBJETIVO VERIFICÁVEL: antes de escrever, defina o critério de pronto (\"o botão salva e a lista atualiza sem recarregar\"); ao terminar, confira o critério e diga no summary O QUE FOI VERIFICADO, nunca \"deve funcionar\". Quebrou algo no caminho? Conta, não esconde."
  },
  {
    id: "a10",
    name: "painel-de-dados",
    description:
      "Dashboard lido em 5s: KPIs tabulares, tabelas certas, gráficos com regras, densidade e estados.",
    tag: "Global",
    instructions:
      "Dashboard é lido em 5 segundos e operado depois. Hierarquia: resumo antes do detalhe, estado antes do número.\n\nTOPO: no máximo 4 números-resumo (KPI), cada um com rótulo claro, valor grande em números TABULARES (font-variant-numeric: tabular-nums) e variação com sinal e cor semântica. Cor semântica (verde bom / âmbar atenção / vermelho crítico) é SEPARADA do acento da marca e nunca conta como cor decorativa.\n\nTABELAS: números alinhados à direita com tabular-nums, texto à esquerda; cabeçalho pequeno em uppercase com letter-spacing; linhas com hover; zebra OU divisor, nunca os dois; célula de status como chip/pill (forma + cor, nunca cor sozinha); ação por linha aparece em ícone discreto, não botão gigante repetido 40 vezes.\n\nGRÁFICOS: máximo 6 séries por gráfico (acima disso, agrupe em \"outros\"); pizza/donut só até 5 categorias, senão barra; área com preenchimento sutil, grid fraco, último ponto enfatizado; eixo Y começando em zero pra quantidades; tooltip com valor formatado e data completa. Sem animação de gráfico acima de 400ms.\n\nDENSIDADE: modo denso é virtude em painel: espaçamento 4/8px consistente, tipografia 12-14px nas tabelas com line-height 1.4, mas alvos de clique mantêm 40px. Nada de card gigante com um número pequeno perdido dentro.\n\nESTADOS: cada widget tem loading (skeleton na forma do conteúdo), vazio (\"Sem vendas neste período\" + ação), e erro com retry LOCAL (um widget quebrado nunca derruba a página). Filtros persistem na URL (compartilhável). Números monetários com a moeda do usuário e separador local."
  },
  {
    id: "a11",
    name: "react-performance",
    description:
      "Maior impacto primeiro: rede em paralelo, bundle, re-render, listas grandes e medida antes de remédio.",
    tag: "Global",
    instructions:
      "Performance React com as regras de maior impacto (destilado das best practices da Vercel, adaptado pra Vite SPA):\n\nREDE PRIMEIRO (maior ganho): requisições independentes SEMPRE em paralelo (Promise.all), nunca await em série; dispare o fetch ANTES de precisar (no clique que abre a tela, não no mount dela); dedupe com cache simples ou SWR quando a mesma info aparece em 2 lugares.\n\nBUNDLE: import direto do arquivo, nunca barrel de biblioteca inteira (import { X } from 'lib/X', não from 'lib'); componente pesado e raro (editor, gráfico, mapa) entra com lazy() + Suspense; biblioteca só de uma tela não entra no bundle inicial.\n\nRE-RENDER: estado no nível mais baixo; setState funcional quando depende do anterior (setCount(c => c+1)); useState com função pra valor inicial caro (useState(() => calc())); NUNCA componente definido dentro de componente; contexto que muda muito separado do que muda pouco (tema num contexto, dado noutro).\n\nLISTAS GRANDES: 50+ itens com renderização pesada viram lista virtualizada ou paginada; item de lista com memo SÓ se medido; key estável do dado.\n\nRENDERIZAÇÃO: condicional com ternário (cond ? <X/> : null), nunca && com número/string à esquerda (0 e '' vazam pra tela); content-visibility: auto em seção longa fora da dobra; skeleton com o TAMANHO do conteúdo final (zero layout shift).\n\nJS PURO: lookup repetido em array vira Set/Map fora do loop; regex e formatadores (Intl.NumberFormat) criados UMA vez fora do componente; debounce só em busca/digitação (300ms), nunca em clique.\n\nMEDIDA ANTES DE REMÉDIO: memo/useMemo/useCallback só onde o re-render é comprovadamente caro; otimização especulativa é dívida."
  },
  {
    id: "a12",
    name: "react-solido",
    description:
      "React que não quebra na segunda edição: estado, efeitos, listas, composição e robustez.",
    tag: "Global",
    instructions:
      "Código React que não quebra na segunda edição. Regras com motivo:\n\nESTADO: mora no nível mais baixo que o usa (colocation); NUNCA duplique o que dá pra derivar (total = items.reduce, não um segundo useState de total); nunca copie prop pra estado sem sincronizar (ou use a prop direto). Objeto/array em estado troca por cópia nova (spread), nunca mutação.\n\nEFEITOS: useEffect SÓ pra sincronizar com o mundo de fora (fetch, listener, timer, localStorage), com cleanup de TUDO que assina (removeEventListener, clearInterval, AbortController). Cálculo a partir de props/estado NÃO é efeito: é variável derivada no corpo. Dependências completas, sem mentir pro array.\n\nLISTAS: key estável do DADO (id), nunca índice quando a lista reordena/filtra; item de lista extraído em componente quando passa de ~20 linhas.\n\nCOMPOSIÇÃO: componente com um propósito por arquivo; passou de ~250 linhas, divide; props explícitas em vez de objeto gigante; children e composição vencem prop drilling de 3 níveis (contexto só pra estado realmente global: usuário, tema).\n\nROBUSTEZ: todo acesso a dado assíncrono cobre os 3 estados (loading/erro/vazio); optional chaining em dado de fora (user?.name), nunca confiar que a API voltou; datas com new Date() no momento do uso, nunca chumbadas; localStorage com try/catch e chave própria do app.\n\nFORMULÁRIO: input SEMPRE controlado (value + onChange) ou sempre não-controlado, nunca alternando; submit com preventDefault e estado de envio.\n\nPERFORMANCE: primeiro medir, depois otimizar; memo/useMemo/useCallback só onde há re-render comprovadamente caro; NUNCA definir componente dentro de componente (recria a árvore a cada render)."
  },
  {
    id: "a13",
    name: "seo-do-app",
    description:
      "App publicado nasce indexável: head obrigatório, estrutura, robots/sitemap, dados estruturados.",
    tag: "Global",
    instructions:
      "Todo app/site publicado nasce indexável. Aplique SEMPRE que criar ou editar páginas públicas:\n\nHEAD OBRIGATÓRIO (por página): <title> único de 50-60 chars (Nome da página · Nome do app); meta description de 140-160 chars com o benefício; <html lang=\"pt-BR\">; canonical; viewport. Open Graph completo (og:title, og:description, og:image 1200x630, og:type) + twitter:card summary_large_image: sem isso o link compartilhado no WhatsApp/redes aparece pelado.\n\nESTRUTURA: UM <h1> por página com a palavra que a página responde; hierarquia h1>h2>h3 sem pular nível; landmarks (<header>, <main>, <nav>, <footer>); âncoras <a href> reais pra navegação interna (crawler não clica em onClick).\n\nCONTEÚDO: URL limpa e descritiva (/servicos/consultoria, nunca /page2); imagem com alt descritivo; texto REAL na página (conteúdo só via JS depois do load é invisível pra parte dos crawlers: conteúdo crítico vai no HTML).\n\nARQUIVOS DE ROBÔ: robots.txt permitindo o site + apontando o sitemap; sitemap.xml com as páginas públicas; favicon e apple-touch-icon.\n\nDADOS ESTRUTURADOS quando couber: JSON-LD de Organization/LocalBusiness (nome, logo, endereço) em site institucional; Product com preço em página de produto; FAQPage na seção de FAQ. Lembrete técnico: JSON-LD injetado por JS não aparece pra validador simples; coloque no HTML.\n\nPERFORMANCE MÍNIMA (é ranking): imagem comprimida (webp) com dimensões declaradas; fonte com display swap; nada de bloquear render com script gigante no head.\n\nPROIBIDO: keyword stuffing, title repetido entre páginas, description genérica (\"Bem-vindo ao nosso site\"), texto escondido."
  },
  {
    id: "a14",
    name: "shadcn-ui",
    description:
      "Compor com o shadcn real do projeto: variants, tokens, armadilhas conhecidas e formulários.",
    tag: "Global",
    instructions:
      "O projeto tem shadcn/ui REAL instalado (src/components/ui). Regra zero: COMPONHA, nunca reescreva de memória.\n\nUSO CERTO: todo botão é <Button> com variant/size adequados (default, secondary, ghost, destructive, outline; sm/default/lg/icon), todo campo é <Input>/<Textarea> com <Label> associado, modal é <Dialog>, menu é <DropdownMenu>, aviso é <Sonner> (toast). Precisa de um componente que não está em src/components/ui? Peça em install.components, NUNCA escreva a cópia na mão.\n\nCUSTOMIZAÇÃO: variação nova = variante nova via cva no próprio componente (ex: variant \"hero\" no button.jsx), nunca className gigante sobrescrevendo no ponto de uso repetido 10 vezes. Cor SEMPRE via token do tema (bg-primary, text-muted-foreground, border-border): mudar a marca = mudar os tokens do index.css, zero componente tocado.\n\nARMADILHAS CONHECIDAS (cada uma já quebrou app real):\n\nasChild exige UM único filho React válido; <Button asChild><a>...</a></Button> com dois filhos quebra em runtime.\nDialog/Popover/Dropdown renderizam em portal: estilo por descendência do container pai NÃO alcança; estilize pelo próprio componente.\noutline/ghost são transparentes: texto claro em cima some no tema claro; confira os dois temas.\nComponente controlado (Dialog open, Tabs value) precisa do PAR open/onOpenChange, value/onValueChange; só um dos dois congela a UI.\nSelect do shadcn não aceita value=\"\": use undefined pra vazio.\nÍcone dentro de botão: size-4 com gap-2; nunca ícone gigante esticando o botão.\nFORMULÁRIO: campo com erro usa aria-invalid + mensagem abaixo; botão de submit com estado loading (spinner pequeno + disabled) durante o envio.\n\nZ-INDEX E CAMADAS: confie nas camadas do shadcn (portal já resolve); não invente z-index de 3 dígitos por cima."
  }
];

const TOTAL_ASSIGNED = ASSIGNED_SKILLS.length;

export default function SkillsContent({ plan = "free", onCreateSkill, onEditSkill }) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const isPaid = plan && plan !== "free";

  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [expandedAssigned, setExpandedAssigned] = useState(null);
  const [showAllAssigned, setShowAllAssigned] = useState(false);

  const loadSkills = async () => {
    setLoading(true);
    try {
      const list = await base44.entities.Skill.list("-created_date", 100);
      setSkills(list || []);
    } catch (err) {
      console.error("Erro ao carregar habilidades:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isPaid) loadSkills();
  }, [isPaid]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (!e.target.closest("[data-skill-menu]")) setMenuOpenId(null);
    }
    if (menuOpenId) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [menuOpenId]);

  const handleToggle = async (skill) => {
    try {
      await base44.entities.Skill.update(skill.id, { active: !skill.active });
      setSkills((prev) =>
        prev.map((s) => (s.id === skill.id ? { ...s, active: !s.active } : s))
      );
    } catch (err) {
      console.error("Erro ao alternar habilidade:", err);
    }
  };

  const handleDelete = async (skill) => {
    setDeletingId(skill.id);
    try {
      await base44.entities.Skill.delete(skill.id);
      setSkills((prev) => prev.filter((s) => s.id !== skill.id));
      setMenuOpenId(null);
    } catch (err) {
      console.error("Erro ao excluir habilidade:", err);
    }
    setDeletingId(null);
  };

  // Lista de atribuídas: mostra 5 por padrão, todas quando expandido
  const assignedToShow = showAllAssigned ? ASSIGNED_SKILLS : ASSIGNED_SKILLS.slice(0, 5);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 md:px-10 py-5 md:py-8 space-y-5 md:space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-black">Habilidades</h1>
          <p className="text-sm text-gray-500 mt-1">
            Instruções reutilizáveis que a IA segue quando você ativa
          </p>
        </div>

        {/* Two-column layout */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
          {/* Left: Minhas habilidades */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 flex flex-col">
            <h2 className="text-base font-bold text-black mb-1">Minhas habilidades</h2>
            <p className="text-xs text-gray-500 mb-4">
              Cadastre instruções reutilizáveis e ative no chat digitando{" "}
              <span className="font-medium text-black">/nome-da-habilidade</span>.
            </p>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
              </div>
            ) : skills.length === 0 ? (
              <div className="rounded-xl border-2 border-dashed border-gray-200 bg-white flex flex-col items-center text-center px-6 py-10">
                <img
                  src={ASTRONAUT_IMG}
                  alt="Sem habilidades"
                  className="w-40 h-40 object-contain mb-6"
                />
                <p className="text-base font-bold text-black">Crie sua primeira habilidade</p>
                <p className="text-sm text-gray-500 mt-1.5 max-w-xs">
                  Escreva uma vez, ative sempre que precisar, sem repetir contexto em toda conversa.
                </p>
                <button
                  onClick={onCreateSkill}
                  className="mt-6 flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#7C5DCF] text-white text-sm font-medium hover:bg-[#6b4bd0] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Criar primeira habilidade
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="rounded-xl border border-gray-200 bg-white p-3.5 flex items-center gap-3"
                  >
                    <button
                      onClick={() => handleToggle(skill)}
                      className={`relative w-9 h-5 rounded-full transition-colors shrink-0 ${
                        skill.active ? "bg-[#7C5DCF]" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                          skill.active ? "translate-x-4" : "translate-x-0.5"
                        }`}
                      />
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-black">/{skill.name}</span>
                        {skill.active ? (
                          <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-600 text-[10px] font-medium">
                            Ativa
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-[10px] font-medium">
                            Inativa
                          </span>
                        )}
                      </div>
                      {skill.description && (
                        <p className="text-xs text-gray-500 mt-0.5 truncate">{skill.description}</p>
                      )}
                    </div>
                    <div className="relative" data-skill-menu>
                      <button
                        onClick={() => setMenuOpenId(menuOpenId === skill.id ? null : skill.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition-colors shrink-0"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      {menuOpenId === skill.id && (
                        <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                          <button
                            onClick={() => {
                              onEditSkill?.(skill);
                              setMenuOpenId(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors text-left"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(skill)}
                            disabled={deletingId === skill.id}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-500 hover:bg-red-50 transition-colors text-left disabled:opacity-50"
                          >
                            {deletingId === skill.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                            Excluir
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <button
                  onClick={onCreateSkill}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors mt-2"
                >
                  <Plus className="w-4 h-4" />
                  Nova habilidade
                </button>
              </div>
            )}
          </div>

          {/* Right: Atribuídas a você */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 flex flex-col">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-base font-bold text-black">Atribuídas a você</h2>
              <span className="text-xs text-gray-500">{TOTAL_ASSIGNED} habilidades</span>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Habilidades da empresa ou direcionadas a você por um administrador.
            </p>

            <div className="flex-1 space-y-2">
              {assignedToShow.map((skill) => {
                const expanded = expandedAssigned === skill.id;
                return (
                  <div
                    key={skill.id}
                    className="rounded-xl border border-gray-200 bg-white p-3.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-black">/{skill.name}</span>
                          <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-[10px] font-medium shrink-0">
                            {skill.tag}
                          </span>
                        </div>
                        <p
                          className={`text-xs text-gray-500 leading-relaxed ${
                            expanded ? "" : "line-clamp-2"
                          }`}
                        >
                          {skill.description}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          setExpandedAssigned(expanded ? null : skill.id)
                        }
                        className="flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-black transition-colors shrink-0 mt-0.5"
                      >
                        Ver instruções
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform ${
                            expanded ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    </div>

                    {expanded && (
                      <div className="mt-3 rounded-lg bg-[#f7f7f8] p-4">
                        {skill.instructions ? (
                          <div className="space-y-3">
                            {skill.instructions.split("\n\n").map((para, i) => (
                              <p key={i} className="text-xs text-gray-700 leading-relaxed text-left">
                                {para}
                              </p>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-gray-400 italic">
                            Instruções em breve.
                          </p>
                        )}
                        <div className="mt-4 pt-3 border-t border-gray-200 flex items-center gap-1.5">
                          <Lock className="w-3 h-3 text-gray-400" />
                          <span className="text-[11px] text-gray-400">
                            Gerenciada pelo administrador
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setShowAllAssigned((v) => !v)}
              className="mt-4 mx-auto flex items-center justify-center px-4 py-2 rounded-full border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              {showAllAssigned ? "Mostrar menos" : `Ver todas (${TOTAL_ASSIGNED})`}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}