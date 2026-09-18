import React from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { QUALITY_MODELS } from "./qualityData";

function ModelLogo({ logo, size = 22 }) {
  if (logo?.type === "circle") {
    return (
      <div
        style={{ width: size, height: size, backgroundColor: logo.color }}
        className="rounded-md flex items-center justify-center text-white text-[9px] font-bold shrink-0"
      >
        {logo.letter}
      </div>
    );
  }
  return <img src={logo} alt="" className="w-5 h-5 rounded-md object-contain shrink-0" />;
}

function fmt(v) {
  if (v === null || v === undefined) return "—";
  return v.toFixed(1).replace(".", ",");
}

export default function QualityTable() {
  const { t } = useLanguage();

  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
      {/* Table header */}
      <div className="flex items-center px-5 py-3 border-b border-gray-100 bg-gray-50/50">
        <span className="w-10 text-[10px] font-semibold tracking-wider text-gray-400">#</span>
        <span className="flex-1 text-[10px] font-semibold tracking-wider text-gray-400">{t("ranking.model")}</span>
        <span className="w-28 text-right text-[10px] font-semibold tracking-wider text-gray-400">{t("ranking.intelligence")}</span>
        <span className="w-28 text-right text-[10px] font-semibold tracking-wider text-gray-400">{t("ranking.programming")}</span>
        <span className="w-28 text-right text-[10px] font-semibold tracking-wider text-gray-400">{t("ranking.agentic")}</span>
      </div>

      {/* Table rows */}
      <div className="divide-y divide-gray-50">
        {QUALITY_MODELS.map((m) => (
          <div key={m.rank} className="flex items-center px-5 py-2.5 hover:bg-gray-50/50 transition-colors">
            <span className="w-10 text-xs text-gray-400">{m.rank}</span>
            <div className="flex-1 flex items-center gap-2.5 min-w-0">
              <ModelLogo logo={m.logo} />
              <div className="min-w-0">
                <p className="text-xs font-medium text-black truncate">{m.name}</p>
                {m.subtitle && <p className="text-[10px] text-gray-400 truncate">{m.subtitle}</p>}
              </div>
            </div>
            <span className="w-28 text-right text-xs font-medium text-gray-700">{fmt(m.intelligence)}</span>
            <span className="w-28 text-right text-xs font-medium text-gray-700">{fmt(m.programming)}</span>
            <span className="w-28 text-right text-xs font-medium text-gray-700">{fmt(m.agentic)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}