import React from "react";
import TestimonialsCarousel from "./TestimonialsCarousel";

const metrics = [
  { value: "800+", label: "profissionais ativos" },
  { value: "-54%", label: "custo médio reduzido" },
  { value: "4.9/5", label: "avaliação NPS" },
];

const testimonials = [
  {
    name: "Marina Costa",
    role: "Designer de Produto",
    text: "Cancelei quatro assinaturas depois da Zyntra. O contexto unificado mudou meu fluxo completamente.",
  },
  {
    name: "Rafael Mendes",
    role: "Desenvolvedor Full-stack",
    text: "Alterno Claude e GPT-4 sem sair da conversa. A economia em dólar sozinha já se paga.",
  },
  {
    name: "Juliana Prado",
    role: "Head de Conteúdo",
    text: "A integração com Gmail e Agenda poupa horas por semana. Parece mágica, mas é só organização.",
  },
  {
    name: "Bruno Tavares",
    role: "Consultor Financeiro",
    text: "Paguei R$ 247 por mês em dólar. Hoje pago menos da metade e tenho mais modelos.",
  },
  {
    name: "Camila Rocha",
    role: "Fundadora, Startup",
    text: "Meu time inteiro usa a Zyntra. O plano empresarial centralizou tudo e barateou o stack.",
  },
  {
    name: "Diego Almeida",
    role: "Pesquisador de IA",
    text: "A curadoria de modelos é impecável. DeepSeek para código, Claude para escrita, Gemini para web.",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 lg:py-28 bg-[#FAFAFA] border-y border-gray-100">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 lg:gap-16 mb-14">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#7c3aed]" />
              <span className="text-xs font-medium tracking-widest text-gray-500 uppercase">
                Quem já usa
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold tracking-tight leading-[1.1]">
              <span className="text-black">Profissionais que centralizaram</span>
              <br />
              <span className="text-[#7c3aed]">suas IAs e cortaram custos.</span>
            </h2>
          </div>
          <p className="text-sm text-[#71717a] leading-relaxed lg:max-w-sm lg:mt-16">
            Não pedimos para escreverem isso. São pessoas reais que migraram
            de várias assinaturas para uma só.
          </p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-4 mb-14 max-w-3xl mx-auto">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="bg-white border border-gray-100 rounded-2xl p-5 text-center"
            >
              <div className="text-2xl sm:text-3xl font-bold text-violet-600">
                {m.value}
              </div>
              <div className="text-xs sm:text-sm text-gray-500 mt-1">
                {m.label}
              </div>
            </div>
          ))}
        </div>

        {/* Testimonial carousel */}
        <TestimonialsCarousel />
      </div>
    </section>
  );
}