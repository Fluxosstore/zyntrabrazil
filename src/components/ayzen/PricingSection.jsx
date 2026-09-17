import React, { useState } from "react";
import { Check, Star, Sparkles, Bot } from "lucide-react";

const plans = [
{
  name: "Zyntra Free",
  price: { mensal: "R$ 0", anual: "R$ 0" },
  period: "para sempre",
  tag: null,
  desc: "Para experimentar o hub.",
  features: [
  "3 modelos disponíveis",
  "Limite diário de 20 mensagens",
  "Histórico de 7 dias",
  "Suporte da comunidade"],

  cta: "Começar grátis",
  highlight: false
},
{
  name: "Starter",
  price: { mensal: "R$ 90,00", anual: "R$ 75,00" },
  period: "/mês",
  tag: "Mais popular",
  desc: "Para profissionais autônomos.",
  features: [
  "8 modelos de elite",
  "Mensagens ilimitadas",
  "Histórico ilimitado",
  "Integrações Google",
  "Suporte prioritário"],

  cta: "Assinar Starter",
  highlight: true
},
{
  name: "Pessoal Premium",
  price: { mensal: "R$ 149,90", anual: "R$ 124,90" },
  period: "/mês",
  tag: null,
  desc: "Para quem vive de IA.",
  features: [
  "Todos os modelos, incluindo Opus",
  "Mensagens ilimitadas",
  "Contexto expandido (200k)",
  "Integrações Google + Drive",
  "Suporte dedicado 24/7"],

  cta: "Assinar Premium",
  highlight: false
}];


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

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-gray-100 rounded-full p-1">
            {["pessoal", "empresarial"].map((t) =>
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-2 text-sm font-medium rounded-full transition-all capitalize ${
              tab === t ?
              "bg-white text-gray-900 shadow-sm" :
              "text-gray-500 hover:text-gray-700"}`
              }>
              
                {t === "pessoal" ? "Pessoal" : "Empresarial"}
              </button>
            )}
          </div>
        </div>

        {/* Cycle toggle */}
        <div className="flex justify-center items-center gap-3 mb-12">
          <span
            className={`text-sm font-medium ${
            cycle === "mensal" ? "text-gray-900" : "text-gray-400"}`
            }>
            
            Mensal
          </span>
          <button
            onClick={() => setCycle(cycle === "mensal" ? "anual" : "mensal")}
            className="relative w-12 h-6 rounded-full bg-gray-200 transition-colors">
            
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
              cycle === "anual" ? "translate-x-6 bg-violet-600" : ""}`
              } />
            
          </button>
          <span
            className={`text-sm font-medium ${
            cycle === "anual" ? "text-gray-900" : "text-gray-400"}`
            }>
            
            Anual
          </span>
          <span className="text-xs font-semibold text-violet-600 bg-violet-50 px-2.5 py-1 rounded-full">
            2 meses grátis
          </span>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) =>
          plan.name === "Zyntra Free" ?
          <div
            key={plan.name}
            className="relative bg-white border border-[#e5e5e5] rounded-3xl p-8 flex flex-col">
            
                <h3 className="text-lg font-bold text-[#111111]">Zyntra Free</h3>
                <p className="text-sm text-[#666666] mt-1.5 leading-relaxed">
                  Plano gratuito permanente. Chat com IAs gratuitas e fallback
                  automático.
                </p>
                <hr className="my-6 border-[#e5e5e5]" />
                <div className="text-4xl font-bold text-[#111111]">Grátis</div>
                <ul className="mt-6 space-y-3">
                  <li className="flex items-center gap-2.5 text-sm font-medium text-[#111111]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
                    Mensagens ilimitadas
                  </li>
                </ul>
                <hr className="my-6 border-[#e5e5e5]" />
                <ul className="space-y-3">
                  {[
              "Chat com modelos gratuitos",
              "Fallback automático se um modelo falhar",
              "Sem cartão, sem expiração"].
              map((f) =>
              <li
                key={f}
                className="flex items-center gap-2.5 text-sm text-[#666666]">
                
                      <span className="w-1.5 h-1.5 rounded-full bg-[#d1d5db]" />
                      {f}
                    </li>
              )}
                </ul>
                <hr className="my-6 border-[#e5e5e5]" />
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#666666]">
                    IAs incluídas
                  </span>
                  <span className="text-xs font-semibold text-[#111111]">
                    3 modelos
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 bg-white border border-[#e5e5e5] rounded-full px-3 py-1.5 text-xs font-medium text-[#111111]">
                    <Sparkles className="w-3 h-3 text-[#8B5CF6]" />
                    Gemma 4 31B
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-white border border-[#e5e5e5] rounded-full px-3 py-1.5 text-xs font-medium text-[#111111]">
                    <Bot className="w-3 h-3 text-[#111111]" />
                    Gemini
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-white border border-[#e5e5e5] rounded-full px-3 py-1.5 text-xs font-medium text-[#111111]">
                    <Bot className="w-3 h-3 text-[#111111]" />
                    DeepSeek
                  </span>
                </div>
              </div> :

          <div
            key={plan.name}
            className={`relative rounded-3xl p-8 transition-all duration-300 ${
            plan.highlight ?
            "bg-gray-900 border-2 border-violet-500 shadow-2xl shadow-violet-500/20 lg:scale-105" :
            "bg-[#FAFAFA] border border-gray-200 hover:border-violet-200 hover:shadow-lg"}`
            }>
            
                {plan.tag &&
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 bg-violet-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    <Star className="w-3 h-3 fill-white" />
                    {plan.tag}
                  </div>
            }
                <h3
              className={`text-lg font-bold ${
              plan.highlight ? "text-white" : "text-gray-900"}`
              }>
              
                  {plan.name}
                </h3>
                <p
              className={`text-sm mt-1 ${
              plan.highlight ? "text-gray-400" : "text-gray-500"}`
              }>
              
                  {plan.desc}
                </p>
                <div className="mt-5 flex items-baseline gap-1">
                  <span
                className={`text-3xl font-bold ${
                plan.highlight ? "text-white" : "text-gray-900"}`
                }>
                
                    {plan.price[cycle]}
                  </span>
                  <span
                className={`text-sm ${
                plan.highlight ? "text-gray-400" : "text-gray-400"}`
                }>
                
                    {plan.period}
                  </span>
                </div>

                <button
              className={`mt-6 w-full py-3 rounded-full text-sm font-semibold transition-all ${
              plan.highlight ?
              "bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-600/30" :
              "bg-white border border-gray-200 text-gray-900 hover:border-violet-300 hover:bg-gray-50"}`
              }>
              
                  {plan.cta}
                </button>

                <ul className="mt-7 space-y-3">
                  {plan.features.map((f) =>
              <li
                key={f}
                className={`flex items-start gap-2.5 text-sm ${
                plan.highlight ? "text-gray-300" : "text-gray-600"}`
                }>
                
                      <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  plan.highlight ? "bg-violet-500/20" : "bg-violet-100"}`
                  }>
                  
                        <Check
                    className={`w-2.5 h-2.5 ${
                    plan.highlight ? "text-violet-400" : "text-violet-600"}`
                    }
                    strokeWidth={3} />
                  
                      </span>
                      {f}
                    </li>
              )}
                </ul>
              </div>

          )}
        </div>
      </div>
    </section>);

}