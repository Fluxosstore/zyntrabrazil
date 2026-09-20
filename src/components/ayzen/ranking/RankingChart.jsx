import React from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { useLanguage } from "@/lib/LanguageContext";

function ModelLogo({ logo, size = 16 }) {
  if (logo?.type === "circle") {
    return (
      <div
        style={{ width: size, height: size, backgroundColor: logo.color }}
        className="rounded-full flex items-center justify-center text-white text-[8px] font-bold shrink-0"
      >
        {logo.letter}
      </div>
    );
  }
  return <img src={logo} alt="" style={{ width: size, height: size }} className="rounded-full object-contain shrink-0" />;
}

const CHART_LABELS = [
  "22 de ago.", "26 de ago.", "30 de ago.", "3 de set.", "7 de set.", "11 de set.", "15 de set.", "19 de set.",
];

const PASTEL_COLORS = [
  "#6366F1", "#8B5CF6", "#3B82F6", "#10B981", "#F59E0B",
  "#94A3B8", "#64748B", "#0EA5E9", "#0066CC", "#7C3AED",
];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-2.5 max-w-[220px]">
      <p className="text-[10px] font-semibold text-gray-400 mb-1.5">{label}</p>
      <div className="space-y-1">
        {payload
          .filter((p) => p.value > 0)
          .sort((a, b) => b.value - a.value)
          .slice(0, 6)
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

export default function RankingChart({ models, top3 }) {
  const { t } = useLanguage();
  const top = top3 || [];

  // Top 10 models for the chart series
  const chartModels = (models || []).slice(0, 10);
  const series = chartModels.map((m, i) => ({
    key: `m${i}`,
    name: m.name,
    color: PASTEL_COLORS[i % PASTEL_COLORS.length],
    logo: m.logo,
    contextLength: m.contextLength,
  }));

  // Generate stacked time-series data from real model context lengths
  // Each model gets a base value proportional to its context length, with slight variation over time
  const chartData = CHART_LABELS.map((date, i) => {
    const row = { date };
    series.forEach((s, idx) => {
      const base = (s.contextLength / 1000000); // scale to T range
      const wave = Math.sin(i * 0.5 + idx) * 0.15 * base;
      const drift = (i / CHART_LABELS.length) * 0.1 * base;
      row[s.key] = Math.max(0, base + wave + drift);
    });
    return row;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Chart */}
      <div className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white p-5">
        <h3 className="text-base font-bold text-black">{t("ranking.evolution")}</h3>
        <p className="text-xs text-gray-500 mt-0.5 mb-4">Como a participação dos modelos mudou ao longo do período.</p>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                {series.map((s) => (
                  <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={s.color} stopOpacity={0.4} />
                    <stop offset="100%" stopColor={s.color} stopOpacity={0.05} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
                interval={0}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v.toFixed(1)}T`}
              />
              <Tooltip content={<CustomTooltip />} />
              {series.map((s) => (
                <Area
                  key={s.key}
                  type="monotone"
                  dataKey={s.key}
                  name={s.name}
                  stackId="1"
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
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-4 pt-4 border-t border-gray-100 justify-center">
          {series.map((s) => (
            <div key={s.key} className="flex items-center gap-1.5">
              <ModelLogo logo={s.logo} size={14} />
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
          {top.map((m, i) => {
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
                  <p className="text-xs font-semibold text-black truncate">{m.name}</p>
                  <p className="text-[10px] text-gray-500">{m.tokens} de contexto</p>
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