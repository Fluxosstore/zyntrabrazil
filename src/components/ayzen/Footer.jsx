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
      <div className="bg-[#fcfcfc]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left - text content */}
            <div className="order-2 lg:order-1">
              <div className="flex items-center gap-2 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8c52ff]" />
                <span className="text-xs font-medium tracking-widest text-[#666666] uppercase">
                  Pronto para pensar com tudo isso?
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1]">
                <span className="text-[#111111]">Centralize. Evolua.</span>
                <br />
                <span className="text-[#8c52ff]">Pense à frente.</span>
              </h2>
              <p className="mt-6 text-base text-[#666666] leading-relaxed max-w-md">
                Comece agora com o que há de melhor em IA e prepare-se para as
                ferramentas de automação e desenvolvimento que vão mudar seu
                jogo.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-5">
                <a
                  href="#planos"
                  className="inline-flex items-center gap-2 bg-[#8c52ff] hover:bg-[#7c3aed] text-white text-sm font-semibold px-6 py-3 rounded-full transition-all shadow-lg shadow-violet-500/25 hover:-translate-y-0.5"
                >
                  Ver planos
                </a>
                <a
                  href="#ias"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#111111] hover:text-[#8c52ff] transition-colors"
                >
                  Conhecer as IAs
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#666666]">
                <span>7 dias grátis</span>
                <span className="text-[#cccccc]">•</span>
                <span>Devolução total</span>
                <span className="text-[#cccccc]">•</span>
                <span>Sem fidelidade</span>
              </div>
            </div>

            {/* Right - visual */}
            <div className="order-1 lg:order-2 relative rounded-3xl overflow-hidden min-h-[320px] lg:min-h-[440px]">
              <Image
                src="https://media.base44.com/images/public/6aab2e6298f803d865228a5d/66af2ae0c_generated_a031b5b3.jpg"
                alt="Astronauta em paisagem lunar olhando para um portal de energia"
                className="w-full h-full object-cover"
                fittingType="fill"
              />
            </div>
          </div>
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
                <span className="text-xl font-bold text-white">Zyntra</span>
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