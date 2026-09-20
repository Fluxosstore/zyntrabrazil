import React from "react";
import { useNavigate } from "react-router-dom";
import { Crown, RefreshCw, X } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { useAuth } from "@/lib/AuthContext";
import { PLAN_LABELS } from "@/components/ayzen/ModelSelector";

const PLAN_PRICES = {
  free: { mensal: "R$ 0,00", anual: "R$ 0,00" },
  starter: { mensal: "R$ 90,00", anual: "R$ 75,00" },
  premium: { mensal: "R$ 149,90", anual: "R$ 124,90" },
  team: { mensal: "R$ 399,90", anual: "R$ 333,25" },
  startup: { mensal: "R$ 599,90", anual: "R$ 499,90" },
  enterprise: { mensal: "R$ 999,90", anual: "R$ 833,25" }
};

const PLAN_DESC_KEYS = {
  free: "settings.planFreeDesc",
  starter: "settings.planStarterDesc",
  premium: "settings.planPremiumDesc",
  team: "settings.planTeamDesc",
  startup: "settings.planStartupDesc",
  enterprise: "settings.planEnterpriseDesc"
};

const MONTHS_PT = [
  "jan", "fev", "mar", "abr", "mai", "jun",
  "jul", "ago", "set", "out", "nov", "dez"
];

function formatExpiryDate(dateStr) {
  if (!dateStr) return null;
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return null;
    const day = d.getDate();
    const month = MONTHS_PT[d.getMonth()];
    const year = d.getFullYear();
    return `${day} de ${month}. de ${year}`;
  } catch {
    return null;
  }
}

// Calcula a data de expiração: assinatura + 30 dias (ajusta para o último dia do mês se necessário)
function calcExpiryFromSubscription(subscribedAt) {
  const start = new Date(subscribedAt);
  const expiry = new Date(start);
  expiry.setDate(expiry.getDate() + 30);
  return expiry.toISOString().split("T")[0];
}

export default function PlanContent() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const plan = user?.plan || "free";
  const planLabel = PLAN_LABELS[plan] || PLAN_LABELS.free;
  const cycle = user?.plan_cycle || "mensal";
  const autoRenew = user?.auto_renew !== false;
  const isFree = plan === "free";

  const price = PLAN_PRICES[plan]?.[cycle] || "R$ 0,00";
  // Se plan_expires estiver definido, usa; senão calcula a partir da data de assinatura + 30 dias
  const planExpires = user?.plan_expires || (!isFree ? calcExpiryFromSubscription(user?.plan_subscribed_at || new Date().toISOString()) : null);
  const expiryDate = formatExpiryDate(planExpires);
  const descKey = PLAN_DESC_KEYS[plan] || "settings.planFreeDesc";

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-10 py-8 space-y-8">
        <div>
          <p className="text-xs text-gray-400">{t("settings.title")}</p>
          <h1 className="text-2xl font-bold text-black mt-0.5">{t("settings.plan")}</h1>
          <p className="text-sm text-gray-500 mt-1">{t("settings.planSubtitle")}</p>
        </div>

        <div className="border-t border-gray-200" />

        {/* Plano atual */}
        <section>
          <h2 className="text-base font-bold text-black mb-3">{t("settings.currentPlan")}</h2>
          <div className="rounded-2xl border border-gray-200 overflow-hidden">
            <div className="bg-white p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#f4f4f4] flex items-center justify-center shrink-0">
                    <Crown className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold tracking-wider text-[#757575]">
                      {t("settings.currentPlan").toUpperCase()}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-lg font-bold text-black">{planLabel}</p>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-[#2e7d32] text-[10px] font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2e7d32]" />
                        {t("settings.activeBadge")}
                      </span>
                    </div>
                    <p className="text-xs text-[#757575] mt-1 max-w-xs">{t(descKey)}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-2xl font-bold text-black">{price}</p>
                  <p className="text-xs text-[#757575]">{t("settings.perMonth")}</p>
                </div>
              </div>
            </div>
            <div className="bg-[#f5f5f5] px-5 py-3 flex items-center justify-between gap-4">
              {expiryDate ? (
                <p className="text-xs text-[#757575]">{t("settings.validUntil")} {expiryDate}</p>
              ) : <span />}
              <button
                onClick={() => navigate("/plan-selection")}
                className="px-4 py-2 rounded-xl border border-gray-300 bg-white text-sm font-medium text-black hover:bg-gray-50 transition-colors"
              >
                {t("settings.changePlan")}
              </button>
            </div>
          </div>
        </section>

        {/* Gerenciar assinatura */}
        {!isFree && (
          <section>
            <h2 className="text-base font-bold text-black mb-1">{t("settings.manageSub")}</h2>
            <p className="text-xs text-gray-500 mb-3">{t("settings.manageSubDesc")}</p>
            <div className="rounded-2xl border border-gray-200 bg-white p-5 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-black mb-1">{t("settings.autoRenewTitle")}</p>
                <p className="text-xs text-gray-600">
                  {autoRenew ? t("settings.autoRenewActiveDesc") : t("settings.renewalCancelled")}
                </p>
              </div>
              {autoRenew ? (
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#e63946] bg-white text-[#e63946] text-sm font-medium hover:bg-red-50 transition-colors shrink-0">
                  <X className="w-3.5 h-3.5" />
                  {t("settings.cancelAutoRenew")}
                </button>
              ) : (
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors shrink-0">
                  <RefreshCw className="w-3.5 h-3.5" />
                  {t("settings.reactivate")}
                </button>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}