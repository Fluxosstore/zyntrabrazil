const GEMINI = "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/c545d8735_gemini.svg";
const DEEPSEEK = "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/d6d9b4c6f_deepseek.svg";
const GPT = "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/698f8c822_chatgpt.svg";
const CLAUDE = "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/c0a57947c_claude.svg";
const GROK = "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/ad894e6fd_grok.svg";

export const PLAN_IDS = ["free", "starter", "premium", "team", "startup", "enterprise"];

export const PLAN_PRICES = {
  free: { mensal: "R$ 0,00", anual: "R$ 0,00" },
  starter: { mensal: "R$ 49,90", anual: "R$ 41,58" },
  premium: { mensal: "R$ 99,90", anual: "R$ 83,25" },
  team: { mensal: "R$ 149,90", anual: "R$ 124,92" },
  startup: { mensal: "R$ 199,90", anual: "R$ 166,58" },
  enterprise: { mensal: "R$ 249,90", anual: "R$ 208,25" }
};

export const PLAN_NUMERIC_PRICES = {
  free: { mensal: 0, anual: 0 },
  starter: { mensal: 49.9, anual: 41.58 },
  premium: { mensal: 99.9, anual: 83.25 },
  team: { mensal: 149.9, anual: 124.92 },
  startup: { mensal: 199.9, anual: 166.58 },
  enterprise: { mensal: 249.9, anual: 208.25 }
};

export function formatBRL(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value || 0);
}

export function getFreeTimeLabel(planId, t) {
  const prices = PLAN_NUMERIC_PRICES[planId];
  if (!prices || prices.mensal <= 0) return "";
  const monthlyYearTotal = prices.mensal * 12;
  const annualTotal = prices.anual * 12;
  const discount = monthlyYearTotal - annualTotal;
  if (discount <= 0) return "";
  const freeMonths = discount / prices.mensal;
  const wholeMonths = Math.floor(freeMonths);
  if (wholeMonths >= 2) return t("pricing.monthsFree", { n: wholeMonths });
  if (wholeMonths === 1) return t("pricing.oneMonthFree");
  const days = Math.max(1, Math.round(freeMonths * 30));
  return t("pricing.daysFree", { n: days });
}

export function buildPersonalPlans(t) {
  return [
    {
      id: "free",
      name: "Free",
      desc: t("pricing.freeDesc"),
      price: { mensal: "R$ 0,00", anual: "R$ 0,00" },
      period: null,
      highlightFeature: t("pricing.unlimitedMessages"),
      features: [t("pricing.freeF1"), t("pricing.freeF2"), t("pricing.freeF3")],
      modelsCount: t("pricing.freeModels"),
      models: [{ src: DEEPSEEK, label: "DeepSeek" }],
      cta: t("pricing.freeCta"),
    },
    {
      id: "starter",
      name: "Starter",
      desc: t("pricing.starterDesc"),
      price: { mensal: "R$ 49,90", anual: "R$ 41,58" },
      period: t("pricing.perMonth"),
      highlightFeature: t("pricing.unlimitedMessages"),
      features: [t("pricing.starterF1"), t("pricing.starterF2"), t("pricing.starterF3"), t("pricing.starterF4"), t("pricing.featureImageGen"), t("pricing.featureAudioGen"), t("pricing.featureVideoGen")],
      modelsCount: t("pricing.starterModels"),
      models: [{ src: GEMINI, label: "Gemini" }, { src: DEEPSEEK, label: "DeepSeek" }, { src: GPT, label: "GPT" }],
      cta: t("pricing.starterCta"),
      tag: t("pricing.mostPopular"),
    },
    {
      id: "premium",
      name: "Pro",
      desc: t("pricing.premiumDesc"),
      price: { mensal: "R$ 99,90", anual: "R$ 83,25" },
      period: t("pricing.perMonth"),
      highlightFeature: t("pricing.unlimitedMessages"),
      features: [t("pricing.premiumF1"), t("pricing.premiumF2"), t("pricing.premiumF3"), t("pricing.premiumF4"), t("pricing.featureImageGen"), t("pricing.featureAudioGen"), t("pricing.featureVideoGen")],
      modelsCount: t("pricing.premiumModels"),
      models: [{ src: GEMINI, label: "Gemini" }, { src: DEEPSEEK, label: "DeepSeek" }, { src: CLAUDE, label: "Claude" }, { src: GROK, label: "Grok" }, { src: GPT, label: "GPT-5" }],
      cta: t("pricing.premiumCta"),
    },
  ];
}

export function buildBusinessPlans(t) {
  return [
    {
      id: "team",
      name: "Empresarial Team",
      desc: t("pricing.teamDesc"),
      price: { mensal: "R$ 149,90", anual: "R$ 124,92" },
      period: t("pricing.perMonth"),
      highlightFeature: t("pricing.limitedMessages"),
      features: [t("pricing.teamF1"), t("pricing.teamF2"), t("pricing.teamF3"), t("pricing.teamF4"), t("pricing.featureImageGen"), t("pricing.featureAudioGen"), t("pricing.featureVideoGen")],
      modelsCount: t("pricing.teamModels"),
      models: [{ src: GEMINI, label: "Gemini" }, { src: DEEPSEEK, label: "DeepSeek" }, { src: GPT, label: "GPT" }, { src: CLAUDE, label: "Claude" }, { src: GROK, label: "Grok" }, { more: 4 }],
      cta: t("pricing.teamCta"),
    },
    {
      id: "startup",
      name: "Empresarial Startup",
      desc: t("pricing.startupDesc"),
      price: { mensal: "R$ 199,90", anual: "R$ 166,58" },
      period: t("pricing.perMonth"),
      highlightFeature: t("pricing.limitedMessages"),
      features: [t("pricing.startupF1"), t("pricing.startupF2"), t("pricing.startupF3"), t("pricing.startupF4"), t("pricing.startupF5"), t("pricing.featureImageGen"), t("pricing.featureAudioGen"), t("pricing.featureVideoGen")],
      modelsCount: t("pricing.startupModels"),
      models: [{ src: GEMINI, label: "Gemini" }, { src: DEEPSEEK, label: "DeepSeek" }, { src: GPT, label: "GPT" }, { src: CLAUDE, label: "Claude" }, { src: GROK, label: "Grok" }, { more: 4 }],
      cta: t("pricing.startupCta"),
      tag: t("pricing.mostPopular"),
    },
    {
      id: "enterprise",
      name: "Empresarial Enterprise",
      desc: t("pricing.enterpriseDesc"),
      price: { mensal: "R$ 249,90", anual: "R$ 208,25" },
      period: t("pricing.perMonth"),
      highlightFeature: t("pricing.limitedMessages"),
      features: [t("pricing.enterpriseF1"), t("pricing.enterpriseF2"), t("pricing.enterpriseF3"), t("pricing.enterpriseF4"), t("pricing.enterpriseF5"), t("pricing.featureImageGen"), t("pricing.featureAudioGen"), t("pricing.featureVideoGen"), t("pricing.enterpriseF6")],
      modelsCount: t("pricing.enterpriseModels"),
      models: [{ src: GEMINI, label: "Gemini" }, { src: DEEPSEEK, label: "DeepSeek" }, { src: GPT, label: "GPT" }, { src: CLAUDE, label: "Claude" }, { src: GROK, label: "Grok" }, { more: 9 }],
      cta: t("pricing.enterpriseCta"),
    },
  ];
}