import React from "react";
import { ArrowRight } from "lucide-react";

const posts = [
  {
    tag: "Economia",
    title: "Por que pagar 5 assinaturas de IA se uma só resolve?",
    excerpt:
      "Entenda como centralizar modelos de ponta em um único plano reduz custo, contexto e fricção.",
    read: "5 min de leitura",
  },
  {
    tag: "Comparativo",
    title: "ChatGPT vs Claude vs Gemini: qual IA usar para cada tarefa?",
    excerpt:
      "Testamos os três modelos em escrita, código e análise. Veja qual brilha em cada cenário.",
    read: "8 min de leitura",
  },
];

export default function BlogSection() {
  return (
    <section id="blog" className="py-20 lg:py-28 bg-white">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold tracking-widest text-violet-600 uppercase">
              Blog
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 leading-[1.1]">
              Entenda melhor a IA. Use melhor no trabalho.
            </h2>
          </div>
          <a
            href="#"
            className="inline-flex items-center gap-2 text-sm font-semibold text-violet-600 hover:text-violet-700 group"
          >
            Acessar o blog
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {posts.map((p) => (
            <a
              key={p.title}
              href="#"
              className="group relative bg-[#FAFAFA] border border-gray-100 rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300"
            >
              <div className="aspect-[16/9] bg-gradient-to-br from-violet-100 via-indigo-50 to-gray-100 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-500/30 to-indigo-500/20 blur-2xl" />
                </div>
                <span className="absolute top-4 left-4 text-xs font-semibold text-violet-700 bg-white/80 backdrop-blur px-3 py-1 rounded-full">
                  {p.tag}
                </span>
              </div>
              <div className="p-7">
                <h3 className="text-xl font-bold text-gray-900 leading-snug group-hover:text-violet-600 transition-colors">
                  {p.title}
                </h3>
                <p className="mt-3 text-sm text-gray-500 leading-relaxed">
                  {p.excerpt}
                </p>
                <div className="mt-5 flex items-center justify-between">
                  <span className="text-xs text-gray-400">{p.read}</span>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-violet-600 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}