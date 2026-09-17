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
        <div className="max-w-3xl mb-14">
          <span className="text-xs font-semibold tracking-widest text-violet-600 uppercase">
            03 — O futuro
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 leading-[1.1]">
            Seu trabalho, mais inteligente. Hoje e no futuro
          </h2>
          <p className="mt-5 text-lg text-gray-500 leading-relaxed">
            Uma plataforma que evolui com você. O que você usa hoje já está
            pronto; o que vem já está incluído.
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