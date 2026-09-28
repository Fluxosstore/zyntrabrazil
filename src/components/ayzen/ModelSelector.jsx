import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Search, Check, SignalHigh, SignalMedium, SignalLow, Scale } from "lucide-react";
import { CoinStackIcon } from "@/components/ayzen/SettingsIcons";
import { QUOTAS_BY_PLAN, getUsageCounts } from "@/lib/quotaUtils";

export const LOGO =
"https://media.base44.com/images/public/6aab2e6298f803d865228a5d/ddb60374d_ChatGPTImage16desetde202623_41_31.png";

const GEMINI =
"https://upload.wikimedia.org/wikipedia/commons/1/1d/Google_Gemini_icon_2025.svg";
const DEEPSEEK =
"https://upload.wikimedia.org/wikipedia/commons/b/ba/Deepseek-logo-icon.svg";
const GPT =
"https://upload.wikimedia.org/wikipedia/commons/e/ef/ChatGPT-Logo.svg";
const CLAUDE =
"https://upload.wikimedia.org/wikipedia/commons/b/b0/Claude_AI_symbol.svg";
const GROK =
"https://media.base44.com/images/public/6aab2e6298f803d865228a5d/ad894e6fd_grok.svg";

export const PLAN_LABELS = {
  free: "Free",
  starter: "Starter",
  premium: "Pro",
  team: "Empresarial Team",
  startup: "Empresarial Startup",
  enterprise: "Empresarial Enterprise"
};

export const MODELS_BY_PLAN = {
  free: [
  { id: "gemini", name: "Gemini 2.5 Pro", logo: GEMINI, ms: "150 ms", level: "high" },
  { id: "gpt", name: "GPT-4", logo: GPT, ms: "220 ms", level: "medium" }],

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

// Modelos capazes de gerar imagem
export const IMAGE_MODELS = [
  { id: "gpt-image", name: "GPT-5", logo: GPT, ms: "~1.5 s", level: "medium", type: "image" },
  { id: "gemini-image", name: "Gemini 3.5 Flash", logo: GEMINI, ms: "~1.3 s", level: "high", type: "image" },
  { id: "claude-image", name: "Claude Sonnet 4.6", logo: CLAUDE, ms: "~900 ms", level: "medium", type: "image" }
];

// Modelos de imagem disponíveis por plano
export const IMAGE_MODELS_BY_PLAN = {
  free: [IMAGE_MODELS[0], IMAGE_MODELS[1]],
  starter: IMAGE_MODELS,
  premium: IMAGE_MODELS,
  team: IMAGE_MODELS,
  startup: IMAGE_MODELS,
  enterprise: IMAGE_MODELS
};

// Modelos de áudio (TTS) disponíveis no OpenRouter
const FISH_AUDIO = "https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://fish.audio/&size=256";
const MINIMAX = "https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://minimaxi.com/&size=256";
const QWEN_LOGO = "https://openrouter.ai/images/icons/Qwen.png";
const DEEPGRAM = "https://openrouter.ai/images/icons/Deepgram.svg";
const MICROSOFT = "https://openrouter.ai/images/icons/MAI.png";

export const AUDIO_MODELS = [
  { id: "fish-tts", name: "Fish Audio S2.1 Pro", logo: FISH_AUDIO, ms: "~1.3 s", level: "medium", type: "audio" },
  { id: "minimax-tts", name: "MiniMax Speech 2.8 HD", logo: MINIMAX, ms: "~1.8 s", level: "medium", type: "audio" },
  { id: "qwen-tts", name: "Qwen Audio 3.0 TTS Plus", logo: QWEN_LOGO, ms: "~1.4 s", level: "medium", type: "audio" },
  { id: "qwen-flash-tts", name: "Qwen Audio 3.0 TTS Flash", logo: QWEN_LOGO, ms: "~1.0 s", level: "high", type: "audio" },
  { id: "deepgram-aura-tts", name: "Deepgram Aura-2", logo: DEEPGRAM, ms: "~900 ms", level: "high", type: "audio" },
  { id: "deepgram-flux-tts", name: "Deepgram Flux TTS", logo: DEEPGRAM, ms: "~800 ms", level: "high", type: "audio" },
  { id: "microsoft-tts", name: "Microsoft MAI Voice 2", logo: MICROSOFT, ms: "~1.2 s", level: "medium", type: "audio" },
  { id: "fish-s2-pro-tts", name: "Fish Audio S2 Pro", logo: FISH_AUDIO, ms: "~1.5 s", level: "medium", type: "audio" }
];

// Modelos de áudio disponíveis por plano (progressivo: 1, 2, 4, 6, 8)
export const AUDIO_MODELS_BY_PLAN = {
  free: AUDIO_MODELS.slice(0, 3),
  starter: AUDIO_MODELS.slice(0, 1),
  premium: AUDIO_MODELS.slice(0, 2),
  team: AUDIO_MODELS.slice(0, 4),
  startup: AUDIO_MODELS.slice(0, 6),
  enterprise: AUDIO_MODELS
};

export function getModelInfo(id, plan = "free") {
  if (id === "auto") return { id: "auto", name: "Zyntra Auto", logo: LOGO };
  const models = MODELS_BY_PLAN[plan] || MODELS_BY_PLAN.free;
  const audioModels = AUDIO_MODELS_BY_PLAN[plan] || [];
  const imageModels = IMAGE_MODELS_BY_PLAN[plan] || IMAGE_MODELS;
  const found = models.find((m) => m.id === id) || imageModels.find((m) => m.id === id) || audioModels.find((m) => m.id === id) || AUDIO_MODELS.find((m) => m.id === id);
  return found || { id: "auto", name: "Zyntra Auto", logo: LOGO };
}

function SignalIndicator({ level }) {
  if (level === "high") return <SignalHigh className="w-3.5 h-3.5 text-[#2E7D32]" />;
  if (level === "medium") return <SignalMedium className="w-3.5 h-3.5 text-[#2E7D32]" />;
  return <SignalLow className="w-3.5 h-3.5 text-[#2E7D32]" />;
}

export default function ModelSelector({ selected, onSelect, onClose, plan = "free", placement = "top" }) {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("texto");
  const [filter, setFilter] = useState("todas");
  const [usageCounts, setUsageCounts] = useState({});
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

  useEffect(() => {
    (async () => {
      const counts = await getUsageCounts();
      setUsageCounts(counts);
    })();
  }, []);

  function isExhausted(model, category) {
    const quotas = QUOTAS_BY_PLAN[plan] || QUOTAS_BY_PLAN.free;
    const categoryQuota = quotas[category];
    if (!categoryQuota || categoryQuota === "unlimited") return false;
    if (categoryQuota.month === 0) return false;
    const usage = usageCounts[model.name] || { month: 0 };
    return usage.month >= categoryQuota.month;
  }

  const models = MODELS_BY_PLAN[plan] || MODELS_BY_PLAN.free;
  const planImages = IMAGE_MODELS_BY_PLAN[plan] || IMAGE_MODELS;
  const audioModels = AUDIO_MODELS_BY_PLAN[plan] || [];

  // Models available on the free plan = "fair use" (uso justo)
  const freeTextIds = new Set(MODELS_BY_PLAN.free.map((m) => m.id));
  const freeImageIds = new Set((IMAGE_MODELS_BY_PLAN.free || []).map((m) => m.id));
  const freeAudioIds = new Set((AUDIO_MODELS_BY_PLAN.free || []).map((m) => m.id));

  function isFairUse(model, tab) {
    if (tab === "texto") return freeTextIds.has(model.id);
    if (tab === "imagem") return freeImageIds.has(model.id);
    if (tab === "audio") return freeAudioIds.has(model.id);
    return false;
  }

  // Models for the active tab
  function getTabModels() {
    if (activeTab === "texto") return models;
    if (activeTab === "imagem") return planImages;
    if (activeTab === "audio") return audioModels;
    return [];
  }

  const categoryKey = activeTab === "texto" ? "text" : activeTab === "imagem" ? "image" : "audio";

  const tabModels = getTabModels();
  const filtered = tabModels.filter((m) => {
    if (!m.name.toLowerCase().includes(query.toLowerCase())) return false;
    if (filter === "uso_justo") return isFairUse(m, activeTab);
    if (filter === "usa_credito") return !isFairUse(m, activeTab);
    return true;
  });

  const tabs = [
    { id: "texto", label: "Texto" },
    { id: "imagem", label: "Imagem" },
    { id: "audio", label: "Áudio" },
  ];

  const filters = [
    { id: "todas", label: "Todas", icon: null },
    { id: "uso_justo", label: "Uso justo", icon: Scale },
    { id: "usa_credito", label: "Usa crédito", icon: CoinStackIcon },
  ];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: placement === "bottom" ? 8 : -8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: placement === "bottom" ? 8 : -8, scale: 0.98 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className={`absolute ${placement === "bottom" ? "top-full left-0 mt-2" : "bottom-full left-0 mb-2"} w-72 max-h-[480px] bg-white rounded-2xl shadow-xl shadow-black/15 border border-gray-100 overflow-hidden z-50 flex flex-col`}>

      {/* Search header */}
      <div className="flex items-center gap-2 px-3.5 py-3 border-b border-gray-100 shrink-0">
        <Search className="w-3.5 h-3.5 text-[#9E9E9E] shrink-0" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar modelo"
          className="flex-1 text-xs text-[#212121] placeholder:text-[#9E9E9E] focus:outline-none bg-transparent" />
      </div>

      {/* Tab row: Texto / Imagem / Áudio */}
      <div className="flex items-center gap-1 px-3 pt-3 pb-1.5 shrink-0">
        <div className="flex items-center gap-0.5 bg-gray-100 rounded-full p-0.5 w-full">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-white text-black shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter row: Todas / Uso justo / Usa crédito */}
      <div className="flex items-center gap-1.5 px-3 pb-2.5 shrink-0">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-medium transition-colors ${
              filter === f.id
                ? "bg-gray-100 text-black"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {f.icon && <f.icon className="w-3 h-3" />}
            {f.label}
          </button>
        ))}
      </div>

      {/* Scrollable list */}
      <div className="flex-1 overflow-y-auto model-selector-scroll">
        {/* Ayzen Auto — only on Texto tab */}
        {activeTab === "texto" && (
          <div className="px-1.5 pt-1.5 pb-1">
            <button
              onClick={() => onSelect?.("auto")}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-colors text-left ${
                selected === "auto" ? "bg-[#E0D6FF]" : "hover:bg-gray-100"
              }`}
            >
              <div className="w-6 h-6 flex items-center justify-center shrink-0">
                <img src={LOGO} alt="Zyntra Auto" className="w-5 h-5 rounded-md object-cover" />
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
        )}

        {/* Model list */}
        <div className="px-1.5 pb-2 space-y-0.5">
          {filtered.map((m) => {
            const exhausted = isExhausted(m, categoryKey);
            const fairUse = isFairUse(m, activeTab);
            return (
              <button
                key={m.id}
                onClick={() => !exhausted && onSelect?.(m.id)}
                disabled={exhausted}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-colors text-left ${
                  exhausted ? "opacity-40 cursor-not-allowed" : selected === m.id ? "bg-[#E0D6FF]" : "hover:bg-gray-100"
                }`}
              >
                <div className="w-6 h-6 flex items-center justify-center shrink-0">
                  <img src={m.logo} alt={m.name} className="w-5 h-5 object-contain" />
                </div>
                <span className="flex-1 text-xs font-medium text-[#212121]">{m.name}</span>
                {exhausted ? (
                  <span className="text-[10px] font-semibold text-red-500">Esgotado</span>
                ) : (
                  <span className="flex items-center gap-1.5 text-[10px] text-[#2E7D32] font-medium">
                    {fairUse ? (
                      <Scale className="w-3 h-3" />
                    ) : (
                      <CoinStackIcon className="w-3 h-3 text-orange-500" />
                    )}
                    {m.ms}
                    <SignalIndicator level={m.level} />
                  </span>
                )}
                {selected === m.id && !exhausted && <Check className="w-3.5 h-3.5 text-black shrink-0" />}
              </button>
            );
          })}
          {filtered.length === 0 && (
            <p className="px-2.5 py-3 text-xs text-[#9E9E9E]">Nenhum modelo encontrado.</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}