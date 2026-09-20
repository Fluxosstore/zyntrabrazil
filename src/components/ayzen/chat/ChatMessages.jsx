import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Star, Pencil, RefreshCw, Download, Link2, Volume2 } from "lucide-react";
import { MODELS_BY_PLAN, getModelInfo } from "@/components/ayzen/ModelSelector";
import ImaginingCard from "@/components/ayzen/chat/ImaginingCard";
import { base44 } from "@/api/base44Client";

export default function ChatMessages({ messages, loading, onEdit, onReprocess, plan = "free", model = "auto", imagining = false }) {
  const scrollRef = useRef(null);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [favMap, setFavMap] = useState({});
  const [reprocessOpen, setReprocessOpen] = useState(null);
  const [linkCopied, setLinkCopied] = useState(false);

  const handleDownload = async (url, filename = "imagem-zyntra.png") => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(url, "_blank");
    }
  };

  const handleCopyLink = (url) => {
    navigator.clipboard?.writeText(url);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 1500);
  };

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

  const toggleFav = async (idx, msg) => {
    if (favMap[idx]) {
      try {
        await base44.entities.LibraryItem.delete(favMap[idx]);
      } catch (e) {}
      setFavMap((prev) => {
        const next = { ...prev };
        delete next[idx];
        return next;
      });
    } else {
      try {
        const content = msg.content || "";
        const item = await base44.entities.LibraryItem.create({
          title: content.length > 40 ? content.slice(0, 40) + "..." : content,
          type: "response",
          url: msg.image || "",
          model: msg.model?.name || "",
          prompt: content,
        });
        setFavMap((prev) => ({ ...prev, [idx]: item.id }));
      } catch (e) {
        console.error("Erro ao salvar resposta:", e);
      }
    }
  };

  const models = MODELS_BY_PLAN[plan] || MODELS_BY_PLAN.free;
  const loadingModel = getModelInfo(model, plan);

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto py-4">
      <div className="w-full max-w-5xl mx-auto space-y-6">
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
              <div className="max-w-[80%] ml-2">
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
                    <img
                      src={msg.image}
                      alt="Imagem gerada"
                      className="rounded-2xl w-full object-contain"
                    />
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDownload(msg.image)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                        title="Baixar"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleCopyLink(msg.image)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                        title="Copiar link"
                      >
                        {linkCopied ? (
                          <Check className="w-3.5 h-3.5 text-green-600" />
                        ) : (
                          <Link2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                ) : msg.audio ? (
                  <div className="space-y-2">
                    {msg.content && (
                      <p className="text-sm text-black whitespace-pre-wrap">{msg.content}</p>
                    )}
                    <div className="flex items-center gap-3 bg-gray-50 rounded-2xl px-4 py-3">
                      <Volume2 className="w-5 h-5 text-[#7E57C2] shrink-0" />
                      <audio controls className="flex-1 h-9" src={msg.audio} />
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDownload(msg.audio, "audio-zyntra.mp3")}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                        title="Baixar áudio"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleCopyLink(msg.audio)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                        title="Copiar link"
                      >
                        {linkCopied ? (
                          <Check className="w-3.5 h-3.5 text-green-600" />
                        ) : (
                          <Link2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
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
                    onClick={() => toggleFav(i, msg)}
                    className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors ${
                      favMap[i]
                        ? "text-yellow-500 hover:bg-yellow-50"
                        : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    }`}
                    title="Favoritar"
                  >
                    <Star
                      className="w-3.5 h-3.5"
                      fill={favMap[i] ? "currentColor" : "none"}
                    />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
      {loading && (
        imagining ? (
          <div className="flex justify-start">
            <ImaginingCard modelName={loadingModel.name} modelLogo={loadingModel.logo} />
          </div>
        ) : (
          <div className="flex justify-start">
            <div className="max-w-[80%]">
              <div className="flex items-center gap-2 mb-1.5">
                <img
                  src={loadingModel.logo}
                  alt={loadingModel.name}
                  className="w-5 h-5 rounded object-contain"
                />
                <span className="text-sm font-bold text-black">{loadingModel.name}</span>
              </div>
              <div className="w-fit bg-gray-100 rounded-2xl px-4 py-3">
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
          </div>
        )
      )}
      </div>
    </div>
  );
}