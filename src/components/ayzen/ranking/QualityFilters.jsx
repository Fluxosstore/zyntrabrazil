import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { METRIC_OPTIONS, SOURCE_OPTIONS } from "./qualityData";

export default function QualityFilters({ metric, setMetric }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    function handleOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(null);
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const selMetric = METRIC_OPTIONS.find((m) => m.id === metric);
  const selSource = SOURCE_OPTIONS[0];

  return (
    <div ref={ref} className="flex items-center gap-3 relative">
      <span className="text-xs font-medium text-gray-400">{t("ranking.filters")}</span>

      {/* Fonte */}
      <div className="relative">
        <button
          onClick={() => setOpen(open === "source" ? null : "source")}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-200 text-xs text-gray-700 hover:bg-gray-50"
        >
          <span className="text-[10px] font-semibold tracking-wider text-gray-400">{t("ranking.source")}</span>
          <span>{selSource.label}</span>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
        </button>
        {open === "source" && (
          <div className="absolute top-full left-0 mt-1.5 w-48 bg-white rounded-2xl shadow-lg shadow-black/10 border border-gray-100 p-1.5 z-50">
            {SOURCE_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setOpen(null)}
                className="w-full flex items-center px-2.5 py-2 rounded-lg text-left text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <span className="flex-1 text-xs font-medium">{opt.label}</span>
                <Check className="w-4 h-4 text-black shrink-0" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Métrica */}
      <div className="relative">
        <button
          onClick={() => setOpen(open === "metric" ? null : "metric")}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-200 text-xs text-gray-700 hover:bg-gray-50"
        >
          <span className="text-[10px] font-semibold tracking-wider text-gray-400">{t("ranking.metric")}</span>
          <span>{t(selMetric.labelKey)}</span>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
        </button>
        {open === "metric" && (
          <div className="absolute top-full left-0 mt-1.5 w-44 bg-white rounded-2xl shadow-lg shadow-black/10 border border-gray-100 p-1.5 z-50">
            {METRIC_OPTIONS.map((opt) => {
              const isSel = metric === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => { setMetric(opt.id); setOpen(null); }}
                  className={`w-full flex items-center px-2.5 py-2 rounded-lg text-left transition-colors ${
                    isSel ? "bg-[#f0f2f5] text-black" : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="flex-1 text-xs font-medium">{t(opt.labelKey)}</span>
                  {isSel && <Check className="w-4 h-4 text-black shrink-0" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}