import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import Flag from "@/components/ayzen/Flag";
import { useLanguage } from "@/lib/LanguageContext";

const LANGS = [
  { code: "PT", label: "Português" },
  { code: "EN", label: "English" },
  { code: "ES", label: "Español" },
];

export default function LanguageSwitcher({ variant = "text" }) {
  const { lang, setLang } = useLanguage();
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef(null);
  const current = LANGS.find((l) => l.code === lang) || LANGS[0];

  useEffect(() => {
    const onClick = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const isPill = variant === "pill";

  return (
    <div className="relative" ref={langRef}>
      {isPill ? (
        <button
          onClick={() => setLangOpen((o) => !o)}
          className="flex items-center gap-1.5 bg-[#F2F2F2] rounded-full pl-2 pr-2.5 py-1.5 text-sm font-medium text-black"
        >
          <Flag code={current.code} />
          <span className="text-xs font-medium text-black">{current.code}</span>
          <ChevronDown className="w-3 h-3 text-black" />
        </button>
      ) : (
        <button
          onClick={() => setLangOpen((o) => !o)}
          className="inline-flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900 px-2.5 py-1.5 rounded-full hover:bg-gray-100 transition-colors"
        >
          {current.code}
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      )}

      {langOpen && (
        <div className={`absolute ${isPill ? "right-0" : "right-0"} top-full mt-2 w-44 bg-white border border-[#E5E5E5] rounded-xl shadow-lg p-1 z-50`}>
          {LANGS.map((l) => {
            const active = l.code === lang;
            return (
              <button
                key={l.code}
                onClick={() => {
                  setLang(l.code);
                  setLangOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-left text-sm font-medium rounded-lg transition-colors ${
                  active ? "bg-[#EBEDF4] text-black" : "text-[#333] hover:bg-[#EBEDF4]"
                }`}
              >
                <Flag code={l.code} />
                <span className="flex-1">{l.label}</span>
                {active && <Check className="w-4 h-4 text-[#7E57C2]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}