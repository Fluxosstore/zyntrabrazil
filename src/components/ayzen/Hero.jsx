import React from "react";
import { ArrowRight } from "lucide-react";
import { Image } from "@/components/ui/image";

const aiModels = ["GPT-5", "Claude", "Gemini", "Grok", "DeepSeek"];

export default function Hero() {
  return (
    <section className="relative pt-28 lg:pt-36 pb-16 lg:pb-24 overflow-hidden">
      {/* background image */}
      <Image
        src="https://media.base44.com/images/public/6aab2e6298f803d865228a5d/511df5c24_hero-ayzen-light-orb.png"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
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
                Hub de IA Profissional
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight text-gray-900 leading-[1.05]">
              A Ayzen reúne as IAs mais potentes do mundo.
              <br />
              <span className="text-violet-600">Em uma única assinatura.</span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-gray-500 leading-relaxed max-w-xl">
              A Ayzen é um hub de IA profissional. A Ayzen é a plataforma que
              reúne GPT-5, Claude, DeepSeek, Grok e outras IAs de elite em uma
              única interface profissional, com histórico unificado, pagamento
              simplificado em Reais e conectores para Gmail, Google Agenda,
              Contatos, Tarefas e Drive.
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
            <ul className="mt-6 space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                IAs de elite em uma assinatura
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                Histórico unificado entre modelos
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                Pagamento simplificado em Reais
              </li>
            </ul>

            {/* Bottom: included models */}
            <div className="mt-8 text-right">
              <div className="text-xs font-medium text-gray-400 mb-2">
                Inclusas no plano
              </div>
              <div className="flex flex-wrap items-center justify-end gap-2">
                {aiModels.map((m) =>
                <span
                  key={m}
                  className="inline-flex items-center gap-2 text-xs font-medium text-gray-700 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                  {m}
                </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>);

}