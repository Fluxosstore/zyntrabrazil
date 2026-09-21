import React, { useState } from "react";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/lib/LanguageContext";
import { useAuth } from "@/lib/AuthContext";
import { getFreeTimeLabel } from "@/lib/planData";

const GEMINI = "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/c545d8735_gemini.svg";
const DEEPSEEK = "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/d6d9b4c6f_deepseek.svg";
const GPT = "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/698f8c822_chatgpt.svg";
const CLAUDE = "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/c0a57947c_claude.svg";
const GROK = "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/ad894e6fd_grok.svg";

function buildPersonalPlans(t) {
  return [
    {
      name: "Zyntra Free",
      desc: t("pricing.freeDesc"),
      price: { mensal: t("pricing.free"), anual: t("pricing.free") },
      period: null,
      highlightFeature: t("pricing.unlimitedMessages"),
      features: [t("pricing.freeF1"), t("pricing.freeF2"), t("pricing.freeF3")],
      modelsCount: t("pricing.freeModels"),
      models: [{ src: DEEPSEEK, label: "DeepSeek" }],
      cta: t("pricing.freeCta"),
      tag: null,
    },
    {
      name: "Starter",
      desc: t("pricing.starterDesc"),
      price: { mensal: "R$ 90,00", anual: "R$ 75,00" },
      period: t("pricing.perMonth"),
      highlightFeature: t("pricing.unlimitedMessages"),
      features: [t("pricing.starterF1"), t("pricing.starterF2"), t("pricing.starterF3"), t("pricing.starterF4"), t("pricing.featureImageGen"), t("pricing.featureAudioGen"), t("pricing.featureVideoGen")],
      modelsCount: t("pricing.starterModels"),
      models: [{ src: GEMINI, label: "Gemini" }, { src: DEEPSEEK, label: "DeepSeek" }, { src: GPT, label: "GPT" }],
      cta: t("pricing.starterCta"),
      tag: t("pricing.mostPopular"),
    },
    {
      name: "Pessoal Premium",
      desc: t("pricing.premiumDesc"),
      price: { mensal: "R$ 149,90", anual: "R$ 124,90" },
      period: t("pricing.perMonth"),
      highlightFeature: t("pricing.unlimitedMessages"),
      features: [t("pricing.premiumF1"), t("pricing.premiumF2"), t("pricing.premiumF3"), t("pricing.premiumF4"), t("pricing.featureImageGen"), t("pricing.featureAudioGen"), t("pricing.featureVideoGen")],
      modelsCount: t("pricing.premiumModels"),
      models: [{ src: GEMINI, label: "Gemini" }, { src: DEEPSEEK, label: "DeepSeek" }, { src: CLAUDE, label: "Claude" }, { src: GROK, label: "Grok" }, { src: GPT, label: "GPT-5" }],
      cta: t("pricing.premiumCta"),
      tag: null,
    },
  ];
}

function buildBusinessPlans(t) {
  return [
    {
      name: "Empresarial Team",
      desc: t("pricing.teamDesc"),
      price: { mensal: "R$ 399,90", anual: "R$ 333,25" },
      period: t("pricing.perMonth"),
      highlightFeature: t("pricing.limitedMessages"),
      features: [t("pricing.teamF1"), t("pricing.teamF2"), t("pricing.teamF3"), t("pricing.teamF4"), t("pricing.featureImageGen"), t("pricing.featureAudioGen"), t("pricing.featureVideoGen")],
      modelsCount: t("pricing.teamModels"),
      models: [{ src: GEMINI, label: "Gemini" }, { src: DEEPSEEK, label: "DeepSeek" }, { src: GPT, label: "GPT" }, { src: CLAUDE, label: "Claude" }, { src: GROK, label: "Grok" }, { more: 4 }],
      cta: t("pricing.teamCta"),
      tag: null,
    },
    {
      name: "Empresarial Startup",
      desc: t("pricing.startupDesc"),
      price: { mensal: "R$ 599,90", anual: "R$ 499,90" },
      period: t("pricing.perMonth"),
      highlightFeature: t("pricing.limitedMessages"),
      features: [t("pricing.startupF1"), t("pricing.startupF2"), t("pricing.startupF3"), t("pricing.startupF4"), t("pricing.startupF5"), t("pricing.featureImageGen"), t("pricing.featureAudioGen"), t("pricing.featureVideoGen")],
      modelsCount: t("pricing.startupModels"),
      models: [{ src: GEMINI, label: "Gemini" }, { src: DEEPSEEK, label: "DeepSeek" }, { src: GPT, label: "GPT" }, { src: CLAUDE, label: "Claude" }, { src: GROK, label: "Grok" }, { more: 4 }],
      cta: t("pricing.startupCta"),
      tag: t("pricing.mostPopular"),
    },
    {
      name: "Empresarial Enterprise",
      desc: t("pricing.enterpriseDesc"),
      price: { mensal: "R$ 999,90", anual: "R$ 833,25" },
      period: t("pricing.perMonth"),
      highlightFeature: t("pricing.limitedMessages"),
      features: [t("pricing.enterpriseF1"), t("pricing.enterpriseF2"), t("pricing.enterpriseF3"), t("pricing.enterpriseF4"), t("pricing.enterpriseF5"), t("pricing.featureImageGen"), t("pricing.featureAudioGen"), t("pricing.featureVideoGen"), t("pricing.enterpriseF6")],
      modelsCount: t("pricing.enterpriseModels"),
      models: [{ src: GEMINI, label: "Gemini" }, { src: DEEPSEEK, label: "DeepSeek" }, { src: GPT, label: "GPT" }, { src: CLAUDE, label: "Claude" }, { src: GROK, label: "Grok" }, { more: 9 }],
      cta: t("pricing.enterpriseCta"),
      tag: null,
    },
  ];
}

function PlanCard({ plan, cycle, t, onCta }) {
  return (
    <div className="relative bg-white border border-[#e5e5e5] rounded-3xl p-8 flex flex-col">
      {plan.tag && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 bg-violet-600 text-white text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
          <Star className="w-3 h-3 fill-white" />
          {plan.tag}
        </div>
      )}
      <h3 className="text-lg font-bold text-[#111111]">{plan.name}</h3>
      <p className="text-sm text-[#666666] mt-1.5 leading-relaxed">{plan.desc}</p>
      <hr className="my-6 border-[#e5e5e5]" />
      <div className="flex items-baseline gap-1">
        <span className="text-4xl font-bold text-[#111111]">{plan.price[cycle]}</span>
        {plan.period && <span className="text-sm text-[#666666]">{plan.period}</span>}
      </div>
      <ul className="mt-6 space-y-3">
        <li className="flex items-center gap-2.5 text-sm font-medium text-[#111111]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
          {plan.highlightFeature}
        </li>
      </ul>
      <hr className="my-6 border-[#e5e5e5]" />
      <ul className="space-y-3">
        {plan.features.map((f) => (
          <li key={f} className="flex items-center gap-2.5 text-sm text-[#666666]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d1d5db]" />
            {f}
          </li>
        ))}
      </ul>
      <hr className="my-6 border-[#e5e5e5]" />
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-[#666666]">{t("pricing.iasIncluded")}</span>
        <span className="text-xs font-semibold text-[#111111]">{plan.modelsCount}</span>
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
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
      <button onClick={onCta} className="mt-6 w-full py-3 rounded-full text-sm font-semibold text-black bg-white border border-[#D1D1D1] hover:border-violet-300 hover:bg-gray-50 transition-colors">
        {plan.cta}
      </button>
    </div>
  );
}

export default function PricingSection() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cycle, setCycle] = useState("mensal");
  const [tab, setTab] = useState("pessoal");
  const personalPlans = buildPersonalPlans(t);
  const businessPlans = buildBusinessPlans(t);

  const handleCta = () => {
    if (!user) {
      navigate("/login");
    } else {
      navigate("/plan-selection");
    }
  };

  return (
    <section id="planos" className="py-20 lg:py-28 bg-[#FAFAFA]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
            <span className="text-xs font-medium tracking-widest text-[#374151] uppercase">
              {t("pricing.badge")}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold tracking-tight leading-[1.1]">
            <span className="text-[#111827]">{t("pricing.title")}</span>
            <br />
            <span className="text-[#8B5CF6]">{t("pricing.titleHighlight")}</span>
          </h2>
          <p className="mt-6 text-base sm:text-lg text-[#6B7280] leading-relaxed">
            {t("pricing.desc")}
          </p>
          <p className="mt-8 text-sm text-[#6B7280]">
            {t("pricing.billedMonthly")}
          </p>
        </div>

        {/* Tabs + Cycle toggle side by side */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 mb-12">
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
              {getFreeTimeLabel(tab === "pessoal" ? "starter" : "team", t)}
            </span>
          </div>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-start">
          {(tab === "pessoal" ? personalPlans : businessPlans).map((plan) => (
            <PlanCard key={plan.name} plan={plan} cycle={cycle} t={t} onCta={handleCta} />
          ))}
        </div>
      </div>
    </section>
  );
}