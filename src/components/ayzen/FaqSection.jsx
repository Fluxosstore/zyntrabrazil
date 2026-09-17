import React, { useState } from "react";
import { ChevronDown, ChevronUp, ArrowUp } from "lucide-react";

const faqs = [
  {
    num: "01",
    cat: "Uso e limites",
    q: "Tem limite de uso ou rate limit?",
    a: "No plano Pro o uso é ilimitado, dentro de uma política de uso justo. Você acessa modelos de ponta como GPT-5, Claude e Gemini em uma única interface, sem precisar gerenciar várias assinaturas.",
  },
  {
    num: "02",
    cat: "Pagamentos",
    q: "Como funciona a cobrança e a nota fiscal?",
    a: "Tudo é cobrado em reais, uma única fatura por mês. Sem surpresas com câmbio em dólar. No plano anual você economiza o equivalente a dois meses.",
  },
  {
    num: "03",
    cat: "Assinatura",
    q: "Posso cancelar quando quiser?",
    a: "Sim. O cancelamento é imediato e sem burocracia. Você mantém o acesso até o fim do período já pago.",
  },
  {
    num: "04",
    cat: "Modelos",
    q: "São os modelos oficiais ou versões abertas?",
    a: "A Zyntra usa os modelos oficiais das empresas (OpenAI, Anthropic, Google, xAI, DeepSeek), com a mesma qualidade e capacidade de contexto.",
  },
  {
    num: "05",
    cat: "Privacidade",
    q: "Meus dados treinam algum modelo?",
    a: "Não. Seus dados e conversas nunca são usados para treinar modelos. Tudo é criptografado e permanece privado.",
  },
  {
    num: "06",
    cat: "Times",
    q: "Funciona para o meu time?",
    a: "Sim. O plano Empresarial oferece gestão de usuários, faturamento único, permissões e um workspace compartilhado para todo o time.",
  },
];

export default function FaqSection() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="relative py-20 lg:py-28 bg-white">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Left card with background image */}
          <div className="relative rounded-3xl overflow-hidden min-h-[560px] flex flex-col justify-between p-8 lg:p-10">
            <img
              src="https://media.base44.com/images/public/6aab2e6298f803d865228a5d/3fad8c105_generated_image.png"
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <div className="relative z-10">
              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight leading-[1.05]">
                <span className="text-black">Respostas diretas.</span>
                <br />
                <span className="text-[#8b5cf6]">Antes de você decidir.</span>
              </h2>
              <p className="mt-5 text-sm text-[#475569] leading-relaxed max-w-sm">
                Planos, cobrança, privacidade e limites — tudo explicado com
                clareza, sem letras miúdas.
              </p>
            </div>
            <div className="relative z-10">
              <button className="inline-flex items-center gap-2 bg-white border border-[#cbd5e1] rounded-full px-5 py-2.5 text-sm font-semibold text-[#111111] hover:bg-gray-50 transition-colors">
                Falar com o time
              </button>
            </div>
          </div>

          {/* Right column - FAQ list */}
          <div className="divide-y divide-[#e2e8f0]">
            {faqs.map((f, i) => (
              <div key={i} className="py-6">
                <button
                  onClick={() => setOpen(open === i ? -1 : i)}
                  className="w-full flex items-start justify-between gap-6 text-left"
                >
                  <div className="flex items-start gap-5">
                    <span className="text-sm font-semibold text-[#94a3b8] tabular-nums pt-1">
                      {f.num}
                    </span>
                    <div>
                      <span className="block text-xs font-medium tracking-widest uppercase text-[#94a3b8] mb-1.5">
                        {f.cat}
                      </span>
                      <span className="text-base lg:text-lg font-bold text-[#111111] leading-snug">
                        {f.q}
                      </span>
                    </div>
                  </div>
                  <span className="w-8 h-8 rounded-full border border-[#e2e8f0] flex items-center justify-center flex-shrink-0 mt-1">
                    {open === i ? (
                      <ChevronUp className="w-4 h-4 text-[#111111]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#111111]" />
                    )}
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-300 ${
                    open === i ? "grid-rows-[1fr] mt-4" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="pl-10 text-sm text-[#475569] leading-relaxed max-w-lg">
                      {f.a}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating action button */}
      <button className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-[#8b5cf6] flex items-center justify-center shadow-lg shadow-violet-300 hover:bg-[#7c3aed] transition-colors z-50">
        <ArrowUp className="w-5 h-5 text-white" />
      </button>
    </section>
  );
}