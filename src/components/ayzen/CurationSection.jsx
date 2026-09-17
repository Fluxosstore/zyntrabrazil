import React from "react";
import { Sparkles, Gauge, FileText, Zap, LayoutGrid, CreditCard, Shield } from "lucide-react";

const features = [
  {
    icon: Gauge,
    title: "Performance",
    desc: "Acesso aos modelos mais potentes, sem gargalo de fila.",
  },
  {
    icon: FileText,
    title: "Contexto",
    desc: "Histórico unificado entre todas as IAs em uma só conversa.",
  },
  {
    icon: Zap,
    title: "Velocidade",
    desc: "Respostas em segundos, com prioridade para assinantes.",
  },
  {
    icon: LayoutGrid,
    title: "Modalidades",
    desc: "Texto, imagem, código e voz em um único workspace.",
  },
  {
    icon: CreditCard,
    title: "Cobrança",
    desc: "Um plano, uma fatura em reais. Sem surpresas em dólar.",
  },
  {
    icon: Shield,
    title: "Privacidade",
    desc: "Seus dados não treinam modelos. Criptografia ponta a ponta.",
  },
];

export default function CurationSection() {
  return (
    <section id="ias" className="py-20 lg:py-28 bg-[#FAFAFA]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="max-w-3xl mb-16">
          <span className="text-xs font-semibold tracking-widest text-violet-600 uppercase">
            02 — A curadoria
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 leading-[1.1]">
            Uma curadoria de elite para cada objetivo
          </h2>
          <p className="mt-5 text-lg text-gray-500 leading-relaxed">
            Cada modelo foi escolhido pelo que faz de melhor. A Ayzen orquestra
            tudo para que você só precise pensar.
          </p>
        </div>

        {/* Central hub visual */}
        <div className="relative flex items-center justify-center mb-16 py-8">
          <div className="relative w-[280px] h-[280px] sm:w-[360px] sm:h-[360px]">
            {/* rings */}
            <div className="absolute inset-0 rounded-full border border-dashed border-gray-300" />
            <div className="absolute inset-8 rounded-full border border-gray-200" />
            {/* center */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-2xl shadow-violet-600/30">
                <Sparkles className="w-8 h-8 text-white" strokeWidth={2} />
              </div>
            </div>
            {/* orbiting nodes */}
            {["GPT-4", "Claude", "Gemini", "Grok", "DeepSeek"].map((m, i) => {
              const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
              const r = 140;
              const x = Math.cos(angle) * r;
              const y = Math.sin(angle) * r;
              return (
                <div
                  key={m}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  style={{ transform: `translate(${x}px, ${y}px) translate(-50%, -50%)` }}
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white border border-gray-200 shadow-lg flex items-center justify-center text-[10px] sm:text-xs font-bold text-gray-700">
                    {m}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Feature cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div
              key={i}
              className="group bg-white border border-gray-100 rounded-2xl p-6 hover:border-violet-200 hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center mb-4 group-hover:bg-violet-600 transition-colors">
                <f.icon className="w-5 h-5 text-violet-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">
                {f.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}