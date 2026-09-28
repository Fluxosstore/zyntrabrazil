import React, { useState, useEffect } from "react";
import { Volume2 } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { base44 } from "@/api/base44Client";
import { MODELS_BY_PLAN, IMAGE_MODELS_BY_PLAN, AUDIO_MODELS_BY_PLAN } from "@/components/ayzen/ModelSelector";
import { QUOTAS_BY_PLAN, getUsageCounts } from "@/lib/quotaUtils";
import FairUseCard from "@/components/ayzen/settings/FairUseCard";

const CAT_KEYS = {
  text: "settings.mediaTextos",
  image: "settings.mediaImages",
  audio: "settings.mediaAudios"
};

function buildModelItems(plan) {
  const quotas = QUOTAS_BY_PLAN[plan] || QUOTAS_BY_PLAN.free;
  const textModels = MODELS_BY_PLAN[plan] || MODELS_BY_PLAN.free;
  const imageModels = IMAGE_MODELS_BY_PLAN[plan] || IMAGE_MODELS_BY_PLAN.free;
  const audioModels = AUDIO_MODELS_BY_PLAN[plan] || [];

  const items = [];

  textModels.forEach((m) => {
    items.push({
      id: `text-${m.id}`,
      name: m.name,
      logo: m.logo,
      catKey: CAT_KEYS.text,
      quotas: quotas.text
    });
  });

  imageModels.forEach((m) => {
    items.push({
      id: `image-${m.id}`,
      name: m.name,
      logo: m.logo,
      catKey: CAT_KEYS.image,
      quotas: quotas.image
    });
  });

  audioModels.forEach((m) => {
    items.push({
      id: `audio-${m.id}`,
      name: m.name,
      logo: m.logo,
      catKey: CAT_KEYS.audio,
      quotas: quotas.audio
    });
  });

  return items;
}

function QuotaRow({ label, consumed, limit }) {
  const pct = limit > 0 ? Math.min(100, Math.round((consumed / limit) * 100)) : 0;
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-medium text-gray-400 w-12 shrink-0">{label}</span>
      <span className="text-[11px] font-semibold text-gray-600 shrink-0 tabular-nums">{consumed} / {limit}</span>
      <div className="flex-1 h-1 rounded-full bg-gray-100 overflow-hidden">
        <div className="h-full bg-black rounded-full" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function MediaQuotasContent({ plan }) {
  const { t } = useLanguage();
  const items = buildModelItems(plan);
  const [usageCounts, setUsageCounts] = useState({});

  useEffect(() => {
    (async () => {
      const counts = await getUsageCounts();
      setUsageCounts(counts);
    })();
  }, []);

  return (
    <section>
      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
        <div className="px-5 pt-5 pb-1">
          <h2 className="text-base font-bold text-black">Consumo por IA</h2>
          <p className="text-xs text-gray-500 mt-0.5">Acompanhe o uso de cada modelo disponível no seu plano.</p>
        </div>
        {/* Header */}
        <div className="grid grid-cols-[2fr_1.2fr_2fr_1fr] gap-4 px-5 py-3 border-b border-gray-200">
          <span className="text-xs font-medium text-gray-500">IA</span>
          <span className="text-xs font-medium text-gray-500">Custo</span>
          <span className="text-xs font-medium text-gray-500">Na semana</span>
          <span className="text-xs font-medium text-gray-500">Mensagens</span>
        </div>
        {/* Rows */}
        {items.map((item, i) => {
          const modelUsage = usageCounts[item.name] || { day: 0, week: 0, month: 0, total: 0 };
          const isUnlimited = item.quotas === "unlimited";
          const weekLimit = isUnlimited ? 0 : (item.quotas.week > 0 ? item.quotas.week : item.quotas.month);
          const weekPct = weekLimit > 0 ? Math.min(100, Math.round((modelUsage.week / weekLimit) * 100)) : 0;
          const isLast = i === items.length - 1;
          return (
            <div key={item.id} className={`grid grid-cols-[2fr_1.2fr_2fr_1fr] gap-4 px-5 py-4 items-center ${!isLast ? "border-b border-gray-100" : ""}`}>
              {/* IA */}
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                  {item.logo ? (
                    <img src={item.logo} alt={item.name} className="w-5 h-5 object-contain" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-gray-600" />
                  )}
                </div>
                <span className="text-sm font-medium text-black truncate">{item.name}</span>
              </div>
              {/* Custo */}
              <div>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#F3F4F6] text-[11px] font-medium text-gray-600">
                  Usa créditos
                </span>
              </div>
              {/* Na semana */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-1.5 rounded-full bg-gray-200 overflow-hidden">
                  <div className="h-full bg-gray-700 rounded-full transition-all duration-700" style={{ width: `${weekPct}%` }} />
                </div>
                <span className="text-xs font-medium text-gray-600 tabular-nums w-9 text-right">{weekPct}%</span>
              </div>
              {/* Mensagens */}
              <span className="text-xs text-gray-500">Sem limite</span>
            </div>
          );
        })}
      </div>

      <div className="mt-4">
        <FairUseCard plan={plan} />
      </div>
    </section>
  );
}