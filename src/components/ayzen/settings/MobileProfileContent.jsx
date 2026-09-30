import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Fingerprint, Eye, EyeOff, ChevronRight, ChevronDown, MessageCircle, RefreshCw, ArrowUpRight, Sparkles, Volume2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/AuthContext";
import { Image } from "@/components/ui/image";
import { getAvatarForUser } from "@/lib/avatars";
import { CoinStackIcon, ReceiptLinesIcon } from "@/components/ayzen/SettingsIcons";
import { MODELS_BY_PLAN, IMAGE_MODELS_BY_PLAN, AUDIO_MODELS_BY_PLAN, PLAN_LABELS, LOGO } from "@/components/ayzen/ModelSelector";
import { CREDITS_BY_PLAN } from "@/lib/quotaUtils";
import { PLAN_PRICES } from "@/lib/planData";
import { base44 } from "@/api/base44Client";

const MONTHS_PT = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

function formatMemberDate(dateStr) {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "—";
    return `${d.getDate()} de ${MONTHS_PT[d.getMonth()]}. de ${d.getFullYear()}`;
  } catch {
    return "—";
  }
}

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

const POLICY_SECTIONS = [
  {
    heading: "Como funciona a franquia",
    body: "Ela vem do próprio plano — não dos seus créditos. Cada IA de uso justo tem uma franquia que renova junto com os créditos, no mesmo ciclo. Enquanto houver franquia, a IA responde normalmente; quando acaba, ela pausa até a renovação."
  },
  {
    heading: "O custo de cada mensagem varia",
    body: "Conversas longas custam mais do que conversas curtas. O consumo da franquia depende do tamanho da conversa e da complexidade da resposta, então duas mensagens podem consumir quantidades diferentes."
  },
  {
    heading: "Avisamos antes",
    body: "Quando você chega a 80% da franquia, avisamos para você se organizar. O aviso aparece na tela e, se quiser, você pode trocar de plano ou esperar a renovação."
  },
  {
    heading: "Quando a franquia acaba",
    body: "As IAs de uso justo pausam até a data mostrada na tela. As outras IAs continuam normais, gastando os seus créditos normalmente — só as de uso justo ficam de folga até a franquia voltar."
  },
  {
    heading: "Automação e compartilhamento de acesso",
    body: "Continuamos acompanhando padrões de uso para garantir que a franquia seja usada de forma justa por todos. Uso automatizado em massa ou compartilhamento de acesso pode acelerar o consumo da franquia."
  },
  {
    heading: "O que nunca acontece",
    body: "Nada é cobrado a mais além do seu plano. A franquia é um benefício incluso: se acabar, a IA só pausa — você não paga extra e não perde créditos."
  },
  {
    heading: "Se precisar de mais",
    body: "Um plano maior tem uma franquia maior. Se a franquia do seu plano acabar rápido com frequência, vale considerar a mudança para um plano superior, que oferece mais margem de uso justo."
  }
];

const MODEL_LOGO_BY_NAME = (() => {
  const map = { "Zyntra Auto": LOGO };
  const arrays = [
    ...Object.values(MODELS_BY_PLAN),
    ...Object.values(IMAGE_MODELS_BY_PLAN),
    ...Object.values(AUDIO_MODELS_BY_PLAN),
  ];
  for (const arr of arrays) {
    for (const m of arr || []) {
      if (m && m.name && m.logo) map[m.name] = m.logo;
    }
  }
  return map;
})();

export default function MobileProfileContent({ onNavigate }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const plan = user?.plan || "free";
  const credits = CREDITS_BY_PLAN[plan] || CREDITS_BY_PLAN.free;
  const [showBalance, setShowBalance] = useState(true);
  const [usage, setUsage] = useState({ monthly: 0, daily: 0, weekly: 0 });
  const [movements, setMovements] = useState([]);
  const [policyOpen, setPolicyOpen] = useState(false);

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
        setMovements(records);
      } catch (e) {}
    })();
  }, []);

  const purchased = user?.balance || 0;
  const available = Math.max(0, credits.month - usage.monthly) + purchased;
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
    return `${ref.getDate()} de ${MONTHS_PT[ref.getMonth()]}., ${String(ref.getHours()).padStart(2, "0")}:${String(ref.getMinutes()).padStart(2, "0")}`;
  })();

  const imageModels = IMAGE_MODELS_BY_PLAN[plan] || IMAGE_MODELS_BY_PLAN.free;
  const audioModels = AUDIO_MODELS_BY_PLAN[plan] || [];
  const mediaItems = [
    ...imageModels.map((m) => ({ id: `image-${m.id}`, name: m.name, logo: m.logo })),
    ...audioModels.map((m) => ({ id: `audio-${m.id}`, name: m.name, logo: m.logo })),
  ];

  const usageWindows = [
    { label: "Últimas 24 horas", consumed: usage.daily, limit: dailyLimit },
    { label: "Últimos 7 dias", consumed: usage.weekly, limit: weeklyLimit },
    { label: "Neste ciclo", consumed: usage.monthly, limit: credits.month },
  ];

  return (
    <div className="px-4 py-4 space-y-4 pb-8">
      {/* Profile card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative w-14 h-14 shrink-0 rounded-full overflow-hidden">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#7E57C2] to-[#EC4899] opacity-30 blur-[3px]" />
            <Image
              src={getAvatarForUser(user?.id)}
              alt="Profile"
              className="relative w-14 h-14 object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-bold text-black">
              {user?.full_name || (user?.email || "—").split("@")[0]}
            </p>
            <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1.5">
              <span className="truncate">{user?.email || "—"}</span>
              <span className="text-gray-300 shrink-0">•</span>
              <span className="shrink-0">Membro desde {formatMemberDate(user?.created_date)}</span>
            </p>
          </div>
        </div>
        {/* Icon grid - recessed sub-container */}
        <div className="rounded-xl bg-[#F5F5F5] p-3">
          <div className="grid grid-cols-4 gap-2">
            {[
              { icon: ShieldCheck, label: "2FA", onClick: () => {}, red: true },
              { icon: Fingerprint, label: "Passkey", onClick: () => {}, red: true },
              { icon: CoinStackIcon, label: "Recarregar", onClick: () => navigate("/recharge-credits") },
              { icon: ReceiptLinesIcon, label: "Faturas", onClick: () => onNavigate?.("invoices") },
            ].map((btn) => (
              <button key={btn.label} onClick={btn.onClick} className="flex flex-col items-center gap-1.5">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                  <btn.icon className={`w-5 h-5 ${btn.red ? "text-[#D32F2F]" : "text-[#333333]"}`} />
                </div>
                <span className="text-[10px] font-medium text-gray-500">{btn.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Seu plano */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4">
        <h2 className="text-base font-bold text-black mb-3">Seu plano</h2>
        {/* Plan card */}
        <div className="relative rounded-2xl bg-gradient-to-br from-[#f4f4f4] to-[#e9e9e9] p-4 overflow-hidden flex flex-col justify-between min-h-[210px]">
          {/* Decorative blob */}
          <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br from-[#7C5DCF]/15 to-[#EC4899]/10 blur-2xl pointer-events-none" />
          <div className="relative flex items-start justify-between">
            <p className="text-sm font-bold text-[#1a1a1a]">Zyntra</p>
            <span className="inline-flex items-center gap-1.5 text-xs text-[#6b6b6b]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#006644]" />
              Ativo
            </span>
          </div>
          <div className="relative flex items-end justify-between mt-3">
            <div>
              <p className="text-[10px] text-[#6b6b6b] mb-0.5">Assinatura</p>
              <p className="text-lg font-bold text-[#1a1a1a]">{PLAN_LABELS[plan] || PLAN_LABELS.free}</p>
            </div>
            <p className="text-xs text-[#6b6b6b]">{PLAN_PRICES[plan]?.mensal || "R$ 0,00"} por mês</p>
          </div>
        </div>
        {/* Info rows */}
        <div className="mt-3">
          <div className="flex items-center justify-between py-2.5 border-b border-gray-100">
            <span className="text-xs text-gray-500">Próximo vencimento</span>
            <span className="text-xs font-medium text-black">{formatMemberDate(user?.plan_expires) || "—"}</span>
          </div>
          <div className="flex items-center justify-between py-2.5 border-b border-gray-100">
            <span className="text-xs text-gray-500">Renovação</span>
            <span className="text-xs font-medium text-black">{user?.auto_renew !== false ? "Automática" : "Por fatura"}</span>
          </div>
          <div className="flex items-center justify-between py-2.5">
            <span className="text-xs text-gray-500">IAs no plano</span>
            <span className="text-xs font-medium text-black">{(MODELS_BY_PLAN[plan] || MODELS_BY_PLAN.free).length}</span>
          </div>
        </div>
        <div className="mt-3 space-y-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#EEEEEE] text-[11px] font-medium text-gray-600">
            Automações
          </span>
          <button
            onClick={() => navigate("/plan-selection")}
            className="w-full py-2.5 rounded-xl border border-gray-300 bg-white text-sm font-medium text-black hover:bg-gray-50 transition-colors">
            Trocar de plano
          </button>
        </div>
      </div>

      {/* Credits card (purple) */}
      <div className="rounded-2xl bg-[#7C5DCF] text-white p-4 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold">Créditos</h3>
          <button
            onClick={() => navigate("/statement")}
            className="flex items-center gap-1.5 text-xs text-white border border-white rounded-full px-3 py-1.5 hover:bg-white/10 transition-colors"
          >
            Ver extrato
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Balance */}
        <div className="rounded-xl bg-white/10 border border-white/40 p-4 mb-4">
          <div className="mb-3">
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
            <div className="mt-3 flex items-end justify-between">
              <div>
                <p className="text-[11px] font-semibold tracking-wider text-white/70">Validade</p>
                <p className="text-xs text-white/90">Do plano</p>
              </div>
              <p className="text-xs text-white/90 text-right">
                {expiryLabel ? `${formatCredits(available)} até ${expiryLabel}` : "—"}
              </p>
            </div>
          </div>

          {/* Ritmo de uso */}
          <div className="border-t border-white/20 pt-3">
            <p className="text-sm font-semibold text-white/90 mb-1">Ritmo de uso</p>
            <p className="text-xs text-white/70 mb-3 leading-relaxed">
              Os créditos voltam aos poucos, conforme o consumo antigo sai da janela.
            </p>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-white/80">Últimas 24 horas</span>
                  <span className="text-xs font-medium text-white">{formatCredits(usage.daily)} de {formatCredits(dailyLimit)}</span>
                </div>
                <div className="h-2.5 rounded-full bg-white/20 overflow-hidden">
                  <div className="h-full bg-white rounded-full transition-all duration-700" style={{ width: `${dailyPct}%` }} />
                </div>
              </div>
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

        {/* Últimas movimentações */}
        <div>
          <p className="text-[11px] font-semibold tracking-wider text-white/70 mb-3">ÚLTIMAS MOVIMENTAÇÕES</p>
          <div className="space-y-3">
            {/* Plan credit refill */}
            <div className="flex items-start gap-2.5">
              <RefreshCw className="w-4 h-4 text-white/70 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white/90">Créditos do plano</p>
                <p className="text-[11px] text-white/70">{planRefillDate || "—"}</p>
              </div>
              <p className="text-xs font-semibold text-white shrink-0">+{formatCredits(credits.month)}</p>
            </div>
            {/* Movements */}
            {movements.slice(0, 6).map((m) => {
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
                      {m.model && (() => {
                        const logo = MODEL_LOGO_BY_NAME[m.model];
                        return (
                          <>
                            {logo ? <img src={logo} alt={m.model} className="w-3 h-3 rounded object-contain shrink-0" /> : <Sparkles className="w-3 h-3 shrink-0" />}
                            <span className="truncate">{m.model}</span>
                          </>
                        );
                      })()}
                    </p>
                  </div>
                  <p className="text-xs font-semibold text-white shrink-0">-{formatCredits(m.tokens || 0)}</p>
                </div>
              );
            })}
          </div>
          <button
            onClick={() => navigate("/statement")}
            className="mt-3 flex items-center gap-1 text-xs text-white/80 hover:text-white transition-colors"
          >
            Ver extrato completo <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-white/20 flex items-center justify-between gap-4">
          <p className="text-xs font-semibold text-white">Precisa de mais créditos?</p>
          <button
            onClick={() => navigate("/recharge-credits")}
            className="px-4 py-2 rounded-xl bg-[#311b92] text-white text-xs font-semibold hover:bg-[#281470] transition-colors">
            Recarregar
          </button>
        </div>
      </div>

      {/* Consumo por IA */}
      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
        <div className="px-4 pt-4 pb-1">
          <h2 className="text-base font-bold text-black">Consumo por IA</h2>
        </div>
        <div className="grid grid-cols-[2fr_1fr] gap-4 px-4 py-2 border-b border-gray-100">
          <span className="text-xs font-medium text-gray-400">IA</span>
          <span className="text-xs font-medium text-gray-400 text-right">Custo</span>
        </div>
        {mediaItems.map((item, i) => {
          const isLast = i === mediaItems.length - 1;
          return (
            <div key={item.id} className={`grid grid-cols-[2fr_1fr] gap-4 px-4 py-3 items-center ${!isLast ? "border-b border-gray-100" : ""}`}>
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                  {item.logo ? (
                    <img src={item.logo} alt={item.name} className="w-5 h-5 object-contain" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-gray-600" />
                  )}
                </div>
                <span className="text-sm font-medium text-black truncate">{item.name}</span>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#EEEEEE] text-[11px] font-medium text-gray-600">
                  Usa créditos
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Uso justo */}
      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
        <div className="px-4 pt-4 pb-2">
          <h2 className="text-base font-bold text-black">Uso justo</h2>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            As IAs de uso justo não gastam seus créditos: elas têm uma franquia própria, que renova junto com os créditos. Se a franquia acabar antes, elas pausam até a data mostrada na tela, e as outras IAs continuam normais com os seus créditos. Avisamos quando você chega a 80%.
          </p>
        </div>
        <div className="px-4 pb-4 space-y-3">
          {usageWindows.map((w) => {
            const pct = w.limit > 0 ? Math.min(100, Math.round((w.consumed / w.limit) * 100)) : 0;
            return (
              <div key={w.label} className="rounded-xl bg-[#F7F7F7] p-4">
                <p className="text-[11px] font-medium text-gray-500 mb-2">{w.label}</p>
                <p className="text-sm font-bold text-black mb-3">{formatCredits(w.consumed)} de {formatCredits(w.limit)}</p>
                <div className="h-1.5 rounded-full bg-[#E0E0E0] overflow-hidden">
                  <div className="h-full bg-gray-700 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
        {/* Footer */}
        <button
          onClick={() => setPolicyOpen((v) => !v)}
          className="w-full border-t border-gray-100 px-4 py-3 flex items-center justify-between transition-colors hover:bg-gray-50">
          <span className="text-xs font-medium text-black">Ler a política de uso justo</span>
          <ChevronDown className={`w-4 h-4 text-black transition-transform duration-200 ${policyOpen ? "rotate-180" : ""}`} />
        </button>
        <AnimatePresence>
          {policyOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="overflow-hidden">
              <div className="border-t border-gray-100 px-4 py-4 space-y-4">
                <p className="text-xs text-gray-500 leading-relaxed">
                  Nossos planos incluem IAs de uso justo, que funcionam com uma franquia separada dos seus créditos. A franquia existe para manter o serviço sustentável e justo para todos os usuários do mesmo plano.
                </p>
                {POLICY_SECTIONS.map((s) => (
                  <div key={s.heading}>
                    <h3 className="text-sm font-bold text-black mb-1">{s.heading}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{s.body}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}