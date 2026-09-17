import React from "react";
import { Receipt, Layers, Clock } from "lucide-react";

const pains = [
  {
    icon: Receipt,
    title: "Cinco assinaturas, cinco faturas em dólar",
    metric: "R$ 247",
    sub: "por mês, somando tudo",
  },
  {
    icon: Layers,
    title: "Histórico espalhado em mil abas",
    metric: "14 abas",
    sub: "abertas ao mesmo tempo",
  },
  {
    icon: Clock,
    title: "Limite baixo, espera longa",
    metric: "3 horas",
    sub: "de espera por resposta",
  },
];

export default function PainSection() {
  return (
    <section id="beneficios" className="py-20 lg:py-28 bg-white border-y border-gray-100">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="max-w-3xl mb-14">
          <span className="text-xs font-semibold tracking-widest text-violet-600 uppercase">
            01 — O problema
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 leading-[1.1]">
            Você está pagando caro para pensar em pedaços
          </h2>
          <p className="mt-5 text-lg text-gray-500 leading-relaxed">
            Cada modelo brilha em algo. Mas alternar entre eles vira um ritual
            caro, fragmentado e lento.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {pains.map((p, i) => (
            <div
              key={i}
              className="group relative bg-[#FAFAFA] border border-gray-100 rounded-2xl p-7 hover:border-violet-200 hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-xl bg-gray-100 group-hover:bg-violet-50 flex items-center justify-center mb-6 transition-colors">
                <p.icon className="w-5 h-5 text-gray-600 group-hover:text-violet-600 transition-colors" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 leading-snug mb-4">
                {p.title}
              </h3>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900">
                  {p.metric}
                </span>
                <span className="text-sm text-gray-400">{p.sub}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}