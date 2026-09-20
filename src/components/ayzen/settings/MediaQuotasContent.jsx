import React, { useState, useEffect } from "react";
import { Volume2 } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { base44 } from "@/api/base44Client";
import { MODELS_BY_PLAN, IMAGE_MODELS, AUDIO_MODELS_BY_PLAN } from "@/components/ayzen/ModelSelector";

const QUOTAS_BY_PLAN = {
  free: {
    text: { day: 5, week: 20, month: 50 },
    image: { day: 0, week: 0, month: 0 },
    audio: { day: 0, week: 0, month: 0 }
  },
  starter: {
    text: { day: 20, week: 80, month: 300 },
    image: { day: 2, week: 8, month: 30 },
    audio: { day: 1, week: 4, month: 15 }
  },
  premium: {
    text: { day: 40, week: 150, month: 600 },
    image: { day: 4, week: 15, month: 50 },
    audio: { day: 2, week: 8, month: 25 }
  },
  team: {
    text: { day: 80, week: 300, month: 1200 },
    image: { day: 8, week: 30, month: 100 },
    audio: { day: 4, week: 15, month: 40 }
  },
  startup: {
    text: { day: 150, week: 600, month: 2500 },
    image: { day: 12, week: 45, month: 150 },
    audio: { day: 6, week: 22, month: 60 }
  },
  enterprise: {
    text: "unlimited",
    image: "unlimited",
    audio: "unlimited"
  }
};

const CAT_KEYS = {
  text: "settings.mediaTextos",
  image: "settings.mediaImages",
  audio: "settings.mediaAudios"
};

function buildModelItems(plan) {
  const quotas = QUOTAS_BY_PLAN[plan] || QUOTAS_BY_PLAN.free;
  const textModels = MODELS_BY_PLAN[plan] || MODELS_BY_PLAN.free;
  const imageModels = IMAGE_MODELS;
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
      try {
        const records = await base44.entities.TokenUsage.list();
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const counts = {};
        records.forEach((r) => {
          if (!r.model) return;
          if (!counts[r.model]) counts[r.model] = { day: 0, week: 0, month: 0, total: 0 };
          const d = new Date(r.created_date);
          counts[r.model].total++;
          if (d >= startOfDay) counts[r.model].day++;
          if (d >= startOfWeek) counts[r.model].week++;
          if (d >= startOfMonth) counts[r.model].month++;
        });
        setUsageCounts(counts);
      } catch (err) {
        console.error("Erro ao carregar uso:", err);
      }
    })();
  }, []);

  return (
    <section>
      <h2 className="text-base font-bold text-black mb-1">{t("settings.mediaQuotas")}</h2>
      <p className="text-xs text-gray-500 mb-3">{t("settings.mediaQuotasDesc")}</p>
      <div className="grid grid-cols-2 gap-4">
        {items.map((item) => {
          const isUnlimited = item.quotas === "unlimited";
          const isNotIncluded = !isUnlimited && item.quotas.day === 0 && item.quotas.week === 0 && item.quotas.month === 0;
          const modelUsage = usageCounts[item.name] || { day: 0, week: 0, month: 0, total: 0 };

          return (
            <div key={item.id} className="rounded-2xl border border-gray-200 bg-white p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                    {item.logo ? (
                      <img src={item.logo} alt={item.name} className="w-5 h-5 object-contain" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-gray-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-black leading-tight">{item.name}</p>
                    <p className="text-[10px] font-semibold tracking-wider text-gray-400">{t(item.catKey)}</p>
                  </div>
                </div>
              </div>

              {isUnlimited ? (
                <>
                  <p className="text-lg font-bold text-black">{t("settings.mediaUnlimited")}</p>
                  <p className="text-[11px] text-gray-500 mt-1">{t("settings.mediaGenerated", { n: modelUsage.total })}</p>
                </>
              ) : isNotIncluded ? (
                <p className="text-sm text-gray-400 mt-1">{t("settings.mediaNotIncluded")}</p>
              ) : (
                <div className="space-y-2">
                  <QuotaRow label={t("settings.mediaDay")} consumed={modelUsage.day} limit={item.quotas.day} />
                  <QuotaRow label={t("settings.mediaWeek")} consumed={modelUsage.week} limit={item.quotas.week} />
                  <QuotaRow label={t("settings.mediaMonth")} consumed={modelUsage.month} limit={item.quotas.month} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}