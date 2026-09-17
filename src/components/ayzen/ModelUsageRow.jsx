import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function ModelUsageRow({ model, isLast }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

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
          {t("settings.unlimited")}
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
          <div className="grid grid-cols-3">
            <div className="p-4 border-r border-gray-100">
              <p className="text-[10px] font-semibold tracking-wider text-gray-400">
                {t("settings.day")}
              </p>
              <p className="text-sm font-medium text-gray-700 mt-1">
                {t("settings.unlimited")}
              </p>
            </div>
            <div className="p-4 border-r border-gray-100">
              <p className="text-[10px] font-semibold tracking-wider text-gray-400">
                {t("settings.week")}
              </p>
              <p className="text-sm font-medium text-gray-700 mt-1">
                {t("settings.unlimited")}
              </p>
            </div>
            <div className="p-4">
              <p className="text-[10px] font-semibold tracking-wider text-gray-400">
                {t("settings.month")}
              </p>
              <p className="text-sm font-medium text-gray-700 mt-1">
                {t("settings.unlimited")}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}