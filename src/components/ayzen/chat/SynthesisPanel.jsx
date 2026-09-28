import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Power } from "lucide-react";

export default function SynthesisPanel({ onBack, active = true, onToggle }) {
  const [mode, setMode] = useState("auto");
  const [speed, setSpeed] = useState("live");

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.96 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="absolute bottom-full left-0 mb-2 w-72 bg-white rounded-2xl shadow-xl shadow-black/15 border border-gray-100 overflow-hidden z-50"
    >
      <div className="flex items-center gap-2 px-3.5 py-3">
        <button
          onClick={onBack}
          className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-black" />
        </button>
        <span className="text-sm font-bold text-black">Síntese</span>
      </div>
      <p className="px-3.5 pb-3 text-xs text-gray-500">Várias IAs respondem, um juiz decide.</p>

      <div className="px-3.5 pb-3">
        <div className="rounded-xl bg-[#F9F9F9] border border-gray-200 p-3 space-y-3">
          <div>
            <span className="text-xs font-medium text-black">Como escolher as IAs</span>
            <div className="flex items-center gap-1 mt-1.5 bg-[#EBEBEB] rounded-full p-1">
              <button
                onClick={() => setMode("auto")}
                className={`flex-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  mode === "auto" ? "bg-white text-black shadow-sm" : "text-gray-500"
                }`}
              >
                Automática
              </button>
              <button
                onClick={() => setMode("custom")}
                className={`flex-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  mode === "custom" ? "bg-white text-black shadow-sm" : "text-gray-500"
                }`}
              >
                Personalizada
              </button>
            </div>
          </div>
          <div>
            <span className="text-xs font-medium text-black">Velocidade da pesquisa</span>
            <div className="flex items-center gap-1 mt-1.5 bg-[#EBEBEB] rounded-full p-1">
              <button
                onClick={() => setSpeed("live")}
                className={`flex-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  speed === "live" ? "bg-white text-black shadow-sm" : "text-gray-500"
                }`}
              >
                Ao vivo
              </button>
              <button
                onClick={() => setSpeed("deep")}
                className={`flex-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  speed === "deep" ? "bg-white text-black shadow-sm" : "text-gray-500"
                }`}
              >
                Pesquisa profunda
              </button>
            </div>
          </div>
          <p className="text-[11px] text-gray-400">Resposta em segundos, direto do conhecimento de cada modelo.</p>
        </div>

        <div className="pt-3">
          <span className="text-sm font-bold text-black">8 modelos + juiz</span>
          <p className="text-[11px] text-gray-400 mt-0.5">Gasta cerca de 9x mais créditos e demora um pouco mais.</p>
        </div>
      </div>

      <div className="px-3.5 pb-3">
        <button
          onClick={() => { onToggle?.(); onBack?.(); }}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-black hover:bg-gray-50 transition-colors"
        >
          <Power className="w-4 h-4" />
          Desativar síntese
        </button>
      </div>
    </motion.div>
  );
}