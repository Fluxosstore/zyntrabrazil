import React from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { useLanguage } from "@/lib/LanguageContext";
import { CHART_DATA, CHART_SERIES, TOP3 } from "./rankingData";

function ModelLogo({ logo, size = 20 }) {
  if (logo.type === "circle") {
    return (
      <div
        style={{ width: size, height: size, backgroundColor: logo.color }}
        className="rounded-md flex items-center justify-center text-white text-[9px] font-bold shrink-0"
      >
        {logo.letter}
      </div>
    );
  }
  return <img src={logo} alt="" style={{ width: size, height: size }} className="rounded-md object-contain shrink-0" />;
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-2.5 max-w-[200px]">
      <p className="text-[10px] font-semibold text-gray-400 mb-1.5">{label}</p>
      <div className="space-y-1">
        {payload
          .filter((p) => p.value > 0)
          .sort((a, b) => b.value - a.value)
          .slice(0, 5)
          .map((p) => (
            <div key={p.dataKey} className="flex items-center gap-1.5 text-[11px]">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
              <span className="flex-1 text-gray-600 truncate">{p.name}</span>
              <span className="font-semibold text-black">{p.value.toFixed(1)}T</span>
            </div>
          ))}
      </div>
    </div>
  );
}

export default function RankingChart() {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Chart */}
      <div className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white p-5">
        <h3 className="text-base font-bold text-black">{t("ranking.evolution")}</h3>
        <p className="text-xs text-gray-500 mt-0.5 mb-4">{t("ranking.evolutionDesc")}</p>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={CHART_DATA} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                {CHART_SERIES.map((s) => (
                  <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={s.color} stopOpacity={0.15} />
                    <stop offset="100%" stopColor={s.color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
                interval={4}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v.toFixed(1)}T`}
              />
              <Tooltip content={<CustomTooltip />} />
              {CHART_SERIES.map((s) => (
                <Area
                  key={s.key}
                  type="monotone"
                  dataKey={s.key}
                  name={s.name}
                  stroke={s.color}
                  strokeWidth={1.5}
                  fill={`url(#grad-${s.key})`}
                  dot={false}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
        {/* Legend */}
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-4 pt-4 border-t border-gray-100">
          {CHART_SERIES.map((s) => (
            <div key={s.key} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
              <span className="text-[11px] text-gray-600">{s.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top 3 */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 self-start">
        <h3 className="text-base font-bold text-black">{t("ranking.top3")}</h3>
        <p className="text-xs text-gray-500 mt-0.5 mb-4">{t("ranking.top3Desc")}</p>
        <div className="space-y-2">
          {TOP3.map((m, i) => {
            const badge = [
              { bg: "bg-[#FDF2CC]", text: "text-[#D97706]" },
              { bg: "bg-[#F3F4F6]", text: "text-[#9CA3AF]" },
              { bg: "bg-[#FFEEDD]", text: "text-[#D97706]" },
            ][i];
            return (
              <div
                key={m.rank}
                className={`flex items-center gap-2.5 rounded-xl px-2.5 py-2.5 ${i === 0 ? "bg-[#F2F1ED]" : ""}`}
              >
                <span className={`shrink-0 px-1.5 py-0.5 rounded-md text-[10px] font-bold ${badge.bg} ${badge.text}`}>
                  #{m.rank}
                </span>
                <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                  <ModelLogo logo={m.logo} size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-black truncate">{m.vendor}: {m.name}</p>
                  <p className="text-[10px] text-gray-500">{m.tokens}</p>
                </div>
                <span className="text-base font-bold text-black shrink-0">
                  {m.share.toFixed(1).replace(".", ",")}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}