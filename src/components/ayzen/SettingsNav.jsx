import React from "react";
import { useLanguage } from "@/lib/LanguageContext";

export default function SettingsNav({ active = "usage" }) {
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
    <aside className="w-56 shrink-0 flex flex-col px-4 py-6 border-r border-gray-100">
      <h2 className="text-lg font-bold text-black px-2 mb-4">{t("settings.title")}</h2>
      <nav className="flex-1 space-y-5 overflow-y-auto">
        {sections.map((sec) => (
          <div key={sec.label}>
            <p className="px-2 pb-1.5 text-[10px] font-semibold tracking-wider text-gray-400">
              {sec.label}
            </p>
            <div className="space-y-0.5">
              {sec.items.map((it) => (
                <button
                  key={it.id}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    active === it.id
                      ? "bg-gray-100 text-black"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {it.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}