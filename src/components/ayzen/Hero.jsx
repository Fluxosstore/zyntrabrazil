import React, { useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import FloatingDots from "@/components/ayzen/FloatingDots";

const aiModels = [
  { name: "GPT-5", logo: "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/0bb1a42e9_chatgpt.svg" },
  { name: "Claude", logo: "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/3fe0894ec_claude.svg" },
  { name: "Gemini", logo: "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/3a4b6ee08_gemini.svg" },
  { name: "Grok", logo: "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/9c7876675_grok.svg" },
  { name: "DeepSeek", logo: "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/d9975d697_deepseek.svg" },
];

export default function Hero() {
  const sectionRef = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setOffset({ x: px * 24, y: py * 24 });
  };

  const handleMouseLeave = () => setOffset({ x: 0, y: 0 });

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative pt-28 lg:pt-36 pb-16 lg:pb-24 overflow-hidden">
      {/* background image with parallax */}
      <Image
        src="https://media.base44.com/images/public/6aab2e6298f803d865228a5d/511df5c24_hero-ayzen-light-orb.png"
        alt=""
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 ease-out will-change-transform scale-110"
        fittingType="fill"
        style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
      />

      {/* floating purple particles rising from bottom to top */}
      <FloatingDots />

      {/* subtle background glow */}
      <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-violet-200/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-40 left-0 w-[400px] h-[400px] bg-indigo-200/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left: copy */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-50 border border-violet-200 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
              <span className="text-xs font-medium text-violet-700">
                Hub de IA Profissional
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold tracking-tight text-gray-900 leading-[1.05]">
              A Zyntra reúne as IAs mais
              <br />
              <span>potentes do mundo.</span>
              <br />
              <span className="text-violet-600">Em uma única assinatura.</span>
            </h1>

            <p className="mt-6 text-sm text-gray-500 leading-relaxed max-w-xl font-light">
              <span className="whitespace-nowrap"><span className="font-bold">A Zyntra é um hub de IA profissional.</span> E a unica plataforma</span>{" "}
              <span className="whitespace-nowrap">que reúne GPT-5, Claude, DeepSeek, Grok e outras IAs de elite</span>{" "}
              <span className="whitespace-nowrap">em uma única interface profissional, com histórico unificado,</span>{" "}
              <span className="whitespace-nowrap">pagamento simplificado em Reais e conectores para Gmail,</span>{" "}
              <span className="whitespace-nowrap">Google Agenda, Contatos, Tarefas e Drive.</span>
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a
                href="#planos"
                className="inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-base font-semibold px-7 py-3.5 rounded-full transition-all shadow-xl shadow-violet-600/25 hover:shadow-violet-600/40 hover:-translate-y-0.5">
                
                Começar agora
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#planos"
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-900 text-base font-semibold px-7 py-3.5 rounded-full border border-gray-200 transition-all">
                
                Ver planos
              </a>
            </div>

            <p className="mt-5 text-sm text-gray-400">
              +1.200 profissionais já usam
            </p>
          </div>

          {/* Right: stats (top) + bullets (middle) + included models (bottom) */}
          <div className="lg:col-span-5 relative self-start">
            {/* Top: stats */}
            <div className="text-right">
              <div className="text-xs font-medium text-gray-500 mb-1">
                Economia média
              </div>
              <div className="text-5xl lg:text-6xl font-bold text-gray-900">
                67%
              </div>
              <div className="text-sm text-gray-500 mt-1">
                vs. assinaturas avulsas
              </div>
            </div>

            {/* Middle: bullets */}
            <ul className="mt-24 space-y-2 text-sm text-gray-600 text-right">
              <li className="flex items-center justify-end gap-2">
                IAs de elite em uma assinatura
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              </li>
              <li className="flex items-center justify-end gap-2">
                Histórico unificado entre modelos
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              </li>
              <li className="flex items-center justify-end gap-2">
                Pagamento simplificado em Reais
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              </li>
            </ul>

            {/* Bottom: included models */}
            <div className="mt-24 text-right">
              <div className="text-xs font-medium text-gray-400 mb-2">
                Inclusas no plano
              </div>
              <div className="flex flex-wrap items-center justify-end gap-2">
                {aiModels.map((m) =>
                <span
                  key={m.name}
                  className="inline-flex items-center gap-2 text-xs font-medium text-gray-700 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full">
                  <img src={m.logo} alt={m.name} className="w-4 h-4 object-contain" />
                  {m.name}
                </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>);

}