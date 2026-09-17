import React, { useState } from "react";
import { Star } from "lucide-react";

const GEMINI = "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/c545d8735_gemini.svg";
const DEEPSEEK = "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/d6d9b4c6f_deepseek.svg";
const GPT = "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/698f8c822_chatgpt.svg";
const CLAUDE = "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/c0a57947c_claude.svg";
const GROK = "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/ad894e6fd_grok.svg";

const plans = [
  {
    name: "Zyntra Free",
    desc: "Plano gratuito permanente. Chat com IAs gratuitas e fallback automático.",
    price: { mensal: "Grátis", anual: "Grátis" },
    period: null,
    highlightFeature: "Mensagens ilimitadas",
    features: [
      "Chat com modelos gratuitos",
      "Fallback automático se um modelo falhar",
      "Sem cartão, sem expiração",
    ],
    modelsCount: "1 modelo",
    models: [{ src: DEEPSEEK, label: "DeepSeek" }],
    cta: "Começar grátis",
    tag: null,
  },
  {
    name: "Starter",
    desc: "Para profissionais autônomos. Acesso aos modelos de elite com mensagens ilimitadas.",
    price: { mensal: "R$ 90,00", anual: "R$ 75,00" },
    period: "/mês",
    highlightFeature: "Mensagens ilimitadas",
    features: [
      "3 modelos de elite",
      "Histórico ilimitado",
      "Integrações Google",
      "Suporte prioritário",
    ],
    modelsCount: "3 modelos",
    models: [{ src: GEMINI, label: "Gemini" }, { src: DEEPSEEK, label: "DeepSeek" }, { src: GPT, label: "GPT" }],
    cta: "Assinar Starter",
    tag: "Mais popular",
  },
  {
    name: "Pessoal Premium",
    desc: "Para quem vive de IA. Todos os modelos, incluindo Opus, com contexto expandido.",
    price: { mensal: "R$ 149,90", anual: "R$ 124,90" },
    period: "/mês",
    highlightFeature: "Mensagens ilimitadas",
    features: [
      "Todos os modelos, incluindo Opus",
      "Contexto expandido (200k)",
      "Integrações Google + Drive",
      "Suporte dedicado 24/7",
    ],
    modelsCount: "5 modelos",
    models: [{ src: GEMINI, label: "Gemini" }, { src: DEEPSEEK, label: "DeepSeek" }, { src: CLAUDE, label: "Claude" }, { src: GROK, label: "Grok" }, { src: GPT, label: "GPT-5" }],
    cta: "Assinar Premium",
    tag: null,
  },
];

function PlanCard({ plan, cycle }) {
  return (
    <div className="relative bg-white border border-[#e5e5e5] rounded-3xl p-8 flex flex-col">
      {plan.tag && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 bg-violet-600 text-white text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
          <Star className="w-3 h-3 fill-white" />
          {plan.tag}
        </div>
      )}
      <h3 className="text-lg font-bold text-[#111111]">{plan.name}</h3>
      <p className="text-sm text-[#666666] mt-1.5 leading-relaxed">{plan.desc}</p>
      <hr className="my-6 border-[#e5e5e5]" />
      <div className="flex items-baseline gap-1">
        <span className="text-4xl font-bold text-[#111111]">{plan.price[cycle]}</span>
        {plan.period && <span className="text-sm text-[#666666]">{plan.period}</span>}
      </div>
      <ul className="mt-6 space-y-3">
        <li className="flex items-center gap-2.5 text-sm font-medium text-[#111111]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
          {plan.highlightFeature}
        </li>
      </ul>
      <hr className="my-6 border-[#e5e5e5]" />
      <ul className="space-y-3">
        {plan.features.map((f) => (
          <li key={f} className="flex items-center gap-2.5 text-sm text-[#666666]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d1d5db]" />
            {f}
          </li>
        ))}
      </ul>
      <hr className="my-6 border-[#e5e5e5]" />
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-[#666666]">IAs incluídas</span>
        <span className="text-xs font-semibold text-[#111111]">{plan.modelsCount}</span>
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {plan.models.map((m, i) =>
          m.more ? (
            <span
              key={i}
              className="inline-flex items-center bg-[#F8F9FA] border border-[#E5E7EB] rounded-full px-2.5 py-1 text-xs font-medium text-[#374151]"
            >
              +{m.more}
            </span>
          ) : (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-full px-2.5 py-1 text-xs font-medium text-[#374151]"
            >
              <img src={m.src} alt="" className="w-3.5 h-3.5 object-contain" />
              {m.label}
            </span>
          )
        )}
      </div>
      <button className="mt-6 w-full py-3 rounded-full text-sm font-semibold text-black bg-white border border-[#D1D1D1] hover:border-violet-300 hover:bg-gray-50 transition-colors">
        {plan.cta}
      </button>
    </div>
  );
}

export default function PricingSection() {
  const [cycle, setCycle] = useState("mensal");
  const [tab, setTab] = useState("pessoal");

  return (
    <section id="planos" className="py-20 lg:py-28 bg-[#F9FAFB]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
            <span className="text-xs font-medium tracking-widest text-[#374151] uppercase">
              Planos
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold tracking-tight leading-[1.1]">
            <span className="text-[#111827]">Escolha um plano.</span>
            <br />
            <span className="text-[#8B5CF6]">Pare de pagar cinco.</span>
          </h2>
          <p className="mt-6 text-base sm:text-lg text-[#6B7280] leading-relaxed">
            Cobrança em real, nota fiscal incluída e cancelamento a qualquer
            momento. Sem fidelidade, sem letra miúda.
          </p>
          <p className="mt-8 text-sm text-[#6B7280]">
            Faturado mensalmente • Cancele quando quiser
          </p>
        </div>

        {/* Tabs + Cycle toggle side by side */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 mb-12">
          <div className="inline-flex bg-gray-100 rounded-full p-1">
            {["pessoal", "empresarial"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-6 py-2 text-sm font-medium rounded-full transition-all capitalize ${
                  tab === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {t === "pessoal" ? "Pessoal" : "Empresarial"}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className={`text-sm font-medium ${cycle === "mensal" ? "text-gray-900" : "text-gray-400"}`}>
              Mensal
            </span>
            <button
              onClick={() => setCycle(cycle === "mensal" ? "anual" : "mensal")}
              className="relative w-12 h-6 rounded-full bg-gray-200 transition-colors"
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  cycle === "anual" ? "translate-x-6 bg-violet-600" : ""
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${cycle === "anual" ? "text-gray-900" : "text-gray-400"}`}>
              Anual
            </span>
            <span className="text-xs font-semibold text-violet-600 bg-violet-50 px-2.5 py-1 rounded-full">
              2 meses grátis
            </span>
          </div>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-start">
          {plans.map((plan) => (
            <PlanCard key={plan.name} plan={plan} cycle={cycle} />
          ))}
        </div>
      </div>
    </section>
  );
}