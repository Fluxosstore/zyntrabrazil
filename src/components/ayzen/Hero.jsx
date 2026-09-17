import React from "react";
import { ArrowRight, TrendingDown } from "lucide-react";
import { Image } from "@/components/ui/image";

const aiModels = ["GPT-4", "Claude", "Gemini", "Grok", "DeepSeek"];

export default function Hero() {
  return (
    <section className="relative pt-28 lg:pt-36 pb-16 lg:pb-24 overflow-hidden">
      {/* background image */}
      <Image
        src="https://media.base44.com/images/public/6aab2e6298f803d865228a5d/511df5c24_hero-ayzen-light-orb.png"
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-100"
        fittingType="fill" />
      
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
                Hub de IA profissional
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.75rem] xl:text-[4.25rem] font-bold tracking-tight text-gray-900 leading-[1.05]">
              A Ayzen reúne as IAs mais potentes do mundo. Em uma única{" "}
              <span className="text-violet-600">assinatura</span>.
            </h1>

            <p className="mt-6 text-lg text-gray-500 leading-relaxed max-w-xl">
              A Ayzen é um hub de IA profissional que centraliza os modelos de
              ponta — GPT-4, Claude, Gemini, Grok e DeepSeek — em uma única
              plataforma. Menos custo, mais contexto, zero fricção.
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

            {/* AI model pills */}
            <div className="mt-10 flex flex-wrap items-center gap-2.5">
              {aiModels.map((m) =>
              <span
                key={m}
                className="text-xs font-medium text-gray-500 bg-white border border-gray-200 px-3 py-1.5 rounded-full">
                
                  {m}
                </span>
              )}
            </div>
          </div>

          {/* Right: visual + stats */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-square max-w-[420px] mx-auto">
              



              
              
            </div>

            {/* Stat card */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 lg:left-auto lg:right-0 lg:translate-x-0 bg-white rounded-2xl shadow-xl shadow-gray-300/30 border border-gray-100 px-6 py-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-violet-50 flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-violet-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">67%</div>
                <div className="text-xs text-gray-500">Economia média</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>);

}