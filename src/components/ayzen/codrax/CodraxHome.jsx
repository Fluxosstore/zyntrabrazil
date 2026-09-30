import React from "react";
import { Orbit, ArrowRight, MessageSquare } from "lucide-react";

const ASTRONAUT =
  "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/cb35a24ff_generated_image.png";

const PILLS = ["Telas e componentes", "API e banco de dados", "Publicação com um clique"];

export default function CodraxHome({ onStart }) {
  return (
    <div className="flex-1 overflow-y-auto bg-[#f9fafb]">
      <div className="px-8 py-8">
        {/* Hero */}
        <div className="flex items-center gap-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold text-black leading-tight">
              Do pedido ao app no ar, sem sair da conversa
            </h1>
            <p className="text-sm text-gray-500 mt-3 leading-relaxed">
              Descreva o que precisa. A IA escreve o código, roda o preview e publica no seu endereço.
            </p>
            <div className="flex flex-wrap gap-2 mt-5">
              {PILLS.map((p) => (
                <span
                  key={p}
                  className="px-3 py-1.5 rounded-full border border-gray-200 bg-white text-xs font-medium text-gray-700"
                >
                  {p}
                </span>
              ))}
            </div>
            <button
              onClick={onStart}
              className="mt-6 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#7c3aed] text-white text-sm font-medium hover:bg-[#6d28d9] transition-colors"
            >
              Começar meu app
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="hidden lg:block shrink-0">
            <img src={ASTRONAUT} alt="" className="w-64 h-64 object-contain" />
          </div>
        </div>

        {/* Empty state card */}
        <div className="mt-8 md:mt-10 rounded-2xl border border-dashed border-gray-300 bg-white p-10 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center mb-4">
            <Orbit className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-base font-bold text-black">Nenhum projeto ainda</h3>
          <p className="text-sm text-gray-500 mt-1.5 max-w-md leading-relaxed">
            Descreva o app que você quer e a IA cria do zero: telas, código e preview no ar.
          </p>
          <button
            onClick={onStart}
            className="mt-5 px-5 py-2.5 rounded-full bg-[#7c3aed] text-white text-sm font-medium hover:bg-[#6d28d9] transition-colors"
          >
            Começar meu app
          </button>
        </div>
      </div>

      {/* Feedback floating button */}
      <button className="fixed bottom-6 right-6 px-4 py-2.5 rounded-full bg-[#4c1d95] text-white text-sm font-medium shadow-lg hover:bg-[#3b1773] transition-colors flex items-center gap-1.5 z-30">
        <MessageSquare className="w-4 h-4" />
        Feedback
      </button>
    </div>
  );
}