import React from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { QUALITY_MODELS } from "./qualityData";

function ModelLogo({ logo, size = 28 }) {
  if (logo?.type === "circle") {
    return (
      <div
        style={{ width: size, height: size, backgroundColor: logo.color }}
        className="rounded-md flex items-center justify-center text-white text-[11px] font-bold shrink-0"
      >
        {logo.letter}
      </div>
    );
  }
  return (
    <img src={logo} alt="" className="rounded-md object-contain shrink-0" style={{ width: size, height: size }} />
  );
}

function fmt(v) {
  if (v === null || v === undefined) return "—";
  return v.toFixed(1).replace(".", ",");
}

export default function MobileQualityList() {
  const { t } = useLanguage();

  return (
    <div className="space-y-2.5">
      {QUALITY_MODELS.map((m) => (
        <div key={m.rank} className="rounded-2xl border border-[#E8E8E8] bg-[#FAFAFA] p-3.5">
          <div className="flex items-center gap-3">
            <span className="shrink-0 px-2 py-0.5 rounded-md bg-[#EFEFEF] text-[11px] font-bold text-[#555555]">
              #{m.rank}
            </span>
            <ModelLogo logo={m.logo} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-black truncate leading-tight">{m.name}</p>
              {m.subtitle && (
                <p className="text-[11px] text-[#8C8C8C] truncate mt-0.5">{m.subtitle}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-3.5 pt-3 border-t border-[#E8E8E8]">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8C8C8C]">
                {t("ranking.intelligence")}
              </p>
              <p className="text-sm font-bold text-black mt-1">{fmt(m.intelligence)}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8C8C8C]">
                {t("ranking.programming")}
              </p>
              <p className="text-sm font-bold text-black mt-1">{fmt(m.programming)}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8C8C8C]">
                {t("ranking.agentic")}
              </p>
              <p className="text-sm font-bold text-black mt-1">{fmt(m.agentic)}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}