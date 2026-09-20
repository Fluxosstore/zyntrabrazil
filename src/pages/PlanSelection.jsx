import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Sun, Star, Loader2 } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { useAuth } from "@/lib/AuthContext";
import { base44 } from "@/api/base44Client";
import { buildPersonalPlans, buildBusinessPlans } from "@/lib/planData";

export default function PlanSelection() {
  const { t } = useLanguage();
  const { user, checkUserAuth } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("pessoal");
  const [cycle, setCycle] = useState(user?.plan_cycle || "mensal");
  const [confirmPlan, setConfirmPlan] = useState(null);
  const [processing, setProcessing] = useState(false);

  const currentPlan = user?.plan || "free";
  const personalPlans = buildPersonalPlans(t);
  const businessPlans = buildBusinessPlans(t);
  const plans = tab === "pessoal" ? personalPlans : businessPlans;

  const handleConfirm = async () => {
    if (!confirmPlan) return;
    setProcessing(true);
    try {
      await base44.auth.updateMe({
        plan: confirmPlan.id,
        plan_cycle: cycle,
        plan_subscribed_at: new Date().toISOString(),
        auto_renew: true,
      });
      await checkUserAuth();
      setConfirmPlan(null);
      navigate("/settings", { state: { section: "plan" } });
    } catch (err) {
      console.error("Erro ao atualizar plano:", err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      {/* Header */}
      <header className="flex items-center justify-between px-6 lg:px-10 py-2">
        <button
          onClick={() => navigate("/settings", { state: { section: "plan" } })}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("planSelection.back")}
        </button>
        <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600 transition-colors">
          <Sun className="w-4 h-4" />
        </button>
      </header>

      {/* Title section */}
      <div className="px-6 lg:px-10 max-w-[1280px] mx-auto">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
          <span className="text-xs font-semibold tracking-widest text-[#8B5CF6] uppercase">
            {t("planSelection.badge")}
          </span>
        </div>
        <h1 className="text-xl lg:text-2xl font-bold text-black tracking-tight">
          {t("planSelection.title")}
        </h1>
        <p className="text-sm text-gray-500 mt-1.5 max-w-xl">
          {t("planSelection.subtitle")}
        </p>
      </div>

      {/* Tabs + Cycle toggle */}
      <div className="px-6 lg:px-10 max-w-[1280px] mx-auto mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="inline-flex bg-gray-100 rounded-full p-1">
          {["pessoal", "empresarial"].map((tabKey) => (
            <button
              key={tabKey}
              onClick={() => setTab(tabKey)}
              className={`px-6 py-2 text-sm font-medium rounded-full transition-all capitalize ${
                tab === tabKey ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tabKey === "pessoal" ? t("pricing.tabPersonal") : t("pricing.tabBusiness")}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <span className={`text-sm font-medium ${cycle === "mensal" ? "text-gray-900" : "text-gray-400"}`}>
            {t("pricing.monthly")}
          </span>
          <button
            onClick={() => setCycle(cycle === "mensal" ? "anual" : "mensal")}
            className="relative w-12 h-6 rounded-full bg-gray-200 transition-colors"
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                cycle === "anual" ? "translate-x-6 bg-violet-600" : ""
              }`}
            />
          </button>
          <span className={`text-sm font-medium ${cycle === "anual" ? "text-gray-900" : "text-gray-400"}`}>
            {t("pricing.annual")}
          </span>
          <span className="text-xs font-semibold text-violet-600 bg-violet-50 px-2.5 py-1 rounded-full">
            {t("pricing.twoMonthsFree")}
          </span>
        </div>
      </div>

      {/* Cards */}
      <div className="px-6 lg:px-10 max-w-[1280px] mx-auto mt-4 pb-6">
        <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto items-start">
          {plans.map((plan) => {
            const isCurrent = plan.id === currentPlan;
            return (
              <div
                key={plan.id}
                className="relative bg-white border border-[#e5e5e5] rounded-2xl p-4 flex flex-col"
              >
                {plan.tag && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 bg-violet-600 text-white text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                    <Star className="w-3 h-3 fill-white" />
                    {plan.tag}
                  </div>
                )}
                {isCurrent && (
                  <span className="absolute top-6 right-6 inline-flex items-center px-2.5 py-1 rounded-full bg-violet-600 text-white text-[10px] font-bold tracking-wider">
                    {t("planSelection.current")}
                  </span>
                )}
                <h3 className="text-base font-bold text-[#111111]">{plan.name}</h3>
                <p className="text-xs text-[#666666] mt-1 leading-relaxed">{plan.desc}</p>
                <hr className="my-3 border-[#e5e5e5]" />
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-[#111111]">{plan.price[cycle]}</span>
                  {plan.period && <span className="text-xs text-[#666666]">{plan.period}</span>}
                </div>
                <ul className="mt-3 space-y-1.5">
                  <li className="flex items-center gap-2 text-sm font-medium text-[#111111]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
                    {plan.highlightFeature}
                  </li>
                </ul>
                <hr className="my-3 border-[#e5e5e5]" />
                <ul className="space-y-1.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-[#666666]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#d1d5db]" />
                      {f}
                    </li>
                  ))}
                </ul>
                <hr className="my-3 border-[#e5e5e5]" />
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#666666]">{t("pricing.iasIncluded")}</span>
                  <span className="text-xs font-semibold text-[#111111]">{plan.modelsCount}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {plan.models.map((m, i) =>
                    m.more ? (
                      <span
                        key={i}
                        className="inline-flex items-center bg-[#F8F9FA] border border-[#E5E7EB] rounded-full px-2.5 py-1 text-xs font-medium text-[#374151]"
                      >
                        +{m.more}
                      </span>
                    ) : (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-full px-2.5 py-1 text-xs font-medium text-[#374151]"
                      >
                        <img src={m.src} alt="" className="w-3.5 h-3.5 object-contain" />
                        {m.label}
                      </span>
                    )
                  )}
                </div>
                {isCurrent ? (
                  <button
                    disabled
                    className="mt-4 w-full py-2.5 rounded-full text-sm font-semibold text-gray-400 bg-gray-100 border border-[#e5e5e5] cursor-default"
                  >
                    {t("planSelection.currentPlan")}
                  </button>
                ) : (
                  <button
                    onClick={() => setConfirmPlan(plan)}
                    className="mt-4 w-full py-2.5 rounded-full text-sm font-semibold text-black bg-white border border-[#D1D1D1] hover:border-violet-300 hover:bg-gray-50 transition-colors"
                  >
                    {t("planSelection.select")} →
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Confirmation modal */}
      {confirmPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <h2 className="text-lg font-bold text-black">{t("planSelection.confirmTitle")}</h2>
            <p className="text-sm text-gray-500 mt-2">
              {t("planSelection.confirmDesc", { plan: confirmPlan.name, price: confirmPlan.price[cycle] })}
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setConfirmPlan(null)}
                disabled={processing}
                className="flex-1 py-2.5 rounded-xl border border-gray-300 bg-white text-sm font-medium text-black hover:bg-gray-50 transition-colors"
              >
                {t("planSelection.cancel")}
              </button>
              <button
                onClick={handleConfirm}
                disabled={processing}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] text-white text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                {processing && <Loader2 className="w-4 h-4 animate-spin" />}
                {t("planSelection.confirm")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}