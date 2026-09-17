import React from "react";

const cards = [
  {
    number: "01",
    heading: "Cinco assinaturas, cinco faturas em dólar",
    body: "GPT-5, Claude, Gemini, Grok e outras ferramentas. Cada uma renova num dia diferente, cobra em dólar e espalha seu trabalho. Sua fatura só cresce.",
    metric: "R$ 247",
    metricLabel: "por mês em IA",
  },
  {
    number: "02",
    heading: "Histórico espalhado em mil abas",
    body: "Aquela conversa boa está perdida em alguma das 14 abas abertas. Trocar de IA significa perder contexto, copiar, colar, e começar do zero — toda vez.",
    metric: "14 abas",
    metricLabel: "para uma tarefa",
  },
  {
    number: "03",
    heading: "Limite baixo, espera longa",
    body: "Você usa, esbarra no limite, espera 3 horas, paga premium, esbarra de novo. E desiste justo na hora em que precisava da ferramenta funcionando.",
    metric: "3 horas",
    metricLabel: "de espera por uso",
  },
];

export default function PainSection() {
  return (
    <section id="beneficios" className="relative py-20 lg:py-28 bg-[#f9f9fb] overflow-hidden">
      {/* ambient purple glows behind cards */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-violet-300/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-300/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-[1280px] mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl font-bold text-black">01</span>
              <span className="w-px h-6 bg-gray-300" />
              <span className="text-sm font-medium text-gray-400">/06 Hoje está assim</span>
            </div>
            <h2 className="mt-4 text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold tracking-tight text-gray-900 leading-[1.1]">
              Você está pagando caro{" "}
              <span className="text-violet-600 whitespace-nowrap">para pensar em pedaços.</span>
            </h2>
          </div>
          <p className="text-base text-gray-500 leading-relaxed lg:max-w-sm lg:text-right">
            Cinco assinaturas, cinco contas em dólar, contexto perdido a cada
            troca de IA. Reconhece a sensação?
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-5">
          {cards.map((c, i) => (
            <div
              key={i}
              className="relative group flex flex-col bg-[#fcfcfd] border border-gray-100 rounded-2xl p-7 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(124,58,237,0.08)] hover:border-violet-200 transition-all duration-300 overflow-hidden"
            >
              {/* glowing orb top-right */}
              <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br from-white to-[#d6caff] blur-2xl opacity-70 pointer-events-none" />

              {/* large thin number top-left */}
              <span className="relative block text-5xl font-thin text-[#d1d1d1] leading-none mb-8">
                {c.number}
              </span>

              <div className="relative flex-1 flex flex-col">
                <h3 className="text-lg font-semibold text-gray-900 leading-snug mb-4">
                  {c.heading}
                </h3>
                <p className="text-sm text-[#71717a] leading-relaxed mb-8">
                  {c.body}
                </p>

                <div className="mt-auto">
                  <div className="h-px bg-[#e4e4e7] mb-5" />

                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-gray-900">
                      {c.metric}
                    </span>
                    <span className="text-sm text-[#71717a]">{c.metricLabel}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}