import React, { useState, useEffect } from "react";
import { Eye, EyeOff, ArrowUpRight, Plus } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { base44 } from "@/api/base44Client";
import { CREDITS_BY_PLAN } from "@/lib/quotaUtils";

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

  const lastCreditDate = usage.lastCredit
    ? (() => {
        const d = new Date(usage.lastCredit.created_date);
        return `${d.getDate()} de ${MONTHS_PT[d.getMonth()]}. de ${d.getFullYear()}`;
      })()
    : null;
  const lastCreditAmount = usage.lastCredit?.tokens || credits.month;

  return (
    <div className={`rounded-2xl bg-[#7a5bc8] text-white p-5 flex flex-col ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-bold">Créditos</h3>
        <button className="flex items-center gap-1 text-[11px] text-white/80 hover:text-white transition-colors">
          Ver extrato <ArrowUpRight className="w-3 h-3" />
        </button>
      </div>

      {/* Balance + Movements */}
      <div className="flex gap-6 mb-5">
        {/* Left: Available now */}
        <div className="flex-1">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[11px] text-white/70">Disponíveis agora</span>
            <button onClick={() => setShowBalance((v) => !v)} className="text-white/70 hover:text-white">
              {showBalance ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            </button>
          </div>
          <p className="text-3xl font-bold tracking-tight">
            {showBalance ? formatCredits(available) : "•••••"}
          </p>
          <div className="mt-3 space-y-0.5">
            <p className="text-[10px] font-semibold tracking-wider text-white/60">VALIDADE</p>
            <p className="text-[11px] text-white/90">Do plano{expiryLabel ? `, ${formatCredits(available)} até ${expiryLabel}` : ""}</p>
          </div>
        </div>

        {/* Right: Last movements */}
        <div className="flex-1">
          <p className="text-[10px] font-semibold tracking-wider text-white/60 mb-2">ÚLTIMAS MOVIMENTAÇÕES</p>
          <div className="space-y-2">
            <div>
              <p className="text-[11px] text-white/90">Créditos do plano</p>
              <div className="flex items-center justify-between">
                <p className="text-[10px] text-white/60">{lastCreditDate || "—"}</p>
                <p className="text-[11px] font-semibold text-white">+{formatCredits(lastCreditAmount)}</p>
              </div>
            </div>
          </div>
          <button className="mt-2 flex items-center gap-1 text-[11px] text-white/80 hover:text-white transition-colors">
            Ver extrato completo <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Usage pace */}
      <div className="border-t border-white/15 pt-4 mb-4">
        <p className="text-[11px] font-semibold text-white/90 mb-1">Ritmo de uso</p>
        <p className="text-[10px] text-white/60 mb-3 leading-relaxed">
          Os créditos voltam aos poucos, conforme o consumo antigo sai da janela.
        </p>
        <div className="space-y-3">
          {/* 24h */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-white/80">Últimas 24 horas</span>
              <span className="text-[11px] font-medium text-white">{formatCredits(usage.daily)} de {formatCredits(dailyLimit)}</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/20 overflow-hidden">
              <div className="h-full bg-white rounded-full transition-all duration-700" style={{ width: `${dailyPct}%` }} />
            </div>
          </div>
          {/* 7d */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-white/80">Últimas 7 dias</span>
              <span className="text-[11px] font-medium text-white">{formatCredits(usage.weekly)} de {formatCredits(weeklyLimit)}</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/20 overflow-hidden">
              <div className="h-full bg-white rounded-full transition-all duration-700" style={{ width: `${weeklyPct}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/15 pt-4 mt-auto">
        <p className="text-[11px] font-semibold text-white/90 mb-0.5">Precisa de mais créditos?</p>
        <p className="text-[10px] text-white/60 mb-3">Créditos avulsos valem 12 meses.</p>
        <button
          onClick={onReload}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white text-[#7a5bc8] text-sm font-semibold hover:bg-white/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Recarregar
        </button>
      </div>
    </div>
  );
}