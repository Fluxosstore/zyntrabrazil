import React from "react";
import { Image } from "@/components/ui/image";
import { Check } from "lucide-react";

const cards = [
  {
    title: "Workspace unificado",
    desc: "Todas as IAs, um só histórico. Alterne modelos sem perder contexto.",
    img: "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/6d8cb529e_generated_83658005.jpg",
    points: ["Histórico sincronizado", "Troca de modelo em 1 clique"],
  },
  {
    title: "Chat inteligente",
    desc: "Converse com a IA certa para cada tarefa, sem sair da conversa.",
    img: "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/27ead898a_generated_4ae7b836.jpg",
    points: ["Roteamento automático", "Respostas em segundos"],
  },
  {
    title: "Pensando à frente",
    desc: "Novos modelos entram no plano automaticamente, sem custo extra.",
    img: "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/6d8cb529e_generated_83658005.jpg",
    points: ["Modelos sempre atualizados", "Previsão de tendências"],
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
              className="group relative bg-[#FAFAFA] border border-gray-100 rounded-3xl p-6 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300"
            >
              {/* phone mockup */}
              <div className="relative aspect-[9/16] max-w-[180px] mx-auto mb-6 rounded-2xl overflow-hidden bg-gray-100">
                <Image
                  src={c.img}
                  alt={c.title}
                  className="w-full h-full object-cover"
                  fittingType="fill"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{c.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">
                {c.desc}
              </p>
              <ul className="space-y-2">
                {c.points.map((pt) => (
                  <li
                    key={pt}
                    className="flex items-center gap-2 text-sm text-gray-600"
                  >
                    <span className="w-4 h-4 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                      <Check className="w-2.5 h-2.5 text-violet-600" strokeWidth={3} />
                    </span>
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}