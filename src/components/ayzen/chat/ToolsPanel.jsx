import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Sparkles, Info, Save, Brain } from "lucide-react";

export default function ToolsPanel({ onBack }) {
  const [reasoning, setReasoning] = useState(50);
  const [saveMemories, setSaveMemories] = useState(false);
  const [useMemories, setUseMemories] = useState(false);

  const reasoningLabel = reasoning < 34 ? "Baixo" : reasoning < 67 ? "Médio" : "Alto";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.96 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="absolute bottom-full left-0 mb-2 w-72 bg-white rounded-2xl shadow-xl shadow-black/15 border border-gray-100 overflow-hidden z-50"
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-3.5 py-3">
        <button
          onClick={onBack}
          className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-black" />
        </button>
        <span className="text-sm font-bold text-black">Ferramentas</span>
      </div>
      <div className="h-px bg-gray-100" />

      {/* Raciocínio */}
      <div className="px-3.5 pt-3 pb-1">
        <span className="text-[11px] font-medium text-gray-400">Raciocínio</span>
      </div>
      <div className="px-3.5 pb-3">
        <div className="flex items-center gap-2.5 py-1">
          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-black" />
          </div>
          <span className="flex-1 text-sm font-medium text-black">Raciocínio</span>
          <Info className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-xs text-gray-500 w-10 text-right">{reasoningLabel}</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={reasoning}
          onChange={(e) => setReasoning(Number(e.target.value))}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer mt-2
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-white
            [&::-webkit-slider-thumb]:border-2
            [&::-webkit-slider-thumb]:border-[#7C3AED]
            [&::-webkit-slider-thumb]:shadow-sm
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-moz-range-thumb]:w-4
            [&::-moz-range-thumb]:h-4
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-white
            [&::-moz-range-thumb]:border-2
            [&::-moz-range-thumb]:border-[#7C3AED]
            [&::-moz-range-thumb]:border-0"
          style={{
            background: `linear-gradient(to right, #7C3AED ${reasoning}%, #E5E7EB ${reasoning}%)`,
          }}
        />
      </div>

      <div className="h-px bg-gray-100" />

      {/* Memórias */}
      <div className="px-3.5 pt-3 pb-1">
        <span className="text-[11px] font-medium text-gray-400">Memórias</span>
      </div>
      <div className="px-3.5 pb-3 space-y-1">
        <div className="flex items-center gap-2.5 py-1">
          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
            <Save className="w-4 h-4 text-black" />
          </div>
          <span className="flex-1 text-sm font-medium text-black">Salvar novas memórias</span>
          <Info className="w-3.5 h-3.5 text-gray-400" />
          <button
            onClick={() => setSaveMemories((v) => !v)}
            className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${
              saveMemories ? "bg-[#7C3AED]" : "bg-gray-300"
            }`}
          >
            <div
              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                saveMemories ? "translate-x-5" : "translate-x-1"
              }`}
            />
          </button>
        </div>
        <div className="flex items-center gap-2.5 py-1">
          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
            <Brain className="w-4 h-4 text-black" />
          </div>
          <span className="flex-1 text-sm font-medium text-black">Usar memórias</span>
          <Info className="w-3.5 h-3.5 text-gray-400" />
          <button
            onClick={() => setUseMemories((v) => !v)}
            className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${
              useMemories ? "bg-[#7C3AED]" : "bg-gray-300"
            }`}
          >
            <div
              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                useMemories ? "translate-x-5" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>
    </motion.div>
  );
}