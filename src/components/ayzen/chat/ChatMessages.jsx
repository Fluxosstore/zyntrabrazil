import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image } from "@/components/ui/image";

export default function ChatMessages({ messages, loading }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
      <AnimatePresence>
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                msg.role === "user" ? "bg-[#1D1D1F] text-white" : "bg-gray-100 text-black"
              }`}
            >
              {msg.image ? (
                <div className="space-y-2">
                  {msg.content && <p className="text-sm whitespace-pre-wrap">{msg.content}</p>}
                  <Image
                    src={msg.image}
                    alt="Imagem gerada"
                    className="rounded-lg w-full"
                    fittingType="fit"
                  />
                </div>
              ) : (
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      {loading && (
        <div className="flex justify-start">
          <div className="bg-gray-100 rounded-2xl px-4 py-3">
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