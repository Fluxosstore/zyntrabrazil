import React from "react";
import { Crown, RefreshCw, AlertCircle } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { useAuth } from "@/lib/AuthContext";
import { PLAN_LABELS } from "@/components/ayzen/ModelSelector";

export default function PlanContent() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const plan = user?.plan || "free";
  const planLabel = PLAN_LABELS[plan] || PLAN_LABELS.free;

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-8 py-8 space-y-8">
        <div>
          <p className="text-xs text-gray-400">{t("settings.title")}</p>
          <h1 className="text-2xl font-bold text-black mt-0.5">{t("settings.plan")}</h1>
          <p className="text-sm text-gray-500 mt-1">{t("settings.planSubtitle")}</p>
        </div>

        <div className="border-t border-gray-200" />

        <section>
          <h2 className="text-base font-bold text-black mb-3">{t("settings.currentPlan")}</h2>
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                  <Crown className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold tracking-wider text-gray-400">
                    {t("settings.currentPlan").toUpperCase()}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-lg font-bold text-black">{planLabel}</p>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-green-600 text-[10px] font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      {t("settings.activeBadge")}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 max-w-xs">{t("settings.planFreeDesc")}</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-2xl font-bold text-black">R$ 0,00</p>
                <p className="text-xs text-gray-400">{t("settings.perMonth")}</p>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button className="px-4 py-2 rounded-xl border border-gray-300 text-sm font-medium text-black hover:bg-gray-50 transition-colors">
                {t("settings.changePlan")}
              </button>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-base font-bold text-black mb-1">{t("settings.manageSub")}</h2>
          <p className="text-xs text-gray-500 mb-3">{t("settings.manageSubDesc")}</p>
          <div className="rounded-2xl border border-gray-200 bg-white p-4 flex items-center justify-between gap-4">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
              <p className="text-xs text-gray-600">{t("settings.renewalCancelled")}</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors shrink-0">
              <RefreshCw className="w-3.5 h-3.5" />
              {t("settings.reactivate")}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}