import React from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import { Image } from "@/components/ui/image";

const footerCols = [
  {
    title: "Produto",
    links: ["IAs", "Benefícios", "Planos", "FAQ"],
  },
  {
    title: "Guias e Conteúdo",
    links: ["Blog", "ChatGPT vs Claude vs Gemini", "Centralizar IAs", "Glossário de IA"],
  },
  {
    title: "Legal",
    links: ["Termos de Uso", "Política de Privacidade", "Cookies"],
  },
];

export default function Footer() {
  return (
    <footer className="bg-white">
      {/* Pre-footer CTA */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://media.base44.com/images/public/6aab2e6298f803d865228a5d/66af2ae0c_generated_a031b5b3.jpg"
            alt="Pessoa em uma duna olhando para uma estrutura brilhante"
            className="w-full h-full object-cover"
            fittingType="fill"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-950/50 to-gray-950/30" />
        </div>
        <div className="relative px-6 lg:px-10 py-24 lg:py-36 text-center">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.05] max-w-3xl mx-auto">
            Centralize. Evolua. Pense à frente.
          </h2>
          <p className="mt-6 text-lg text-gray-300 max-w-xl mx-auto">
            Uma assinatura. Todas as IAs. Sem fricção.
          </p>
          <a
            href="#planos"
            className="mt-8 inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-base font-semibold px-8 py-3.5 rounded-full transition-all shadow-xl shadow-violet-600/30 hover:-translate-y-0.5"
          >
            Começar agora
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Footer links */}
      <div className="bg-gray-950 text-gray-400">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-14">
          <div className="grid lg:grid-cols-4 gap-10">
            {/* Brand */}
            <div className="lg:col-span-1">
              <a href="#" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>
                <span className="text-xl font-bold text-white">Ayzen</span>
              </a>
              <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                O hub de IA profissional que centraliza os modelos mais potentes
                do mundo em uma única assinatura.
              </p>
            </div>

            {/* Link columns */}
            {footerCols.map((col) => (
              <div key={col.title}>
                <h4 className="text-sm font-semibold text-white mb-4">
                  {col.title}
                </h4>
                <ul className="space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l}>
                      <a
                        href="#"
                        className="text-sm text-gray-500 hover:text-violet-400 transition-colors"
                      >
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Legal bar */}
          <div className="mt-14 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500">
              © 2026 Korda Lab CORP. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                Termos
              </a>
              <a href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                Privacidade
              </a>
              <a href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}