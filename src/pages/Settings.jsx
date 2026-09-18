import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { BarChart3, Search, Menu } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { useAuth } from "@/lib/AuthContext";
import DashboardSidebar from "@/components/ayzen/DashboardSidebar";
import SettingsNav from "@/components/ayzen/SettingsNav";
import MobileSidebar from "@/components/ayzen/MobileSidebar";
import { MODELS_BY_PLAN } from "@/components/ayzen/ModelSelector";
import ModelUsageRow from "@/components/ayzen/ModelUsageRow";
import PlanContent from "@/components/ayzen/settings/PlanContent";
import InvoicesContent from "@/components/ayzen/settings/InvoicesContent";
import SkillsContent from "@/components/ayzen/settings/SkillsContent";
import ConnectorsContent from "@/components/ayzen/settings/ConnectorsContent";
import AccountContent from "@/components/ayzen/settings/AccountContent";
import MemoriesContent from "@/components/ayzen/settings/MemoriesContent";

function UsageContent() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const plan = user?.plan || "free";
  const [query, setQuery] = useState("");

  const planModels = (MODELS_BY_PLAN[plan] || MODELS_BY_PLAN.free).map((m) => ({
    name: m.name,
    logo: m.logo,
    tags: ["Texto"],
  }));

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
                <p className="text-lg font-bold text-black">{t("settings.tokens")}</p>
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
                  {t("settings.daily")}
                </p>
                <p className="text-lg font-bold text-black mt-0.5">0%</p>
                <p className="text-[10px] text-gray-400">{t("settings.dailyDesc")}</p>
              </div>
              <div className="p-4">
                <p className="text-[10px] font-semibold tracking-wider text-gray-400">
                  {t("settings.weekly")}
                </p>
                <p className="text-lg font-bold text-black mt-0.5">0%</p>
                <p className="text-[10px] text-gray-400">{t("settings.weeklyDesc")}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Tokens do plano */}
        <section>
          <h2 className="text-base font-bold text-black mb-1">{t("settings.tokensPlan")}</h2>
          <p className="text-xs text-gray-500 mb-3">{t("settings.tokensPlanDesc")}</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <p className="text-[10px] font-semibold tracking-wider text-gray-400">
                {t("settings.daily")}
              </p>
              <p className="text-lg font-bold text-black mt-1">0 / 8.000</p>
              <div className="mt-3 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full w-0 bg-black rounded-full" />
              </div>
              <p className="text-[10px] text-gray-400 mt-2">● 0%</p>
              <p className="text-[11px] text-gray-500 mt-2">{t("settings.dailyDesc")}</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <p className="text-[10px] font-semibold tracking-wider text-gray-400">
                {t("settings.weekly")}
              </p>
              <p className="text-lg font-bold text-black mt-1">0 / 30.000</p>
              <div className="mt-3 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full w-0 bg-black rounded-full" />
              </div>
              <p className="text-[10px] text-gray-400 mt-2">● 0%</p>
              <p className="text-[11px] text-gray-500 mt-2">{t("settings.weeklyDesc")}</p>
            </div>
          </div>
        </section>

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
              className="w-full h-10 pl-9 pr-3 rounded-xl bg-white border border-gray-200 text-sm placeholder:text-gray-400 focus:outline-none focus:border-gray-300"
            />
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
            {filtered.map((m, i) => (
              <ModelUsageRow key={m.name} model={m} isLast={i === filtered.length - 1} />
            ))}
            {filtered.length === 0 && (
              <p className="px-4 py-6 text-sm text-gray-400 text-center">
                {t("settings.noModels")}
              </p>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {t("settings.showingModels", { shown: filtered.length, total: planModels.length })}
          </p>
        </section>
      </div>
    </div>
  );
}

export default function Settings() {
  const { t } = useLanguage();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(location.state?.section || "usage");

  const renderContent = () => {
    switch (activeSection) {
      case "plan":
        return <PlanContent />;
      case "account":
        return <AccountContent />;
      case "invoices":
        return <InvoicesContent />;
      case "memories":
        return <MemoriesContent />;
      case "skills":
        return <SkillsContent />;
      case "connectors":
        return <ConnectorsContent />;
      default:
        return <UsageContent />;
    }
  };

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:flex h-screen bg-[#F4F4F6] overflow-hidden py-2 pr-2 gap-2">
        <DashboardSidebar activePage="settings" />
        <main className="flex-1 flex bg-white rounded-2xl overflow-hidden">
          <SettingsNav active={activeSection} onSelect={setActiveSection} />
          {renderContent()}
        </main>
      </div>

      {/* Mobile */}
      <div className="md:hidden h-screen flex flex-col bg-white overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-700 active:bg-gray-100"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-sm font-semibold text-black">{t("settings.title")}</span>
          <div className="w-9" />
        </div>
        <div className="flex flex-1 overflow-hidden">
          <SettingsNav active={activeSection} onSelect={setActiveSection} />
          {renderContent()}
        </div>
        <MobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>
    </>
  );
}