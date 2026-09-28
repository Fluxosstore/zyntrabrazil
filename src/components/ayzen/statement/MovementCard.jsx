import React from "react";
import { MessageCircle, RefreshCw, Sparkles } from "lucide-react";
import { CoinStackIcon } from "@/components/ayzen/SettingsIcons";

const MONTHS_PT = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

function formatCredits(n) {
  return Math.round(Math.abs(n)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "—";
  return `${d.getDate()} de ${MONTHS_PT[d.getMonth()]}., ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

/**
 * Card individual de movimentação — idêntico ao design de referência.
 * Cada item é um cardzinho interno com fundo claro, borda fina e cantos arredondados.
 */
export default function MovementCard({ movement, modelLogo }) {
  const tokens = movement.tokens || 0;
  const isPositive = tokens > 0;
  const isPlanCredit =
    movement.model === "Créditos do plano" ||
    movement.prompt === "Créditos do plano" ||
    (isPositive && !movement.model);
  const badgeLabel = isPlanCredit ? "Créditos do plano" : "Conversa";
  const description = movement.prompt || (isPlanCredit ? "Créditos do plano" : "Conversa");
  const showModel = movement.model && !isPlanCredit;

  return (
    <div className="bg-[#F9F9F9] border border-[#E5E7EB] rounded-2xl p-3.5">
      {/* Top row: badge + value */}
      <div className="flex items-center justify-between mb-2.5">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-[#E5E7EB] text-[11px] font-medium text-gray-700">
          {isPlanCredit ? (
            <RefreshCw className="w-3 h-3 text-gray-500" />
          ) : (
            <MessageCircle className="w-3 h-3 text-gray-500" />
          )}
          {badgeLabel}
        </span>
        <span className="flex items-center gap-1">
          <CoinStackIcon className={`w-3.5 h-3.5 ${isPositive ? "text-[#2E7D32]" : "text-[#B91C1C]"}`} />
          <span
            className={`text-sm font-bold tabular-nums ${
              isPositive ? "text-[#2E7D32]" : "text-[#B91C1C]"
            }`}
          >
            {isPositive ? "+" : "-"}
            {formatCredits(tokens)}
          </span>
        </span>
      </div>

      {/* Middle row: description */}
      <p className="text-sm text-black font-medium mb-2 truncate">{description}</p>

      {/* Bottom row: timestamp + model */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-gray-500">{formatDate(movement.created_date)}</span>
        {showModel ? (
          <span className="flex items-center gap-1 text-[11px] text-gray-500">
            {modelLogo ? (
              <img
                src={modelLogo}
                alt={movement.model}
                className="w-3 h-3 rounded object-contain"
              />
            ) : (
              <Sparkles className="w-3 h-3 text-orange-500" />
            )}
            {movement.model}
          </span>
        ) : (
          <span className="text-[11px] text-gray-400">—</span>
        )}
      </div>
    </div>
  );
}