import React from "react";
import { Quote } from "lucide-react";

const rowOne = [
  {
    text: "Eu gastava uns R$ 480 por mês entre GPT, Grok e Claude Pro. Migrei pro Pro da Zyntra e cortei mais da metade.",
    metric: "-54%",
    name: "João Vasconcellos",
    role: "COPYWRITER SÊNIOR · STUDIO BELVEDER",
    avatar: "https://images.unsplash.com/photo-1500648766838-d5cf13b1e1b4?w=80&h=80&fit=crop&crop=faces",
  },
  {
    text: "O killer feature é o contexto compartilhado. Debugo com Claude, peço para o Gemini buscar a documentação e finalizo no GPT-5 sem trocar de aba.",
    name: "Mariana Souza",
    role: "ENGENHEIRA DE SOFTWARE · NUBANK",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=faces",
  },
  {
    text: "Sou freelancer e dependo de IA o dia todo. O que me ganhou foi a nota fiscal em real — agora lanço como despesa empresarial sem ginástica.",
    name: "Rafael Tinoco",
    role: "DESIGNER & ESTRATEGISTA · INDEPENDENTE",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=80&h=80&fit=crop&crop=faces",
  },
  {
    text: "Adotamos pro time de marketing. SSO e controle de acesso por workspace foram decisivos — antes era impossível auditar quem usava o quê.",
    name: "Camila Andrade",
    role: "HEAD DE MARKETING · LOFT",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=faces",
  },
];

const rowTwo = [
  {
    text: "Como PM, uso Gemini pra research e Claude pra documentação. Ter ambos no mesmo lugar em uma única assinatura mudou meu fluxo.",
    name: "Beatriz Monteiro",
    role: "PRODUCT MANAGER · IFOOD",
    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b3fba?w=80&h=80&fit=crop&crop=faces",
  },
  {
    text: "Migrei meu time de devs (5 pessoas) e o custo total ficou abaixo do que pagávamos só em ChatGPT Plus separado. Decisão óbvia.",
    metric: "-68%",
    name: "Diego Ramos",
    role: "TECH LEAD · HOTMART",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=faces",
  },
  {
    text: "Crio roteiros com Claude e narrações no ElevenLabs dentro da Zyntra. Pago em real, com NF, sem precisar pedir reembolso de cartão internacional.",
    name: "Fernanda Lima",
    role: "EDITORA DE CONTEÚDO · FOLHA",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=80&h=80&fit=crop&crop=faces",
  },
  {
    text: "Suporte rápido e em português. Resolvi uma dúvida de integração em minutos, sem precisar traduzir nada para o inglês.",
    name: "Lucas Pereira",
    role: "ANALISTA DE DADOS · B3",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop&crop=faces",
  },
];

function Card({ t }) {
  return (
    <div className="w-[340px] sm:w-[380px] shrink-0 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <Quote className="w-8 h-8 text-gray-200" />
        {t.metric && (
          <span className="text-sm font-bold text-gray-900">{t.metric}</span>
        )}
      </div>
      <p className="text-sm text-[#333333] leading-relaxed mb-6 min-h-[80px]">
        {t.text}
      </p>
      <div className="flex items-center gap-3">
        <img
          src={t.avatar}
          alt={t.name}
          className="w-9 h-9 rounded-full object-cover"
        />
        <div>
          <div className="text-sm font-semibold text-gray-900">{t.name}</div>
          <div className="text-[10px] tracking-wider text-[#888888] uppercase">
            {t.role}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsCarousel() {
  return (
    <div className="flex flex-col gap-5 overflow-hidden">
      <div className="flex gap-5 animate-[carousel-left_40s_linear_infinite]">
        {[...rowOne, ...rowOne].map((t, i) => (
          <Card key={`r1-${i}`} t={t} />
        ))}
      </div>
      <div className="flex gap-5 animate-[carousel-right_40s_linear_infinite]">
        {[...rowTwo, ...rowTwo].map((t, i) => (
          <Card key={`r2-${i}`} t={t} />
        ))}
      </div>
    </div>
  );
}