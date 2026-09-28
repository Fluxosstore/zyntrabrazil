import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { base44 } from "@/api/base44Client";
import { CREDITS_BY_PLAN } from "@/lib/quotaUtils";

function formatCredits(n) {
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
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

export default function FairUseCard({ plan: planProp }) {
  const { user } = useAuth();
  const plan = planProp || user?.plan || "free";
  const credits = CREDITS_BY_PLAN[plan] || CREDITS_BY_PLAN.free;
  const [expanded, setExpanded] = useState(false);
  const [usage, setUsage] = useState({ daily: 0, weekly: 0, monthly: 0 });

  useEffect(() => {
    (async () => {
      try {
        const records = await base44.entities.TokenUsage.list("-created_date", 500);
        const now = Date.now();
        const dayAgo = now - 24 * 60 * 60 * 1000;
        const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
        const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime();
        const daily = records.filter((r) => new Date(r.created_date).getTime() >= dayAgo).reduce((s, r) => s + (r.tokens || 0), 0);
        const weekly = records.filter((r) => new Date(r.created_date).getTime() >= weekAgo).reduce((s, r) => s + (r.tokens || 0), 0);
        const monthly = records.filter((r) => new Date(r.created_date).getTime() >= monthStart).reduce((s, r) => s + (r.tokens || 0), 0);
        setUsage({ daily, weekly, monthly });
      } catch (e) {}
    })();
  }, []);

  const dailyLimit = credits.day;
  const weeklyLimit = Math.round(credits.day * 7);
  const monthlyLimit = credits.month;

  const windows = [
    { label: "Últimas 24 horas", consumed: usage.daily, limit: dailyLimit },
    { label: "Últimos 7 dias", consumed: usage.weekly, limit: weeklyLimit },
    { label: "Neste ciclo", consumed: usage.monthly, limit: monthlyLimit }
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-1">
        <h2 className="text-base font-bold text-black">Uso justo</h2>
        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
          As IAs de uso justo não gastam seus créditos: elas têm uma franquia própria, que renova junto com os créditos. Se a franquia acabar antes, elas pausam até a data mostrada na tela, e as outras IAs continuam normais com os seus créditos. Avisamos quando você chega a 80%.
        </p>
      </div>

      {/* Sub-cards row */}
      <div className="px-5 pt-4 pb-5">
        <div className="grid grid-cols-3 gap-3">
          {windows.map((w) => {
            const pct = w.limit > 0 ? Math.min(100, Math.round((w.consumed / w.limit) * 100)) : 0;
            return (
              <div key={w.label} className="rounded-xl bg-[#F9F9FB] p-4">
                <p className="text-[11px] font-medium text-gray-500 mb-2">{w.label}</p>
                <p className="text-base font-bold text-black mb-3">{formatCredits(w.consumed)} de {formatCredits(w.limit)}</p>
                <div className="h-1.5 rounded-full bg-gray-200 overflow-hidden">
                  <div className="h-full bg-gray-700 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer / toggle */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full border-t border-gray-100 px-5 py-3.5 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <span className="text-xs font-medium text-gray-600">Ler a política de uso justo</span>
        {expanded ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
      </button>

      {/* Expanded policy */}
      {expanded && (
        <div className="border-t border-gray-100 px-5 py-5 space-y-4">
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
      )}
    </div>
  );
}