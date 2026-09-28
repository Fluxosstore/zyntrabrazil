import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BarChart3, Search, ChevronLeft, Crown, Shield, Key, Receipt, Plus, Wallet, ShieldCheck, Brain, Wand2, Plug, Coins } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { useAuth } from "@/lib/AuthContext";
import DashboardSidebar from "@/components/ayzen/DashboardSidebar";
import SettingsNav from "@/components/ayzen/SettingsNav";
import MobileSettingsTabs from "@/components/ayzen/MobileSettingsTabs";
import { MODELS_BY_PLAN, IMAGE_MODELS_BY_PLAN, AUDIO_MODELS_BY_PLAN, PLAN_LABELS } from "@/components/ayzen/ModelSelector";
import ModelUsageRow from "@/components/ayzen/ModelUsageRow";
import PlanContent from "@/components/ayzen/settings/PlanContent";
import InvoicesContent from "@/components/ayzen/settings/InvoicesContent";
import SkillsContent from "@/components/ayzen/settings/SkillsContent";
import SkillFormContent from "@/components/ayzen/settings/SkillFormContent";
import ConnectorsContent from "@/components/ayzen/settings/ConnectorsContent";
import AccountContent from "@/components/ayzen/settings/AccountContent";
import MemoriesContent from "@/components/ayzen/settings/MemoriesContent";
import MediaQuotasContent from "@/components/ayzen/settings/MediaQuotasContent";
import CreditsCard from "@/components/ayzen/settings/CreditsCard";
import { Image } from "@/components/ui/image";
import { getAvatarForUser } from "@/lib/avatars";
import { CREDITS_BY_PLAN } from "@/lib/quotaUtils";
import { PLAN_PRICES } from "@/lib/planData";
import { base44 } from "@/api/base44Client";

const PLAN_CREDIT_WINDOWS = {
  free: [
    { labelKey: "settings.daily", value: "1.000", descKey: "settings.dailyDesc" },
    { labelKey: "settings.monthly", value: "10.000", descKey: "settings.monthlyDesc" }
  ],
  starter: [
    { labelKey: "settings.daily", value: "17.810", descKey: "settings.dailyDesc" },
    { labelKey: "settings.monthly", value: "178.100", descKey: "settings.monthlyDesc" }
  ],
  premium: [
    { labelKey: "settings.daily", value: "48.130", descKey: "settings.dailyDesc" },
    { labelKey: "settings.monthly", value: "481.300", descKey: "settings.monthlyDesc" }
  ],
  team: [
    { labelKey: "settings.daily", value: "90.580", descKey: "settings.dailyDesc" },
    { labelKey: "settings.monthly", value: "905.800", descKey: "settings.monthlyDesc" }
  ],
  startup: [
    { labelKey: "settings.daily", value: "150.000", descKey: "settings.dailyDesc" },
    { labelKey: "settings.monthly", value: "1.500.000", descKey: "settings.monthlyDesc" }
  ],
  enterprise: [
    { labelKey: "settings.daily", value: "300.000", descKey: "settings.dailyDesc" },
    { labelKey: "settings.monthly", value: "3.000.000", descKey: "settings.monthlyDesc" }
  ]
};

const MONTHS_PT = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

function formatMemberDate(dateStr, lang) {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "—";
    return `${d.getDate()} de ${MONTHS_PT[d.getMonth()]} de ${d.getFullYear()}`;
  } catch {
    return "—";
  }
}

function UsageContent({ onNavigate }) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
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

  const windows = PLAN_CREDIT_WINDOWS[plan] || PLAN_CREDIT_WINDOWS.free;
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


        {/* Profile header */}
        <section>
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14 shrink-0 rounded-full overflow-hidden">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#7E57C2] to-[#EC4899] opacity-30 blur-[3px]" />
                <Image
                  src={getAvatarForUser(user?.id)}
                  alt="Profile"
                  className="relative w-14 h-14 object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-bold text-black">
                  {user?.full_name || (user?.email || "—").split("@")[0]}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {user?.email || "—"} • Membro desde {formatMemberDate(user?.created_date)}
                </p>
              </div>
              <div className="flex items-center gap-5">
                {[
                  { icon: Shield, label: "2FA", onClick: () => {} },
                  { icon: Key, label: "Passkey", onClick: () => {} },
                  { icon: Plus, label: "Recarregar", onClick: () => navigate("/plan-selection"), primary: true },
                  { icon: Receipt, label: "Faturas", onClick: () => onNavigate?.("invoices"), active: true },
                ].map((btn) => (
                  <button
                    key={btn.label}
                    onClick={btn.onClick}
                    className="flex flex-col items-center gap-1.5 group"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      btn.primary
                        ? "bg-[#7a5bc8] text-white hover:bg-[#6b4bb8]"
                        : btn.active
                        ? "bg-gray-100 text-gray-700"
                        : "bg-gray-50 text-gray-600 group-hover:bg-gray-100"
                    }`}>
                      <btn.icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-medium text-gray-500">{btn.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Plan + Credits two-column */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Plan card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#f4f4f4] flex items-center justify-center shrink-0">
                  <Crown className="w-5 h-5 text-black" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold tracking-wider text-gray-400">SEU PLANO</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-lg font-bold text-black">{PLAN_LABELS[plan] || PLAN_LABELS.free}</p>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-[#2e7d32] text-[10px] font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2e7d32]" />
                      Ativo
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-black">{PLAN_PRICES[plan]?.mensal || "R$ 0,00"}</p>
                <p className="text-[10px] text-gray-400">por mês</p>
              </div>
            </div>
            <div className="space-y-2.5 text-sm border-t border-gray-100 pt-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Próximo vencimento</span>
                <span className="font-medium text-black">{formatMemberDate(user?.plan_expires) || "—"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Renovação</span>
                <span className="font-medium text-black">{user?.auto_renew !== false ? "Automática" : "Manual"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">IAs no plano</span>
                <span className="font-medium text-black">{(MODELS_BY_PLAN[plan] || MODELS_BY_PLAN.free).length} modelos</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Créditos/mês</span>
                <span className="font-medium text-black">{(CREDITS_BY_PLAN[plan]?.month || 0).toLocaleString("pt-BR")}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-gray-100 text-[11px] font-medium text-gray-600">
                Automações
              </span>
              <button
                onClick={() => navigate("/plan-selection")}
                className="flex-1 py-2.5 rounded-xl border border-gray-300 bg-white text-sm font-medium text-black hover:bg-gray-50 transition-colors"
              >
                Trocar de plano
              </button>
            </div>
          </div>

          {/* Credits card (purple) */}
          <CreditsCard onReload={() => navigate("/plan-selection")} />
        </section>

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

const SETTINGS_TABS = [
  { id: "usage", label: "Perfil", icon: Wallet },
  { id: "invoices", label: "Pagamentos", icon: Receipt },
  { id: "account", label: "Segurança", icon: ShieldCheck },
  { id: "memories", label: "Memórias", icon: Brain },
  { id: "skills", label: "Habilidades", icon: Wand2 },
  { id: "connectors", label: "Conectores", icon: Plug },
];

export default function Settings() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(location.state?.section || "usage");
  const [skillFormOpen, setSkillFormOpen] = useState(false);
  const [editSkill, setEditSkill] = useState(null);
  const plan = user?.plan || "free";
  const creditsLimit = CREDITS_BY_PLAN[plan]?.month || 0;

  const renderContent = () => {
    if (activeSection === "skills" && skillFormOpen) {
      return <SkillFormContent
        onBack={() => { setSkillFormOpen(false); setEditSkill(null); }}
        editSkill={editSkill}
        onSaved={() => { setSkillFormOpen(false); setEditSkill(null); }}
      />;
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
        return <SkillsContent
          plan={user?.plan || "free"}
          onCreateSkill={() => { setEditSkill(null); setSkillFormOpen(true); }}
          onEditSkill={(skill) => { setEditSkill(skill); setSkillFormOpen(true); }}
        />;
      case "connectors":
        return <ConnectorsContent plan={user?.plan || "free"} />;
      default:
        return <UsageContent onNavigate={setActiveSection} />;
    }
  };

  return (
    <>
      {/* Desktop - with sidebar */}
      <div className="hidden md:flex h-screen bg-[#F4F4F6] overflow-hidden py-2 pl-2 pr-2 gap-2">
        <DashboardSidebar activePage="settings" />
        <main className="flex-1 flex flex-col bg-[#FAFAFB] rounded-2xl overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between px-8 py-4 border-b border-gray-200/60">
          <div className="flex items-center gap-4">
            <h1 className="text-sm font-bold text-black shrink-0">{t("settings.title")}</h1>
            <nav className="flex items-center gap-1 p-1 rounded-full bg-gray-100/80">
              {SETTINGS_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveSection(tab.id); setSkillFormOpen(false); }}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                    activeSection === tab.id
                      ? "bg-white text-black shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100">
              <Coins className="w-3.5 h-3.5 text-gray-500" />
              <span className="text-xs font-semibold text-black">{creditsLimit.toLocaleString("pt-BR")}</span>
            </div>
            <button
              onClick={() => navigate("/plan-selection")}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#7a52d5] text-white text-xs font-medium hover:bg-[#6b4bd0] transition-colors"
            >
              Recarregar
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {renderContent()}
        </div>
        </main>
      </div>

      {/* Mobile */}
      <div className="md:hidden h-screen flex flex-col bg-[#F4F4F6] overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="w-8 h-8 flex items-center justify-center -ml-1 text-gray-700 active:bg-gray-100 rounded-lg">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-base font-bold text-black">{t("settings.title")}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-gray-200">
              <span className="text-[11px] font-semibold text-black">{creditsLimit.toLocaleString("pt-BR")}</span>
            </div>
            <button
              onClick={() => navigate("/plan-selection")}
              className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#7a5bc8] text-white text-[11px] font-medium"
            >
              <Plus className="w-3 h-3" />
              Recarregar
            </button>
          </div>
        </div>
        <MobileSettingsTabs active={activeSection} onSelect={setActiveSection} />
        <div className="flex-1 overflow-y-auto">
          {renderContent()}
        </div>
      </div>
    </>);

}