import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Star } from "lucide-react";
import { Image } from "@/components/ui/image";

export default function ChatMessages({ messages, loading }) {
  const scrollRef = useRef(null);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [favIdx, setFavIdx] = useState([]);

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

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto py-4 space-y-6">
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
              <div className="max-w-[80%] rounded-2xl px-4 py-2.5 bg-[#1D1D1F] text-white">
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
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
              src="https://media.base44.com/images/public/6aab2e6298f803d865228a5d/ddb60374d_ChatGPTImage16desetde202623_41_31.png"
              alt="Zyntra"
              className="w-5 h-5 rounded object-contain"
            />
            <span className="text-sm font-bold text-black">Zyntra</span>
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