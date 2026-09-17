import React from "react";
import { ArrowUpRight, BookOpen } from "lucide-react";

const featured = {
  tag: "Leitura recomendada",
  title: "Por que pagar 5 assinaturas de IA quando uma resolve?",
  cta: "Abrir artigo",
  img: "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/78dbb0c79_ChatGPTImage17desetde202600_46_49.png",
};

const sidePosts = [
  {
    tag: "Fluxos de trabalho",
    title: "Contexto preservado: troque de IA sem perder a conversa",
  },
  {
    tag: "Modelos de IA",
    title: "ChatGPT vs Claude vs Gemini: qual usar em cada tarefa?",
  },
];

export default function BlogSection() {
  return (
    <section id="blog" className="py-20 lg:py-28 bg-white">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 lg:gap-16 mb-14">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7c5dfa]" />
              <span className="text-xs font-medium tracking-widest text-[#707070] uppercase">
                Conteúdo Ayzen
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold tracking-tight leading-[1.1]">
              <span className="text-[#1a1a1a]">Entenda melhor a IA.</span>
              <br />
              <span className="text-[#7c5dfa]">Use melhor no trabalho.</span>
            </h2>
          </div>
          <div className="lg:max-w-sm lg:mt-16 flex flex-col items-end">
            <p className="text-sm text-[#707070] leading-relaxed mb-5">
              Análises claras e guias práticos para você escolher melhor cada IA
              e aplicar tudo no seu dia a dia.
            </p>
            <a
              href="#"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#1a1a1a] hover:text-[#7c5dfa] transition-colors self-end"
            >
              Acessar o blog
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Large featured card */}
          <a
            href="#"
            className="group relative bg-[#F9F9F9] rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 min-h-[460px] flex flex-col justify-between p-8"
          >
            <div className="flex items-center gap-2 text-[#666666]">
              <BookOpen className="w-4 h-4" />
              <span className="text-xs font-medium tracking-widest uppercase">
                {featured.tag}
              </span>
            </div>
            <img
              src={featured.img}
              alt=""
              className="absolute top-1/2 right-0 -translate-y-1/2 w-1/2 max-w-none object-contain opacity-90 pointer-events-none"
            />
            <div className="relative z-10 max-w-md">
              <h3 className="text-2xl lg:text-3xl font-bold text-[#111111] leading-tight mb-5">
                {featured.title}
              </h3>
              <div className="inline-flex items-center gap-3">
                <span className="text-sm font-semibold text-[#111111]">
                  {featured.cta}
                </span>
                <span className="w-9 h-9 rounded-full border border-[#DDDDDD] flex items-center justify-center group-hover:bg-[#111111] group-hover:border-[#111111] transition-colors">
                  <ArrowUpRight className="w-4 h-4 text-[#111111] group-hover:text-white transition-colors" />
                </span>
              </div>
            </div>
          </a>

          {/* Right column - stacked cards */}
          <div className="flex flex-col gap-6">
            {sidePosts.map((p) => (
              <a
                key={p.title}
                href="#"
                className="group bg-[#F9F9F9] rounded-3xl p-8 flex flex-col justify-between flex-1 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300"
              >
                <div>
                  <span className="text-xs font-medium tracking-widest uppercase text-[#666666]">
                    {p.tag}
                  </span>
                  <h3 className="mt-4 text-lg lg:text-xl font-bold text-[#111111] leading-snug">
                    {p.title}
                  </h3>
                </div>
                <div className="mt-6 pt-5 border-t border-[#E5E5E5] flex justify-end">
                  <span className="w-9 h-9 rounded-full border border-[#DDDDDD] flex items-center justify-center group-hover:bg-[#111111] group-hover:border-[#111111] transition-colors">
                    <ArrowUpRight className="w-4 h-4 text-[#111111] group-hover:text-white transition-colors" />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}