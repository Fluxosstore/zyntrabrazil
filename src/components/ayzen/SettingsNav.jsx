import React from "react";
import {
  BarChart3,
  Crown,
  User,
  Brain,
  Wand2,
  Plug,
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { ReceiptLinesIcon } from "@/components/ayzen/SettingsIcons";

const ICONS = {
  usage: BarChart3,
  plan: Crown,
  account: User,
  invoices: ReceiptLinesIcon,
  memories: Brain,
  skills: Wand2,
  connectors: Plug,
};

export default function SettingsNav({ active = "usage", onSelect }) {
  const { t } = useLanguage();

  const sections = [
    {
      label: t("settings.accountSection"),
      items: [
        { id: "usage", label: t("settings.usage") },
        { id: "plan", label: t("settings.plan") },
        { id: "account", label: t("settings.account") },
        { id: "invoices", label: t("settings.invoices") },
      ],
    },
    {
      label: t("settings.personalizationSection"),
      items: [
        { id: "memories", label: t("settings.memories") },
        { id: "skills", label: t("settings.skills") },
      ],
    },
    {
      label: t("settings.integrationsSection"),
      items: [{ id: "connectors", label: t("settings.connectors") }],
    },
  ];

  return (
    <aside className="w-56 shrink-0 flex flex-col bg-[#f7f7f8] px-4 py-6">
      <h2 className="text-lg font-bold text-black px-2 mb-4">{t("settings.title")}</h2>
      <div className="h-px bg-gray-200 mx-2 mb-4" />
      <nav className="flex-1 space-y-5 overflow-y-auto">
        {sections.map((sec) => (
          <div key={sec.label}>
            <p className="px-2 pb-1.5 text-[10px] font-semibold tracking-wider text-gray-400">
              {sec.label}
            </p>
            <div className="space-y-0.5">
              {sec.items.map((it) => {
                const Icon = ICONS[it.id];
                return (
                  <button
                    key={it.id}
                    onClick={() => onSelect?.(it.id)}
                    className={`w-full flex items-center gap-2.5 text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      active === it.id
                        ? "bg-[#e8e8e8] text-black"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {Icon && <Icon className="w-4 h-4 shrink-0 text-[#333333]" />}
                    {it.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}