const GEMINI = "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/c545d8735_gemini.svg";
const DEEPSEEK = "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/d6d9b4c6f_deepseek.svg";
const GPT = "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/698f8c822_chatgpt.svg";
const CLAUDE = "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/c0a57947c_claude.svg";
const GROK = "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/ad894e6fd_grok.svg";

export const PLAN_IDS = ["free", "starter", "premium", "team", "startup", "enterprise"];

export const PLAN_PRICES = {
  free: { mensal: "R$ 0,00", anual: "R$ 0,00" },
  starter: { mensal: "R$ 90,00", anual: "R$ 75,00" },
  premium: { mensal: "R$ 149,90", anual: "R$ 124,90" },
  team: { mensal: "R$ 399,90", anual: "R$ 333,25" },
  startup: { mensal: "R$ 599,90", anual: "R$ 499,90" },
  enterprise: { mensal: "R$ 999,90", anual: "R$ 833,25" }
};

export const PLAN_NUMERIC_PRICES = {
  free: { mensal: 0, anual: 0 },
  starter: { mensal: 90.0, anual: 75.0 },
  premium: { mensal: 149.9, anual: 124.9 },
  team: { mensal: 399.9, anual: 333.25 },
  startup: { mensal: 599.9, anual: 499.9 },
  enterprise: { mensal: 999.9, anual: 833.25 }
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
      name: "Zyntra Free",
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
      price: { mensal: "R$ 90,00", anual: "R$ 75,00" },
      period: t("pricing.perMonth"),
      highlightFeature: t("pricing.unlimitedMessages"),
      features: [t("pricing.starterF1"), t("pricing.starterF2"), t("pricing.starterF3"), t("pricing.starterF4")],
      modelsCount: t("pricing.starterModels"),
      models: [{ src: GEMINI, label: "Gemini" }, { src: DEEPSEEK, label: "DeepSeek" }, { src: GPT, label: "GPT" }],
      cta: t("pricing.starterCta"),
      tag: t("pricing.mostPopular"),
    },
    {
      id: "premium",
      name: "Pessoal Premium",
      desc: t("pricing.premiumDesc"),
      price: { mensal: "R$ 149,90", anual: "R$ 124,90" },
      period: t("pricing.perMonth"),
      highlightFeature: t("pricing.unlimitedMessages"),
      features: [t("pricing.premiumF1"), t("pricing.premiumF2"), t("pricing.premiumF3"), t("pricing.premiumF4")],
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
      price: { mensal: "R$ 399,90", anual: "R$ 333,25" },
      period: t("pricing.perMonth"),
      highlightFeature: t("pricing.limitedMessages"),
      features: [t("pricing.teamF1"), t("pricing.teamF2"), t("pricing.teamF3"), t("pricing.teamF4")],
      modelsCount: t("pricing.teamModels"),
      models: [{ src: GEMINI, label: "Gemini" }, { src: DEEPSEEK, label: "DeepSeek" }, { src: GPT, label: "GPT" }, { src: CLAUDE, label: "Claude" }, { src: GROK, label: "Grok" }, { more: 4 }],
      cta: t("pricing.teamCta"),
    },
    {
      id: "startup",
      name: "Empresarial Startup",
      desc: t("pricing.startupDesc"),
      price: { mensal: "R$ 599,90", anual: "R$ 499,90" },
      period: t("pricing.perMonth"),
      highlightFeature: t("pricing.limitedMessages"),
      features: [t("pricing.startupF1"), t("pricing.startupF2"), t("pricing.startupF3"), t("pricing.startupF4"), t("pricing.startupF5")],
      modelsCount: t("pricing.startupModels"),
      models: [{ src: GEMINI, label: "Gemini" }, { src: DEEPSEEK, label: "DeepSeek" }, { src: GPT, label: "GPT" }, { src: CLAUDE, label: "Claude" }, { src: GROK, label: "Grok" }, { more: 4 }],
      cta: t("pricing.startupCta"),
      tag: t("pricing.mostPopular"),
    },
    {
      id: "enterprise",
      name: "Empresarial Enterprise",
      desc: t("pricing.enterpriseDesc"),
      price: { mensal: "R$ 999,90", anual: "R$ 833,25" },
      period: t("pricing.perMonth"),
      highlightFeature: t("pricing.limitedMessages"),
      features: [t("pricing.enterpriseF1"), t("pricing.enterpriseF2"), t("pricing.enterpriseF3"), t("pricing.enterpriseF4"), t("pricing.enterpriseF5"), t("pricing.enterpriseF6")],
      modelsCount: t("pricing.enterpriseModels"),
      models: [{ src: GEMINI, label: "Gemini" }, { src: DEEPSEEK, label: "DeepSeek" }, { src: GPT, label: "GPT" }, { src: CLAUDE, label: "Claude" }, { src: GROK, label: "Grok" }, { more: 9 }],
      cta: t("pricing.enterpriseCta"),
    },
  ];
}