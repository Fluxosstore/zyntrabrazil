import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Search, Check, SignalHigh, SignalMedium, SignalLow } from "lucide-react";

const LOGO =
"https://media.base44.com/images/public/6aab2e6298f803d865228a5d/ddb60374d_ChatGPTImage16desetde202623_41_31.png";

const GEMINI =
"https://media.base44.com/images/public/6aab2e6298f803d865228a5d/c545d8735_gemini.svg";
const DEEPSEEK =
"https://media.base44.com/images/public/6aab2e6298f803d865228a5d/d6d9b4c6f_deepseek.svg";
const GPT =
"https://media.base44.com/images/public/6aab2e6298f803d865228a5d/698f8c822_chatgpt.svg";
const CLAUDE =
"https://media.base44.com/images/public/6aab2e6298f803d865228a5d/c0a57947c_claude.svg";
const GROK =
"https://media.base44.com/images/public/6aab2e6298f803d865228a5d/ad894e6fd_grok.svg";

export const PLAN_LABELS = {
  free: "Zyntra Free",
  starter: "Starter",
  premium: "Pessoal Premium",
  team: "Empresarial Team",
  startup: "Empresarial Startup",
  enterprise: "Empresarial Enterprise"
};

export const MODELS_BY_PLAN = {
  free: [
  { id: "deepseek", name: "DeepSeek V3", logo: DEEPSEEK, ms: "180 ms", level: "high" }],

  starter: [
  { id: "gemini", name: "Gemini 2.5 Pro", logo: GEMINI, ms: "150 ms", level: "high" },
  { id: "deepseek", name: "DeepSeek V3", logo: DEEPSEEK, ms: "180 ms", level: "high" },
  { id: "gpt", name: "GPT-5", logo: GPT, ms: "220 ms", level: "medium" }],

  premium: [
  { id: "gemini", name: "Gemini 2.5 Pro", logo: GEMINI, ms: "150 ms", level: "high" },
  { id: "deepseek", name: "DeepSeek V3", logo: DEEPSEEK, ms: "180 ms", level: "high" },
  { id: "claude", name: "Claude Sonnet 4.5", logo: CLAUDE, ms: "210 ms", level: "medium" },
  { id: "grok", name: "Grok 4", logo: GROK, ms: "250 ms", level: "medium" },
  { id: "gpt5", name: "GPT-5", logo: GPT, ms: "220 ms", level: "medium" }],

  team: [
  { id: "gemini", name: "Gemini 2.5 Pro", logo: GEMINI, ms: "150 ms", level: "high" },
  { id: "deepseek", name: "DeepSeek V3", logo: DEEPSEEK, ms: "180 ms", level: "high" },
  { id: "gpt", name: "GPT-5", logo: GPT, ms: "220 ms", level: "medium" },
  { id: "claude", name: "Claude Sonnet 4.5", logo: CLAUDE, ms: "210 ms", level: "medium" },
  { id: "grok", name: "Grok 4", logo: GROK, ms: "250 ms", level: "medium" }],

  startup: [
  { id: "gemini", name: "Gemini 2.5 Pro", logo: GEMINI, ms: "150 ms", level: "high" },
  { id: "deepseek", name: "DeepSeek V3", logo: DEEPSEEK, ms: "180 ms", level: "high" },
  { id: "gpt", name: "GPT-5", logo: GPT, ms: "220 ms", level: "medium" },
  { id: "claude", name: "Claude Sonnet 4.5", logo: CLAUDE, ms: "210 ms", level: "medium" },
  { id: "grok", name: "Grok 4", logo: GROK, ms: "250 ms", level: "medium" }],

  enterprise: [
  { id: "gemini", name: "Gemini 2.5 Pro", logo: GEMINI, ms: "150 ms", level: "high" },
  { id: "deepseek", name: "DeepSeek V3", logo: DEEPSEEK, ms: "180 ms", level: "high" },
  { id: "gpt", name: "GPT-5", logo: GPT, ms: "220 ms", level: "medium" },
  { id: "claude", name: "Claude Opus 4.7", logo: CLAUDE, ms: "280 ms", level: "low" },
  { id: "grok", name: "Grok 4", logo: GROK, ms: "250 ms", level: "medium" }]

};

export function getModelInfo(id, plan = "free") {
  if (id === "auto") return { id: "auto", name: "Zyntra Auto", logo: LOGO };
  const models = MODELS_BY_PLAN[plan] || MODELS_BY_PLAN.free;
  return models.find((m) => m.id === id) || { id: "auto", name: "Zyntra Auto", logo: LOGO };
}

function SignalIndicator({ level }) {
  if (level === "high") return <SignalHigh className="w-3.5 h-3.5 text-[#2E7D32]" />;
  if (level === "medium") return <SignalMedium className="w-3.5 h-3.5 text-[#2E7D32]" />;
  return <SignalLow className="w-3.5 h-3.5 text-[#2E7D32]" />;
}

export default function ModelSelector({ selected, onSelect, onClose, plan = "free", placement = "top" }) {
  const [query, setQuery] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose?.();
    }
    function handleEscape(e) {
      if (e.key === "Escape") onClose?.();
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  const models = MODELS_BY_PLAN[plan] || MODELS_BY_PLAN.free;
  const filtered = models.filter((m) =>
  m.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: placement === "bottom" ? 8 : -8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: placement === "bottom" ? 8 : -8, scale: 0.98 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className={`absolute ${placement === "bottom" ? "top-full left-0 mt-2" : "bottom-full left-0 mb-2"} w-72 bg-white rounded-2xl shadow-xl shadow-black/15 border border-gray-100 overflow-hidden z-50`}>
      
      {/* Search header */}
      <div className="flex items-center gap-2 px-3.5 py-3 border-b border-gray-100">
        <Search className="w-3.5 h-3.5 text-[#9E9E9E] shrink-0" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar modelo"
          className="flex-1 text-xs text-[#212121] placeholder:text-[#9E9E9E] focus:outline-none bg-transparent" />
        
      </div>

      {/* Ayzen Auto */}
      <div className="px-1.5 pt-2 pb-1">
        <button
          onClick={() => onSelect?.("auto")}
          className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-colors text-left ${
          selected === "auto" ? "bg-[#F0F2F5]" : "hover:bg-gray-100"}`
          }>
          
          <div className="w-6 h-6 flex items-center justify-center shrink-0">
            <img src={LOGO} alt="Ayzen Auto" className="w-5 h-5 rounded-md object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-[#212121]">Zyntra Auto</p>
            <p className="text-[10px] text-[#757575] truncate">
              Escolhe automaticamente entre texto e imagem
            </p>
          </div>
          {selected === "auto" && <Check className="w-3.5 h-3.5 text-black shrink-0" />}
        </button>
      </div>

      <div className="h-px bg-gray-100" />

      {/* Category label */}
      <div className="px-3.5 pt-2.5 pb-1">
        <span className="text-[10px] font-bold tracking-wider text-[#757575]">TEXTO</span>
      </div>

      {/* Model list */}
      <div className="px-1.5 pb-2 space-y-0.5">
        {filtered.map((m) =>
        <button
          key={m.id}
          onClick={() => onSelect?.(m.id)}
          className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-colors text-left ${
          selected === m.id ? "bg-[#F0F2F5]" : "hover:bg-gray-100"}`
          }>
          
            <div className="w-6 h-6 flex items-center justify-center shrink-0">
              <img src={m.logo} alt={m.name} className="w-5 h-5 object-contain" />
            </div>
            <span className="flex-1 text-xs font-medium text-[#212121]">{m.name}</span>
            <span className="flex items-center gap-1 text-[10px] text-[#2E7D32] font-medium">
              {m.ms}
              <SignalIndicator level={m.level} />
            </span>
            {selected === m.id && <Check className="w-3.5 h-3.5 text-black shrink-0" />}
          </button>
        )}
        {filtered.length === 0 &&
        <p className="px-2.5 py-3 text-xs text-[#9E9E9E]">Nenhum modelo encontrado.</p>
        }
      </div>
    </motion.div>);

}