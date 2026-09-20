import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BarChart3, Search, ChevronLeft } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { useAuth } from "@/lib/AuthContext";
import DashboardSidebar from "@/components/ayzen/DashboardSidebar";
import SettingsNav from "@/components/ayzen/SettingsNav";
import MobileSettingsTabs from "@/components/ayzen/MobileSettingsTabs";
import { MODELS_BY_PLAN, IMAGE_MODELS_BY_PLAN, AUDIO_MODELS_BY_PLAN } from "@/components/ayzen/ModelSelector";
import ModelUsageRow from "@/components/ayzen/ModelUsageRow";
import PlanContent from "@/components/ayzen/settings/PlanContent";
import InvoicesContent from "@/components/ayzen/settings/InvoicesContent";
import SkillsContent from "@/components/ayzen/settings/SkillsContent";
import SkillFormContent from "@/components/ayzen/settings/SkillFormContent";
import ConnectorsContent from "@/components/ayzen/settings/ConnectorsContent";
import AccountContent from "@/components/ayzen/settings/AccountContent";
import MemoriesContent from "@/components/ayzen/settings/MemoriesContent";
import MediaQuotasContent from "@/components/ayzen/settings/MediaQuotasContent";
import { base44 } from "@/api/base44Client";

const PLAN_TOKEN_WINDOWS = {
  free: [
    { labelKey: "settings.daily", value: "4.000", descKey: "settings.dailyDesc" },
    { labelKey: "settings.weekly", value: "30.000", descKey: "settings.weeklyDesc" }
  ],
  starter: [
    { labelKey: "settings.daily", value: "128.000", descKey: "settings.dailyDesc" },
    { labelKey: "settings.weekly", value: "900.000", descKey: "settings.weeklyDesc" }
  ],
  premium: [
    { labelKey: "settings.weekly", value: "500.000", descKey: "settings.weeklyDesc" },
    { labelKey: "settings.monthly", value: "5.000.000", descKey: "settings.monthlyDesc" }
  ],
  team: [
    { labelKey: "settings.daily", value: "1.000.000", descKey: "settings.dailyDesc" },
    { labelKey: "settings.weekly", value: "10.000.000", descKey: "settings.weeklyDesc" }
  ],
  startup: [
    { labelKey: "settings.daily", value: "5.000.000", descKey: "settings.dailyDesc" },
    { labelKey: "settings.weekly", value: "15.000.000", descKey: "settings.weeklyDesc" }
  ],
  enterprise: [
    { labelKey: "settings.daily", value: "10.000.000", descKey: "settings.dailyDesc" },
    { labelKey: "settings.weekly", value: "25.000.000", descKey: "settings.weeklyDesc" }
  ]
};

function UsageContent() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const plan = user?.plan || "free";
  const [query, setQuery] = useState("");
  const [usage, setUsage] = useState({ monthly: 0, daily: 0, weekly: 0 });
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const records = await base44.entities.TokenUsage.list("-created_date", 500);
        const now = Date.now();
        const dayAgo = now - 24 * 60 * 60 * 1000;
        const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
        const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime();
        const monthly = records.filter((r) => new Date(r.created_date).getTime() >= monthStart).reduce((s, r) => s + (r.tokens || 0), 0);
        const daily = records.filter((r) => new Date(r.created_date).getTime() >= dayAgo).reduce((s, r) => s + (r.tokens || 0), 0);
        const weekly = records.filter((r) => new Date(r.created_date).getTime() >= weekAgo).reduce((s, r) => s + (r.tokens || 0), 0);
        setUsage({ monthly, daily, weekly });
        requestAnimationFrame(() => setAnimated(true));
      } catch (e) {}
    })();
  }, []);

  const windows = PLAN_TOKEN_WINDOWS[plan] || PLAN_TOKEN_WINDOWS.free;
  const windowLimits = windows.map((w) => parseInt(w.value.replace(/\./g, ""), 10));
  const windowConsumed = windows.map((w) => {
    if (w.labelKey === "settings.daily") return usage.daily;
    if (w.labelKey === "settings.weekly") return usage.weekly;
    if (w.labelKey === "settings.monthly") return usage.monthly;
    return 0;
  });
  const formatTokens = (n) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const pct = (consumed, limit) => {
    if (limit <= 0) return 0;
    const value = Math.min(100, (consumed / limit) * 100);
    if (value === 0) return 0;
    if (value < 1) return Math.round(value * 100) / 100;
    return Math.round(value);
  };
  const rawPct = (consumed, limit) => (limit > 0 ? Math.min(100, (consumed / limit) * 100) : 0);
  const isPaid = plan && plan !== "free";

  const planModels = [
    ...(MODELS_BY_PLAN[plan] || MODELS_BY_PLAN.free).map((m) => ({
      name: m.name,
      logo: m.logo,
      tags: ["Texto"]
    })),
    ...(IMAGE_MODELS_BY_PLAN[plan] || IMAGE_MODELS_BY_PLAN.free).map((m) => ({
      name: m.name,
      logo: m.logo,
      tags: ["Imagem"]
    })),
    ...(AUDIO_MODELS_BY_PLAN[plan] || []).map((m) => ({
      name: m.name,
      logo: m.logo,
      tags: ["Áudio"]
    }))
  ];

  const filtered = planModels.filter((m) =>
  m.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-10 py-8 space-y-8">
        {/* Header */}
        <div>
          <p className="text-xs text-gray-400">{t("settings.title")}</p>
          <h1 className="text-2xl font-bold text-black mt-0.5">{t("settings.usage")}</h1>
          <p className="text-sm text-gray-500 mt-1">{t("settings.usageSubtitle")}</p>
        </div>

        <div className="border-t border-gray-200" />

        {/* Visão geral */}
        <section>
          <h2 className="text-base font-bold text-black mb-1">{t("settings.overview")}</h2>
          <p className="text-xs text-gray-500 mb-3">{t("settings.overviewSubtitle")}</p>
          <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
            <div className="flex items-center gap-3 p-5">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                <BarChart3 className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-semibold tracking-wider text-gray-400">
                  {t("settings.consumedMonth")}
                </p>
                <p className="text-lg font-bold text-black">{formatTokens(usage.monthly)} {t("settings.tokensLabel")}</p>
                <p className="text-xs text-gray-400">{t("settings.period")}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 border-t border-gray-100">
              <div className="p-4 border-r border-gray-100">
                <p className="text-[10px] font-semibold tracking-wider text-gray-400">
                  {t("settings.activeModels")}
                </p>
                <p className="text-lg font-bold text-black mt-0.5">{planModels.length}</p>
              </div>
              <div className="p-4 border-r border-gray-100">
                <p className="text-[10px] font-semibold tracking-wider text-gray-400">
                  {t(windows[0].labelKey)}
                </p>
                <p className="text-lg font-bold text-black mt-0.5">{pct(windowConsumed[0], windowLimits[0])}%</p>
                <p className="text-[10px] text-gray-400">{t(windows[0].descKey)}</p>
              </div>
              <div className="p-4">
                <p className="text-[10px] font-semibold tracking-wider text-gray-400">
                  {t(windows[1].labelKey)}
                </p>
                <p className="text-lg font-bold text-black mt-0.5">{pct(windowConsumed[1], windowLimits[1])}%</p>
                <p className="text-[10px] text-gray-400">{t(windows[1].descKey)}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Tokens do plano */}
        <section>
          <h2 className="text-base font-bold text-black mb-1">{t("settings.tokensPlan")}</h2>
          <p className="text-xs text-gray-500 mb-3">{t("settings.tokensPlanDesc")}</p>
          <div className="grid grid-cols-2 gap-4">
            {windows.map((win, i) => {
              const limit = windowLimits[i];
              const consumed = windowConsumed[i];
              const percentage = pct(consumed, limit);
              const targetWidth = Math.max(rawPct(consumed, limit), consumed > 0 ? 1.5 : 0);
              const barWidth = animated ? targetWidth : 0;
              return (
                <div key={win.labelKey} className="rounded-2xl border border-gray-200 bg-white p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-semibold tracking-wider text-gray-400">
                      {t(win.labelKey)}
                    </p>
                    <span className="text-[10px] text-gray-400">● {percentage}%</span>
                  </div>
                  <p className="text-lg font-bold text-black mt-1">{formatTokens(consumed)} / {win.value}</p>
                  <div className="mt-3 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full bg-black rounded-full transition-all duration-[1200ms] ease-out"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-gray-500 mt-2">{t(win.descKey)}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Cotas de mídia */}
        <MediaQuotasContent plan={plan} />

        {/* Mensagens por IA */}
        <section>
          <h2 className="text-base font-bold text-black mb-1">{t("settings.messagesByIA")}</h2>
          <p className="text-xs text-gray-500 mb-3">{t("settings.messagesByIADesc")}</p>
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("settings.searchModel")}
              className="w-full h-10 pl-9 pr-3 rounded-xl bg-white border border-gray-200 text-sm placeholder:text-gray-400 focus:outline-none focus:border-gray-300" />
            
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
            {filtered.map((m, i) =>
            <ModelUsageRow key={m.name} model={m} isLast={i === filtered.length - 1} plan={plan} />
            )}
            {filtered.length === 0 &&
            <p className="px-4 py-6 text-sm text-gray-400 text-center">
                {t("settings.noModels")}
              </p>
            }
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {t("settings.showingModels", { shown: filtered.length, total: planModels.length })}
          </p>
        </section>
      </div>
    </div>);

}

export default function Settings() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(location.state?.section || "usage");
  const [skillFormOpen, setSkillFormOpen] = useState(false);

  const renderContent = () => {
    if (activeSection === "skills" && skillFormOpen) {
      return <SkillFormContent onBack={() => setSkillFormOpen(false)} />;
    }
    switch (activeSection) {
      case "plan":
        return <PlanContent />;
      case "account":
        return <AccountContent />;
      case "invoices":
        return <InvoicesContent plan={user?.plan || "free"} />;
      case "memories":
        return <MemoriesContent />;
      case "skills":
        return <SkillsContent plan={user?.plan || "free"} onCreateSkill={() => setSkillFormOpen(true)} />;
      case "connectors":
        return <ConnectorsContent plan={user?.plan || "free"} />;
      default:
        return <UsageContent />;
    }
  };

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:flex h-screen bg-[#F4F4F6] overflow-hidden py-2 pl-2 pr-2 gap-2">
        <DashboardSidebar activePage="settings" />
        <main className="flex-1 flex bg-white rounded-2xl overflow-hidden">
          <SettingsNav active={activeSection} onSelect={setActiveSection} />
          {renderContent()}
        </main>
      </div>

      {/* Mobile */}
      <div className="md:hidden h-screen flex flex-col bg-white overflow-hidden">
        <div className="flex items-center px-4 py-3 border-b border-gray-100">
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 flex items-center justify-center -ml-1 text-gray-700 active:bg-gray-100 rounded-lg">
            
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="ml-0.5 text-base font-bold text-black">{t("settings.title")}</span>
        </div>
        <MobileSettingsTabs active={activeSection} onSelect={setActiveSection} />
        <div className="flex-1 overflow-y-auto">
          {renderContent()}
        </div>
      </div>
    </>);

}