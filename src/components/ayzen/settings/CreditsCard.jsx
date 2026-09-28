import React, { useState, useEffect } from "react";
import { Eye, EyeOff, ArrowUpRight, Plus, FileText, RefreshCw, FileClock, ChevronRight, MessageCircle, Sparkles } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { base44 } from "@/api/base44Client";
import { CREDITS_BY_PLAN } from "@/lib/quotaUtils";
import { CoinStackIcon } from "@/components/ayzen/SettingsIcons";
import { MODELS_BY_PLAN, IMAGE_MODELS, IMAGE_MODELS_BY_PLAN, AUDIO_MODELS, AUDIO_MODELS_BY_PLAN, LOGO } from "@/components/ayzen/ModelSelector";

const MODEL_LOGO_BY_NAME = (() => {
  const map = { "Zyntra Auto": LOGO };
  const arrays = [
    ...Object.values(MODELS_BY_PLAN),
    IMAGE_MODELS,
    ...Object.values(IMAGE_MODELS_BY_PLAN),
    AUDIO_MODELS,
    ...Object.values(AUDIO_MODELS_BY_PLAN)
  ];
  for (const arr of arrays) {
    for (const m of arr || []) {
      if (m && m.name && m.logo) map[m.name] = m.logo;
    }
  }
  return map;
})();

const MONTHS_PT = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

function formatCredits(n) {
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function formatExpiry(dateStr) {
  if (!dateStr) return null;
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return null;
    return `${d.getDate()}/${d.getMonth() + 1}, ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  } catch {
    return null;
  }
}

export default function CreditsCard({ onReload, className = "" }) {
  const { user } = useAuth();
  const plan = user?.plan || "free";
  const credits = CREDITS_BY_PLAN[plan] || CREDITS_BY_PLAN.free;
  const [showBalance, setShowBalance] = useState(true);
  const [usage, setUsage] = useState({ monthly: 0, daily: 0, weekly: 0, lastCredit: null });
  const [movements, setMovements] = useState([]);

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
        const lastCredit = records.find((r) => (r.tokens || 0) > 0);
        setUsage({ monthly, daily, weekly, lastCredit });
        setMovements(records);
      } catch (e) {}
    })();
  }, []);

  const available = Math.max(0, credits.month - usage.monthly);
  const dailyLimit = credits.day;
  const weeklyLimit = Math.round(credits.day * 7);
  const dailyPct = dailyLimit > 0 ? Math.min(100, (usage.daily / dailyLimit) * 100) : 0;
  const weeklyPct = weeklyLimit > 0 ? Math.min(100, (usage.weekly / weeklyLimit) * 100) : 0;

  const planExpires = user?.plan_expires || null;
  const expiryLabel = formatExpiry(planExpires);

  const planRefillDate = (() => {
    const ref = planExpires ? new Date(planExpires) : new Date();
    ref.setMonth(ref.getMonth() - 1);
    if (isNaN(ref.getTime())) return null;
    return `${ref.getDate()} de ${MONTHS_PT[ref.getMonth()]}.., ${String(ref.getHours()).padStart(2, "0")}:${String(ref.getMinutes()).padStart(2, "0")}`;
  })();

  const lastCreditDate = usage.lastCredit
    ? (() => {
        const d = new Date(usage.lastCredit.created_date);
        return `${d.getDate()} de ${MONTHS_PT[d.getMonth()]}. de ${d.getFullYear()}`;
      })()
    : null;
  const lastCreditAmount = usage.lastCredit?.tokens || credits.month;

  return (
    <div className={`rounded-2xl bg-[#7C5DCF] text-white p-5 flex flex-col ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold">Créditos</h3>
        <button className="flex items-center gap-1.5 text-xs text-white border border-white rounded-full px-3.5 py-1.5 hover:bg-white/10 transition-colors">
          <FileClock className="w-3.5 h-3.5" />
          Ver extrato
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Inner container + Last movements side by side */}
      <div className="relative flex gap-4">
      {/* Inner container */}
      <div className="flex-1 rounded-xl bg-white/10 border border-white/40 p-4">
        {/* Balance */}
        <div className="mb-4">
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="text-xs text-white/80">Disponíveis agora</span>
            <button onClick={() => setShowBalance((v) => !v)} className="text-white/70 hover:text-white">
              {showBalance ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            </button>
          </div>
          <div className="flex items-center gap-2.5">
            <CoinStackIcon className="w-7 h-7 text-white/90 shrink-0" />
            <p className="text-4xl font-bold tracking-tight">
              {showBalance ? formatCredits(available) : "•••••"}
            </p>
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <p className="text-[11px] font-semibold tracking-wider text-white/70">Validade</p>
              <p className="text-xs text-white/90">Do plano</p>
            </div>
            <p className="text-xs text-white/90 text-right">
              {expiryLabel ? `${formatCredits(available)} até ${expiryLabel}` : "—"}
            </p>
          </div>
        </div>

        {/* Usage pace */}
        <div className="border-t border-white/20 pt-4">
          <p className="text-sm font-semibold text-white/90 mb-1">Ritmo de uso</p>
          <p className="text-xs text-white/70 mb-4 leading-relaxed">
            Os créditos voltam aos poucos, conforme o consumo antigo sai da janela.
          </p>
          <div className="space-y-4">
            {/* 24h */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-white/80">Últimas 24 horas</span>
                <span className="text-xs font-medium text-white">{formatCredits(usage.daily)} de {formatCredits(dailyLimit)}</span>
              </div>
              <div className="h-2.5 rounded-full bg-white/20 overflow-hidden">
                <div className="h-full bg-white rounded-full transition-all duration-700" style={{ width: `${dailyPct}%` }} />
              </div>
            </div>
            {/* 7d */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-white/80">Últimos 7 dias</span>
                <span className="text-xs font-medium text-white">{formatCredits(usage.weekly)} de {formatCredits(weeklyLimit)}</span>
              </div>
              <div className="h-2.5 rounded-full bg-white/20 overflow-hidden">
                <div className="h-full bg-white rounded-full transition-all duration-700" style={{ width: `${weeklyPct}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer reserves width for the absolute last-movements column */}
      <div className="w-[38%]" />
      {/* Last movements - absolute, fills the inner container's height */}
      <div className="w-[38%] absolute top-0 right-0 bottom-0 flex flex-col overflow-hidden">
        <p className="text-[11px] font-semibold tracking-wider text-white/70 mb-2.5 pt-4">ÚLTIMAS MOVIMENTAÇÕES</p>
        <div className="flex-1 overflow-y-auto scrollbar-hide min-h-0 space-y-3 pr-1">
          {/* Plan credit refill (positive) */}
          <div className="flex items-start gap-2.5">
            <RefreshCw className="w-4 h-4 text-white/70 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white/90">Créditos do plano</p>
              <p className="text-[11px] text-white/70">{planRefillDate || "—"}</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <CoinStackIcon className="w-3.5 h-3.5 text-white/70" />
              <p className="text-xs font-semibold text-white">+{formatCredits(credits.month)}</p>
            </div>
          </div>
          {/* Command consumptions (negative) */}
          {movements.map((m) => {
            const d = new Date(m.created_date);
            const ts = `${d.getDate()} de ${MONTHS_PT[d.getMonth()]}., ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
            const title = m.prompt ? (m.prompt.length > 28 ? m.prompt.slice(0, 28) + "…" : m.prompt) : "Comando";
            return (
              <div key={m.id} className="flex items-start gap-2.5">
                <MessageCircle className="w-4 h-4 text-white/70 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-white/90 truncate">{title}</p>
                  <p className="text-[11px] text-white/70 flex items-center gap-1 truncate">
                    {ts}
                    {m.model && (() => { const logo = MODEL_LOGO_BY_NAME[m.model]; return (<>{logo ? <img src={logo} alt={m.model} className="w-3 h-3 rounded object-contain shrink-0" /> : <Sparkles className="w-3 h-3 shrink-0" />}<span className="truncate">{m.model}</span></>); })()}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <CoinStackIcon className="w-3.5 h-3.5 text-white/70" />
                  <p className="text-xs font-semibold text-white">-{formatCredits(m.tokens || 0)}</p>
                </div>
              </div>
            );
          })}
        </div>
        <button className="mt-3 flex items-center gap-1 text-xs text-white/80 hover:text-white transition-colors self-start">
          Ver extrato completo <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
      </div>

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-white">Precisa de mais créditos?</p>
          <p className="text-[11px] text-white/70">Créditos avulsos valem 12 meses.</p>
        </div>
        <button
          onClick={onReload}
          className="flex items-center justify-center gap-1.5 px-5 py-2 rounded-xl bg-white text-[#7C5DCF] text-sm font-semibold hover:bg-white/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Recarregar
        </button>
      </div>
    </div>
  );
}