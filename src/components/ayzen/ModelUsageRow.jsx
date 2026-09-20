import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { QUOTAS_BY_PLAN, getUsageCounts } from "@/lib/quotaUtils";

const TAG_TO_CAT = {
  Texto: "text",
  Imagem: "image",
  Áudio: "audio",
  Audio: "audio"
};

export default function ModelUsageRow({ model, isLast, plan = "free" }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [usage, setUsage] = useState({ month: 0, total: 0 });

  const cat = model.tags?.map((tag) => TAG_TO_CAT[tag]).find(Boolean) || "text";
  const quotas = QUOTAS_BY_PLAN[plan] || QUOTAS_BY_PLAN.free;
  const categoryQuota = quotas[cat];
  const isUnlimited = categoryQuota === "unlimited";
  const monthLimit = !isUnlimited && categoryQuota ? categoryQuota.month : 0;

  useEffect(() => {
    (async () => {
      const counts = await getUsageCounts();
      const u = counts[model.name] || { month: 0, total: 0 };
      setUsage({ month: u.month, total: u.total });
    })();
  }, [model.name]);

  const pct = monthLimit > 0 ? Math.min(100, Math.round((usage.month / monthLimit) * 100)) : 0;

  return (
    <div className={isLast ? "" : "border-b border-gray-100"}>
      {/* Header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
      >
        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
          <img src={model.logo} alt={model.name} className="w-5 h-5 object-contain" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-black">{model.name}</p>
          <div className="flex gap-1.5 mt-1">
            {model.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] text-gray-500 bg-gray-100 rounded-full px-2 py-0.5"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <span className="flex items-center gap-1.5 text-[11px] font-medium text-gray-600 bg-gray-100 rounded-full px-2.5 py-1">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
          {isUnlimited ? t("settings.unlimited") : `${usage.month} / ${monthLimit}`}
        </span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
        )}
      </button>

      {/* Expanded usage card */}
      {open && (
        <div className="bg-[#f8f9fa] border-t border-gray-100">
          <div className="p-4">
            {isUnlimited ? (
              <>
                <p className="text-[10px] font-semibold tracking-wider text-gray-400">
                  {t("settings.month")}
                </p>
                <p className="text-sm font-medium text-gray-700 mt-1">
                  {t("settings.unlimited")}
                </p>
                <p className="text-[11px] text-gray-500 mt-1">
                  {t("settings.mediaGenerated", { n: usage.total })}
                </p>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-medium text-gray-400 w-12 shrink-0">
                  {t("settings.mediaMonth")}
                </span>
                <span className="text-[11px] font-semibold text-gray-600 shrink-0 tabular-nums">
                  {usage.month} / {monthLimit}
                </span>
                <div className="flex-1 h-1 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full bg-black rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}