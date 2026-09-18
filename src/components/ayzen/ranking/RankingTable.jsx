import React from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { RANKING_MODELS } from "./rankingData";

function ModelLogo({ logo, size = 22 }) {
  if (logo.type === "circle") {
    return (
      <div
        style={{ width: size, height: size, backgroundColor: logo.color }}
        className="rounded-full flex items-center justify-center text-white text-[9px] font-bold shrink-0"
      >
        {logo.letter}
      </div>
    );
  }
  return <img src={logo} alt="" className="w-5 h-5 rounded-full object-contain shrink-0" />;
}

export default function RankingTable() {
  const { t } = useLanguage();
  const maxShare = RANKING_MODELS[0].share;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
      {/* Table header */}
      <div className="flex items-center px-5 py-3 border-b border-gray-100 bg-gray-50/50">
        <span className="w-10 text-[10px] font-semibold tracking-wider text-gray-400">#</span>
        <span className="flex-1 text-[10px] font-semibold tracking-wider text-gray-400">{t("ranking.model")}</span>
        <span className="w-24 text-right text-[10px] font-semibold tracking-wider text-gray-400">{t("ranking.tokens")}</span>
        <span className="w-40 text-right text-[10px] font-semibold tracking-wider text-gray-400">{t("ranking.participation")}</span>
      </div>

      {/* Table rows */}
      <div className="divide-y divide-gray-50">
        {RANKING_MODELS.map((m) => (
          <div key={m.rank} className="flex items-center px-5 py-2.5 hover:bg-gray-50/50 transition-colors">
            <span className="w-10 text-xs text-gray-400">{m.rank}</span>
            <div className="flex-1 flex items-center gap-2.5 min-w-0">
              <ModelLogo logo={m.logo} />
              <div className="min-w-0">
                <p className="text-xs font-medium text-black truncate">{m.name}</p>
                <p className="text-[10px] text-gray-400">{m.vendor}</p>
              </div>
            </div>
            <span className="w-24 text-right text-xs text-gray-600">{m.tokens}</span>
            <div className="w-40 flex items-center gap-2 justify-end">
              <div className="flex-1 max-w-[100px] h-1 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full bg-gray-300 rounded-full"
                  style={{ width: `${Math.max(2, (m.share / maxShare) * 100)}%` }}
                />
              </div>
              <span className="text-xs text-gray-500 w-12 text-right">{m.share.toFixed(1).replace(".", ",")}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}