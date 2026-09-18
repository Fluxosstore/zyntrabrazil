import React from "react";
import {
  BarChart3,
  Crown,
  User,
  Receipt,
  Brain,
  Wand2,
  Plug,
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

const ICONS = {
  usage: BarChart3,
  plan: Crown,
  account: User,
  invoices: Receipt,
  memories: Brain,
  skills: Wand2,
  connectors: Plug,
};

export default function MobileSettingsTabs({ active = "usage", onSelect }) {
  const { t } = useLanguage();

  const items = [
    { id: "usage", label: t("settings.usage") },
    { id: "plan", label: t("settings.plan") },
    { id: "account", label: t("settings.account") },
    { id: "invoices", label: t("settings.invoices") },
    { id: "memories", label: t("settings.memories") },
    { id: "skills", label: t("settings.skills") },
    { id: "connectors", label: t("settings.connectors") },
  ];

  return (
    <div className="flex gap-2 overflow-x-auto px-4 py-3 border-b border-gray-100 scrollbar-hide">
      {items.map((it) => {
        const Icon = ICONS[it.id];
        const isActive = active === it.id;
        return (
          <button
            key={it.id}
            onClick={() => onSelect?.(it.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              isActive
                ? "bg-[#f3f4f6] text-black border border-black/10"
                : "bg-transparent text-gray-600 border border-transparent"
            }`}
          >
            {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
            {it.label}
          </button>
        );
      })}
    </div>
  );
}