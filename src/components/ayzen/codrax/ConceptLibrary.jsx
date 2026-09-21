import React, { useState, useMemo } from "react";
import { Search, X, BookOpen, ArrowRight } from "lucide-react";
import { CONCEPT_CATEGORIES, CONCEPTS, searchConcepts, getConceptById } from "@/lib/codraxConcepts";

const CATEGORY_COLORS = {
  frontend: "bg-blue-50 text-blue-600",
  backend: "bg-green-50 text-green-600",
  ai: "bg-violet-50 text-violet-600",
  data: "bg-amber-50 text-amber-600",
  devops: "bg-orange-50 text-orange-600",
  concepts: "bg-gray-100 text-gray-600",
};

export default function ConceptLibrary() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [selected, setSelected] = useState(null);

  const results = useMemo(() => searchConcepts(query, category), [query, category]);

  const openConcept = (concept) => setSelected(concept);

  return (
    <div>
      {/* Search + filters */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="relative max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar conceito (ex: React, RAG, tokens...)"
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-white border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-violet-400 transition-colors"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {CONCEPT_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
                category === cat.id
                  ? "bg-[#1D1D1F] text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs text-gray-500 mb-4">
        {results.length} {results.length === 1 ? "conceito" : "conceitos"}
      </p>

      {/* Grid */}
      {results.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <BookOpen className="w-10 h-10 text-gray-300 mb-3" />
          <p className="text-sm text-gray-400">Nenhum conceito encontrado para "{query}"</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {results.map((concept) => (
            <button
              key={concept.id}
              onClick={() => openConcept(concept)}
              className="text-left bg-white border border-gray-200 rounded-2xl p-5 hover:border-violet-300 hover:shadow-sm transition-all group"
            >
              <div className="flex items-start justify-between mb-2">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[concept.category] || CATEGORY_COLORS.concepts}`}>
                  {CONCEPT_CATEGORIES.find((c) => c.id === concept.category)?.label}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-violet-500 transition-colors" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-1">{concept.name}</h3>
              <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{concept.summary}</p>
            </button>
          ))}
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[selected.category] || CATEGORY_COLORS.concepts}`}>
                  {CONCEPT_CATEGORIES.find((c) => c.id === selected.category)?.label}
                </span>
                <h2 className="text-lg font-bold text-gray-900">{selected.name}</h2>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-6 py-5">
              <p className="text-sm text-gray-600 font-medium mb-4">{selected.summary}</p>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{selected.content}</p>
              {selected.related && selected.related.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-400 mb-2">CONCEITOS RELACIONADOS</p>
                  <div className="flex flex-wrap gap-2">
                    {selected.related.map((relId) => {
                      const rel = getConceptById(relId);
                      if (!rel) return null;
                      return (
                        <button
                          key={relId}
                          onClick={() => openConcept(rel)}
                          className="px-3 py-1.5 rounded-full bg-gray-100 text-xs font-medium text-gray-700 hover:bg-violet-100 hover:text-violet-700 transition-colors"
                        >
                          {rel.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}