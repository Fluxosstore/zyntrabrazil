import React from "react";

const metrics = [
  { value: "800+", label: "profissionais ativos" },
  { value: "-54%", label: "custo médio reduzido" },
  { value: "4.9/5", label: "avaliação NPS" },
];

const testimonials = [
  {
    name: "Marina Costa",
    role: "Designer de Produto",
    text: "Cancelei quatro assinaturas depois da Ayzen. O contexto unificado mudou meu fluxo completamente.",
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
    text: "Meu time inteiro usa a Ayzen. O plano empresarial centralizou tudo e barateou o stack.",
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
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-semibold tracking-widest text-violet-600 uppercase">
            Depoimentos
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 leading-[1.1]">
            Profissionais que centralizaram suas IAs e cortaram custos.
          </h2>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-4 mb-14 max-w-3xl">
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

        {/* Testimonial grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white text-sm font-bold">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">
                    {t.name}
                  </div>
                  <div className="text-xs text-gray-400">{t.role}</div>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                "{t.text}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}