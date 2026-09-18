import React from "react";
import { Crown } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function SkillsContent() {
  const { t } = useLanguage();

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-10 py-8 space-y-8">
        <div>
          <p className="text-xs text-gray-400">{t("settings.title")}</p>
          <h1 className="text-2xl font-bold text-black mt-0.5">{t("settings.skills")}</h1>
          <p className="text-sm text-gray-500 mt-1">{t("settings.skillsSubtitle")}</p>
        </div>

        <div className="border-t border-gray-200" />

        <section>
          <h2 className="text-base font-bold text-black mb-1">{t("settings.mySkills")}</h2>
          <p className="text-xs text-gray-500 mb-3">{t("settings.mySkillsDesc")}</p>
          <div className="rounded-2xl border border-gray-200 bg-white p-5 flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                <Crown className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-base font-bold text-black">{t("settings.skillsPremiumTitle")}</p>
                  <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-[10px] font-medium">
                    {t("settings.premiumFeature")}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1 max-w-md">{t("settings.skillsPremiumDesc")}</p>
              </div>
            </div>
            <button className="px-4 py-2 rounded-xl bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors shrink-0">
              {t("settings.seePlans")}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}