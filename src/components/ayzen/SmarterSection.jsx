import React from "react";
import { Image } from "@/components/ui/image";

const cards = [
  {
    num: "01",
    title: "Workspace unificado.",
    desc: "Todas as IAs, um só histórico. Alterne modelos sem perder contexto, com tudo sincronizado em uma única interface profissional.",
    img: "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/f948e298d_Capturadetela2026-09-17000242.png",
    stats: [
      { value: "1", label: "histórico só" },
      { value: "1-clique", label: "troca de IA" },
    ],
  },
  {
    num: "02",
    title: "Chat inteligente.",
    desc: "Converse com a IA certa para cada tarefa, sem sair da conversa. Roteamento automático e respostas em segundos.",
    img: "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/31e754706_Capturadetela2026-09-17000222.png",
    stats: [
      { value: "Auto", label: "roteamento" },
      { value: "Seg", label: "resposta" },
    ],
  },
  {
    num: "03",
    title: "Pensando à frente.",
    desc: "Novos modelos entram no plano automaticamente, sem custo extra. Você sempre usa o que há de mais avançado.",
    img: "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/8728b9d33_Capturadetela2026-09-17000255.png",
    stats: [
      { value: "0", label: "custo extra" },
      { value: "Auto", label: "atualizações" },
    ],
  },
];

export default function SmarterSection() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 lg:gap-16 mb-14">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl font-bold text-black">03</span>
              <span className="w-px h-6 bg-gray-300" />
              <span className="text-sm font-medium text-gray-400">/06 Por que Zyntra</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold tracking-tight text-gray-900 leading-[1.1]">
              Seu trabalho, mais inteligente.
              <br />
              <span className="text-violet-600">Hoje e no futuro.</span>
            </h2>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed lg:max-w-sm lg:mt-16">
            A Zyntra já centraliza IAs de elite e evolui para conectar
            ferramentas, automatizar fluxos e transformar ideias em produtos
            digitais.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((c, i) => (
            <div
              key={i}
              className="group relative aspect-[3/4] rounded-[28px] overflow-hidden shadow-lg hover:shadow-xl hover:shadow-violet-300/40 transition-all duration-300"
            >
              <Image
                src={c.img}
                alt={c.title}
                className="absolute inset-0 w-full h-full object-cover"
                fittingType="fill"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/85 to-white/95" />
              <div className="relative h-full flex flex-col p-6">
                <span className="inline-flex self-start items-center px-2.5 py-1 rounded-full bg-[#444] text-white text-xs font-semibold">
                  {c.num}
                </span>
                <div className="mt-auto">
                  <h3 className="text-xl font-bold text-[#222] mb-2">{c.title}</h3>
                  <p className="text-sm text-[#666] leading-relaxed">
                    {c.desc}
                  </p>
                  <div className="h-px bg-gray-200 my-4" />
                  <div className="flex items-end justify-between gap-3">
                    <div className="space-y-1">
                      {c.stats.map((s) => (
                        <div key={s.label} className="text-sm">
                          <span className="font-bold text-[#222]">{s.value}</span>{" "}
                          <span className="text-[#999]">{s.label}</span>
                        </div>
                      ))}
                    </div>
                    <a
                      href="#planos"
                      className="inline-flex items-center justify-center bg-[#7F56D9] hover:bg-[#6941C6] text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors whitespace-nowrap"
                    >
                      Ver planos
                    </a>
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