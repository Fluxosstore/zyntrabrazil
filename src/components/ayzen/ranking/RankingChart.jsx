import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { useLanguage } from "@/lib/LanguageContext";

function ModelLogo({ logo, size = 20 }) {
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
  return <img src={logo} alt="" style={{ width: size, height: size }} className="rounded-md object-contain shrink-0" />;
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const item = payload[0]?.payload;
  if (!item) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-2.5 max-w-[220px]">
      <p className="text-[11px] font-semibold text-black truncate">{item.fullName}</p>
      <p className="text-[10px] text-gray-500">{item.vendor}</p>
      <p className="text-[11px] text-gray-700 mt-1">
        {(item.contextLength / 1000).toFixed(0)}K tokens de contexto
      </p>
    </div>
  );
}

export default function RankingChart({ models, top3 }) {
  const { t } = useLanguage();
  const top = top3 || [];
  const chartData = (models || []).slice(0, 10).map((m) => ({
    name: m.name.length > 22 ? m.name.slice(0, 22) + "…" : m.name,
    fullName: m.name,
    vendor: m.vendor,
    contextLength: m.contextLength,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Chart */}
      <div className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white p-5">
        <h3 className="text-base font-bold text-black">{t("ranking.evolution")}</h3>
        <p className="text-xs text-gray-500 mt-0.5 mb-4">Janela de contexto dos modelos mais capazes</p>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fontSize: 10, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 9, fill: "#6b7280" }}
                axisLine={false}
                tickLine={false}
                width={130}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f5f3ff" }} />
              <Bar dataKey="contextLength" radius={[0, 4, 4, 0]} fill="#7E57C2" />
            </BarChart>
          </ResponsiveContainer>
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