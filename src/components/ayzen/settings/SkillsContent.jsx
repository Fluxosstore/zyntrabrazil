import React from "react";
import { Crown, Wand2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/lib/LanguageContext";

export default function SkillsContent({ plan = "free", onCreateSkill }) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const isPaid = plan && plan !== "free";

  if (!isPaid) {
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
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <Crown className="w-5 h-5 text-gray-600" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-base font-bold text-black">{t("settings.skillsPremiumTitle")}</p>
                    <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-[10px] font-medium shrink-0">
                      {t("settings.premiumFeature")}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 md:whitespace-nowrap">{t("settings.skillsPremiumDesc")}</p>
                </div>
              </div>
              <button
                onClick={() => navigate("/plan-selection")}
                className="px-4 py-2 rounded-xl bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors shrink-0"
              >
                {t("settings.seePlans")}
              </button>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-10 py-8 space-y-8">
        {/* Header */}
        <div>
          <p className="text-xs text-gray-400">{t("settings.title")}</p>
          <h1 className="text-2xl font-bold text-black mt-0.5">{t("settings.skills")}</h1>
          <p className="text-sm text-gray-500 mt-1">{t("settings.skillsSubtitle")}</p>
        </div>

        <div className="border-t border-gray-200" />

        {/* Summary card */}
        <section>
          <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
            <div className="flex items-center gap-3 p-5">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                <Wand2 className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-base font-bold text-black">{t("settings.skillsLibraryTitle")}</p>
                <p className="text-xs text-gray-500 mt-0.5">{t("settings.skillsLibraryDesc")}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 border-t border-gray-100">
              <div className="p-4 border-r border-gray-100">
                <p className="text-[10px] font-semibold tracking-wider text-gray-400">
                  {t("settings.skillsActive")}
                </p>
                <p className="text-lg font-bold text-black mt-0.5">0</p>
              </div>
              <div className="p-4 border-r border-gray-100">
                <p className="text-[10px] font-semibold tracking-wider text-gray-400">
                  {t("settings.skillsInactive")}
                </p>
                <p className="text-lg font-bold text-black mt-0.5">0</p>
              </div>
              <div className="p-4">
                <p className="text-[10px] font-semibold tracking-wider text-gray-400">
                  {t("settings.skillsAvailable")}
                </p>
                <p className="text-lg font-bold text-black mt-0.5">20</p>
              </div>
            </div>
          </div>
        </section>

        {/* My skills */}
        <section>
          <h2 className="text-base font-bold text-black mb-1">{t("settings.mySkills")}</h2>
          <p className="text-xs text-gray-500 mb-3">{t("settings.mySkillsDesc")}</p>
          <div className="rounded-2xl border border-gray-200 bg-white p-5 flex items-center justify-between gap-4">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                <Wand2 className="w-5 h-5 text-gray-600" />
              </div>
              <div className="min-w-0">
                <p className="text-base font-bold text-black">{t("settings.createFirstSkill")}</p>
                <p className="text-xs text-gray-500 mt-1">{t("settings.createFirstSkillDesc")}</p>
              </div>
            </div>
            <button
              onClick={onCreateSkill}
              className="px-4 py-2 rounded-full bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors shrink-0 whitespace-nowrap"
            >
              {t("settings.createFirstSkillBtn")}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}