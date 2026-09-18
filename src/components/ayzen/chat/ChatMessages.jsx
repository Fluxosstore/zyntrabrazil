import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Star, Pencil, RefreshCw } from "lucide-react";
import { Image } from "@/components/ui/image";
import { MODELS_BY_PLAN, getModelInfo } from "@/components/ayzen/ModelSelector";

export default function ChatMessages({ messages, loading, onEdit, onReprocess, plan = "free", model = "auto" }) {
  const scrollRef = useRef(null);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [favIdx, setFavIdx] = useState([]);
  const [reprocessOpen, setReprocessOpen] = useState(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleCopy = (text, idx) => {
    navigator.clipboard?.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  const toggleFav = (idx) => {
    setFavIdx((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const models = MODELS_BY_PLAN[plan] || MODELS_BY_PLAN.free;
  const loadingModel = getModelInfo(model, plan);

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto py-4 space-y-6 px-4 md:px-0">
      <AnimatePresence>
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "user" ? (
              <div className="max-w-[80%] flex flex-col items-end">
                <div className="rounded-2xl px-4 py-2.5 bg-[#1D1D1F] text-white">
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <button
                    onClick={() => handleCopy(msg.content, i)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                    title="Copiar"
                  >
                    {copiedIdx === i ? (
                      <Check className="w-3.5 h-3.5 text-green-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    onClick={() => onEdit?.(msg.content, i)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                    title="Editar pergunta"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <div className="relative">
                    <button
                      onClick={() => setReprocessOpen(reprocessOpen === i ? null : i)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                      title="Processar com outra IA"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                    <AnimatePresence>
                      {reprocessOpen === i && (
                        <motion.div
                          initial={{ opacity: 0, y: -4, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -4, scale: 0.98 }}
                          transition={{ duration: 0.15 }}
                          className="absolute bottom-full right-0 mb-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50"
                        >
                          <div className="px-3 py-2 border-b border-gray-100">
                            <span className="text-[10px] font-bold tracking-wider text-gray-500">PROCESSAR COM</span>
                          </div>
                          <div className="p-1 max-h-48 overflow-y-auto">
                            {models.map((m) => (
                              <button
                                key={m.id}
                                onClick={() => {
                                  onReprocess?.(msg.content, m.id, i);
                                  setReprocessOpen(null);
                                }}
                                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors text-left"
                              >
                                <img src={m.logo} alt={m.name} className="w-4 h-4 rounded object-contain" />
                                <span className="text-xs font-medium text-gray-700">{m.name}</span>
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            ) : (
              <div className="max-w-[80%]">
                {/* Header com logo + nome do modelo */}
                <div className="flex items-center gap-2 mb-1.5">
                  <img
                    src={msg.model?.logo}
                    alt={msg.model?.name || "Zyntra"}
                    className="w-5 h-5 rounded object-contain"
                  />
                  <span className="text-sm font-bold text-black">
                    {msg.model?.name || "Zyntra"}
                  </span>
                </div>

                {/* Conteúdo */}
                {msg.image ? (
                  <div className="space-y-2">
                    {msg.content && (
                      <p className="text-sm text-black whitespace-pre-wrap">{msg.content}</p>
                    )}
                    <Image
                      src={msg.image}
                      alt="Imagem gerada"
                      className="rounded-lg w-full"
                      fittingType="fit"
                    />
                  </div>
                ) : (
                  <p className="text-sm text-black whitespace-pre-wrap">{msg.content}</p>
                )}

                {/* Ações: copiar + favoritar */}
                <div className="flex items-center gap-1 mt-2">
                  <button
                    onClick={() => handleCopy(msg.content, i)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                    title="Copiar"
                  >
                    {copiedIdx === i ? (
                      <Check className="w-3.5 h-3.5 text-green-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    onClick={() => toggleFav(i)}
                    className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors ${
                      favIdx.includes(i)
                        ? "text-yellow-500 hover:bg-yellow-50"
                        : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    }`}
                    title="Favoritar"
                  >
                    <Star
                      className="w-3.5 h-3.5"
                      fill={favIdx.includes(i) ? "currentColor" : "none"}
                    />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
      {loading && (
        <div className="flex justify-start">
          <div className="flex items-center gap-2 mb-1.5">
            <img
              src={loadingModel.logo}
              alt={loadingModel.name}
              className="w-5 h-5 rounded object-contain"
            />
            <span className="text-sm font-bold text-black">{loadingModel.name}</span>
          </div>
          <div className="bg-gray-100 rounded-2xl px-4 py-3 ml-7">
            <div className="flex gap-1">
              <span
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <span
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <span
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}