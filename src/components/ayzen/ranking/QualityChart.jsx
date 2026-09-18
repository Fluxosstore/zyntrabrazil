import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { useLanguage } from "@/lib/LanguageContext";
import { QUALITY_TOP10, QUALITY_TOP3 } from "./qualityData";

function ModelLogo({ logo, size = 16 }) {
  if (logo?.type === "circle") {
    return (
      <div
        style={{ width: size, height: size, backgroundColor: logo.color }}
        className="rounded flex items-center justify-center text-white text-[8px] font-bold shrink-0"
      >
        {logo.letter}
      </div>
    );
  }
  return <img src={logo} alt="" style={{ width: size, height: size }} className="rounded object-contain shrink-0" />;
}

function CustomYTick({ x, y, payload, index }) {
  const model = QUALITY_TOP10[index];
  const logo = model?.logo;
  return (
    <g transform={`translate(${x},${y})`}>
      {logo?.type === "circle" ? (
        <circle cx={-138} cy={0} r={7} fill={logo.color} />
      ) : (
        <image href={logo} x={-146} y={-8} width={16} height={16} preserveAspectRatio="xMidYMid meet" />
      )}
      <text x={-126} y={4} fontSize={11} fill="#374151">{payload.value}</text>
    </g>
  );
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-2.5">
      <p className="text-[11px] font-semibold text-black">{data.name}</p>
      {data.subtitle && <p className="text-[10px] text-gray-400">{data.subtitle}</p>}
      <p className="text-sm font-bold text-black mt-1">{data.intelligence.toFixed(1).replace(".", ",")}</p>
    </div>
  );
}

export default function QualityChart({ metric = "intelligence" }) {
  const { t } = useLanguage();

  const chartData = QUALITY_TOP10.map((m) => ({
    name: m.name.length > 22 ? m.name.slice(0, 20) + "…" : m.name,
    fullName: m.name,
    subtitle: m.subtitle,
    value: m[metric] ?? 0,
  }));

  const top3Badges = [
    { bg: "bg-[#FDF2CC]", text: "text-[#D97706]" },
    { bg: "bg-[#F3F4F6]", text: "text-[#9CA3AF]" },
    { bg: "bg-[#FFEEDD]", text: "text-[#D97706]" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Chart */}
      <div className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white p-5">
        <h3 className="text-base font-bold text-black">{t("ranking.performance")}</h3>
        <p className="text-xs text-gray-500 mt-0.5 mb-4">{t("ranking.performanceDesc")}</p>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 20, left: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis
                type="number"
                domain={[0, 60]}
                tick={{ fontSize: 10, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={<CustomYTick />}
                width={150}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f9fafb" }} />
              <Bar dataKey="value" fill="#4a4a4a" radius={[0, 4, 4, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top 3 */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 self-start">
        <h3 className="text-base font-bold text-black">{t("ranking.top3")}</h3>
        <p className="text-xs text-gray-500 mt-0.5 mb-4">{t("ranking.qualityTop3Desc")}</p>
        <div className="space-y-2">
          {QUALITY_TOP3.map((m, i) => (
            <div
              key={m.rank}
              className={`flex items-center gap-2.5 rounded-xl px-2.5 py-2.5 ${i === 0 ? "bg-[#F2F1ED]" : ""}`}
            >
              <span className={`shrink-0 px-1.5 py-0.5 rounded-md text-[10px] font-bold ${top3Badges[i].bg} ${top3Badges[i].text}`}>
                #{m.rank}
              </span>
              <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                <ModelLogo logo={m.logo} size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-black truncate">{m.name}</p>
                {m.subtitle && <p className="text-[10px] text-gray-400 truncate">{m.subtitle}</p>}
              </div>
              <span className="text-base font-bold text-black shrink-0">
                {(m[metric] ?? 0).toFixed(1).replace(".", ",")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}