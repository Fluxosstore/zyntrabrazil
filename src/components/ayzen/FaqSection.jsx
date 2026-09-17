import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "Tem limite de uso?",
    a: "Os planos pagos oferecem mensagens ilimitadas nos modelos incluídos. O plano Free tem um limite diário de 20 mensagens para você experimentar.",
  },
  {
    q: "Como funciona a cobrança?",
    a: "Tudo é cobrado em reais, uma única fatura por mês. Sem surpresas com câmbio em dólar. No plano anual você economiza o equivalente a dois meses.",
  },
  {
    q: "Posso cancelar quando quiser?",
    a: "Sim. O cancelamento é imediato e sem burocracia. Você mantém o acesso até o fim do período já pago.",
  },
  {
    q: "São os modelos oficiais ou versões abertas?",
    a: "A Zyntra usa os modelos oficiais das empresas (OpenAI, Anthropic, Google, xAI, DeepSeek), com a mesma qualidade e capacidade de contexto.",
  },
  {
    q: "Meus dados treinam algum modelo?",
    a: "Não. Seus dados e conversas nunca são usados para treinar modelos. Tudo é criptografado e permanece privado.",
  },
  {
    q: "Funciona para o meu time?",
    a: "Sim. O plano Empresarial oferece gestão de usuários, faturamento único, permissões e um workspace compartilhado para todo o time.",
  },
];

export default function FaqSection() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="py-20 lg:py-28 bg-[#FAFAFA] border-y border-gray-100">
      <div className="max-w-3xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold tracking-widest text-violet-600 uppercase">
            FAQ
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 leading-[1.1]">
            Perguntas frequentes
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div
              key={i}
              className="bg-white border border-gray-100 rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? -1 : i)}
                className="w-full flex items-center justify-between gap-4 p-5 text-left"
              >
                <span className="text-base font-semibold text-gray-900">
                  {f.q}
                </span>
                <span className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
                  {open === i ? (
                    <Minus className="w-4 h-4 text-violet-600" />
                  ) : (
                    <Plus className="w-4 h-4 text-gray-500" />
                  )}
                </span>
              </button>
              <div
                className={`grid transition-all duration-300 ${
                  open === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-5 text-sm text-gray-500 leading-relaxed">
                    {f.a}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}