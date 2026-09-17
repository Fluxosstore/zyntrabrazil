import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Search, Check, Sparkles, SignalHigh, SignalMedium, SignalLow } from "lucide-react";

const LOGO =
  "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/ddb60374d_ChatGPTImage16desetde202623_41_31.png";

const MODELS = [
  {
    id: "gemma",
    name: "Gemma 4 31B",
    ms: "166 ms",
    level: "high",
    icon: "sparkle",
  },
  {
    id: "gpt-oss-120",
    name: "GPT-OSS 120B",
    ms: "226 ms",
    level: "medium",
    icon: "openai",
  },
  {
    id: "gpt-oss-20",
    name: "GPT-OSS 20B",
    ms: "323 ms",
    level: "low",
    icon: "openai",
  },
];

function OpenAIIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7473-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.019 1.1641a.1839.1839 0 0 1 .1004.1504v5.581a4.504 4.504 0 0 1-4.4969 4.5021zm-9.6901-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0856 4.7831 2.7582a.7712.7712 0 0 0 .7803 0l5.8425-3.3685v2.3281a.184.184 0 0 1-.0662.1604l-4.8304 2.7866a4.4977 4.4977 0 0 1-6.1171-1.6467zM3.6804 8.5478a4.4894 4.4894 0 0 1 2.3554-1.9728V12.77a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.019 1.1641a.1839.1839 0 0 1-.1662 0l-4.8303-2.7913a4.504 4.504 0 0 1-1.6467-6.1258zm16.5961 3.8558L13.965 8.5478l2.019-1.1641a.1839.1839 0 0 1 .1662 0l4.8303 2.7866a4.4977 4.4977 0 0 1-.6765 8.1056v-6.1949a.7759.7759 0 0 0-.3927-.6765zm2.009-3.0137-.1419.0804-4.7783 2.7582a.7712.7712 0 0 0-.7803 0l-5.8425 3.3685V7.5478a.1839.1839 0 0 1 .0662-.1604l4.8304-2.7866a4.4977 4.4977 0 0 1 6.7082 4.6907zM8.3854 13.9048l-2.019-1.1641a.1839.1839 0 0 1-.1004-.1504V7.0137a4.4977 4.4977 0 0 1 7.3849-3.4416l-.142.0804L8.7306 6.4107a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654L12.0001 10.04l2.5171 1.4994v2.9988l-2.5171 1.4994-2.5171-1.4994z"/>
    </svg>
  );
}

function SignalIndicator({ level }) {
  if (level === "high") return <SignalHigh className="w-3.5 h-3.5 text-[#2E7D32]" />;
  if (level === "medium") return <SignalMedium className="w-3.5 h-3.5 text-[#2E7D32]" />;
  return <SignalLow className="w-3.5 h-3.5 text-[#2E7D32]" />;
}

export default function ModelSelector({ selected, onSelect, onClose }) {
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

  const filtered = MODELS.filter((m) =>
    m.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: -8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="absolute bottom-full left-0 mb-2 w-72 bg-white rounded-2xl shadow-xl shadow-black/15 border border-gray-100 overflow-hidden z-50"
    >
      {/* Search header */}
      <div className="flex items-center gap-2 px-3.5 py-3 border-b border-gray-100">
        <Search className="w-3.5 h-3.5 text-[#9E9E9E] shrink-0" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar modelo"
          className="flex-1 text-xs text-[#212121] placeholder:text-[#9E9E9E] focus:outline-none bg-transparent"
        />
      </div>

      {/* Active selection - Ayzen Auto */}
      <button
        onClick={() => onSelect?.("auto")}
        className="w-full flex items-center gap-2.5 px-3.5 py-2.5 bg-[#F0F2F5] hover:bg-[#E8EBEF] transition-colors text-left"
      >
        <img src={LOGO} alt="Ayzen Auto" className="w-6 h-6 rounded-md object-cover shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-[#212121]">Ayzen Auto</p>
          <p className="text-[10px] text-[#757575] truncate">
            Escolhe automaticamente entre texto e imagem
          </p>
        </div>
        {selected === "auto" && <Check className="w-3.5 h-3.5 text-black shrink-0" />}
      </button>

      <div className="h-px bg-gray-100" />

      {/* Category label */}
      <div className="px-3.5 pt-2.5 pb-1">
        <span className="text-[10px] font-bold tracking-wider text-[#757575]">TEXTO</span>
      </div>

      {/* Model list */}
      <div className="px-1.5 pb-2">
        {filtered.map((m) => (
          <button
            key={m.id}
            onClick={() => onSelect?.(m.id)}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            {m.icon === "sparkle" ? (
              <div className="w-6 h-6 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-blue-500" />
              </div>
            ) : (
              <div className="w-6 h-6 flex items-center justify-center shrink-0">
                <OpenAIIcon className="w-4 h-4 text-black" />
              </div>
            )}
            <span className="flex-1 text-xs font-medium text-[#212121]">{m.name}</span>
            <span className="flex items-center gap-1 text-[10px] text-[#2E7D32] font-medium">
              {m.ms}
              <SignalIndicator level={m.level} />
            </span>
            {selected === m.id && <Check className="w-3.5 h-3.5 text-black shrink-0" />}
          </button>
        ))}
        {filtered.length === 0 && (
          <p className="px-2.5 py-3 text-xs text-[#9E9E9E]">Nenhum modelo encontrado.</p>
        )}
      </div>
    </motion.div>
  );
}