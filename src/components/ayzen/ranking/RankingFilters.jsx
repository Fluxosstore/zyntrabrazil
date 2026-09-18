import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Eye, Sparkles, AudioWaveform, Wrench, Check, Type } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

const MODALITY_OPTIONS = [
  { id: "text", icon: Type, labelKey: "ranking.text" },
  { id: "vision", icon: Eye, labelKey: "ranking.vision" },
  { id: "image", icon: Sparkles, labelKey: "ranking.imageGen" },
  { id: "audio", icon: AudioWaveform, labelKey: "ranking.audio" },
  { id: "tools", icon: Wrench, labelKey: "ranking.tools" },
];

const PERIOD_OPTIONS = [
  { id: "7d", labelKey: "ranking.7days" },
  { id: "30d", labelKey: "ranking.30days" },
  { id: "90d", labelKey: "ranking.90days" },
  { id: "12m", labelKey: "ranking.12months" },
];

export default function RankingFilters() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(null);
  const [modality, setModality] = useState("text");
  const [period, setPeriod] = useState("30d");
  const ref = useRef(null);

  useEffect(() => {
    function handleOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(null);
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const selModality = MODALITY_OPTIONS.find((m) => m.id === modality);
  const selPeriod = PERIOD_OPTIONS.find((p) => p.id === period);

  return (
    <div ref={ref} className="flex items-center gap-3 relative">
      <span className="text-xs font-medium text-gray-400">{t("ranking.filters")}</span>

      {/* Modalidade */}
      <div className="relative">
        <button
          onClick={() => setOpen(open === "modality" ? null : "modality")}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-200 text-xs text-gray-700 hover:bg-gray-50"
        >
          <span className="text-[10px] font-semibold tracking-wider text-gray-400">{t("ranking.modality")}</span>
          <span>{t(selModality.labelKey)}</span>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
        </button>
        {open === "modality" && (
          <div className="absolute top-full left-0 mt-1.5 w-56 bg-white rounded-2xl shadow-lg shadow-black/10 border border-gray-100 p-2 z-50">
            <div className="flex flex-wrap gap-2">
              {MODALITY_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const isSel = modality === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => { setModality(opt.id); setOpen(null); }}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-medium transition-colors ${
                      isSel
                        ? "bg-gray-100 border-gray-300 text-black"
                        : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                    {t(opt.labelKey)}
                    {isSel && <Check className="w-3.5 h-3.5 text-black shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Período */}
      <div className="relative">
        <button
          onClick={() => setOpen(open === "period" ? null : "period")}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-200 text-xs text-gray-700 hover:bg-gray-50"
        >
          <span className="text-[10px] font-semibold tracking-wider text-gray-400">{t("ranking.period")}</span>
          <span>{t(selPeriod.labelKey)}</span>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
        </button>
        {open === "period" && (
          <div className="absolute top-full left-0 mt-1.5 w-44 bg-white rounded-2xl shadow-lg shadow-black/10 border border-gray-100 p-2 z-50">
            <div className="flex flex-wrap gap-2">
              {PERIOD_OPTIONS.map((opt) => {
                const isSel = period === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => { setPeriod(opt.id); setOpen(null); }}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-medium transition-colors ${
                      isSel
                        ? "bg-gray-100 border-gray-300 text-black"
                        : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {t(opt.labelKey)}
                    {isSel && <Check className="w-3.5 h-3.5 text-black shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}