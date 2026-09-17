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
        <div className="mb-16 grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Left: text */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl font-bold text-black">02</span>
              <span className="w-px h-6 bg-gray-300" />
              <span className="text-sm font-medium text-gray-400">/06 O catálogo</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold tracking-tight text-gray-900 leading-[1.1]">
              Uma curadoria de elite
              <br />
              <span className="text-violet-600">para cada objetivo.</span>
            </h2>
            <p className="mt-5 text-sm text-[#71717a] leading-relaxed">
              Não oferecemos volume, oferecemos performance. De modelos de
              raciocínio avançado como GPT-5 e Claude a especialistas como
              DeepSeek, Qwen e Mistral Large. Em breve: expansão total para
              geração de imagens, vídeos e áudio profissional.
            </p>
          </div>

          {/* Right: data cards */}
          <div className="flex gap-3 mt-24 lg:mt-32">
            <div className="flex-1 bg-white border border-gray-200 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-black">9+</div>
              <div className="mt-1 text-xs text-gray-500">IAs integradas</div>
            </div>
            <div className="flex-1 bg-white border border-gray-200 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-black">2</div>
              <div className="mt-1 text-xs text-gray-500">Modalidades</div>
            </div>
            <div className="flex-1 bg-white border border-gray-200 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-black">1</div>
              <div className="mt-1 text-xs text-gray-500">Assinatura</div>
            </div>
          </div>
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