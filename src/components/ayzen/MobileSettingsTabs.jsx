import React from "react";
import { Wallet, ShieldCheck, Brain, Wand2, Plug } from "lucide-react";
import { ReceiptLinesIcon } from "@/components/ayzen/SettingsIcons";

const ICONS = {
  usage: Wallet,
  account: ShieldCheck,
  invoices: ReceiptLinesIcon,
  memories: Brain,
  skills: Wand2,
  connectors: Plug,
};

export default function MobileSettingsTabs({ active = "usage", onSelect, onRecharge }) {
  const items = [
    { id: "usage", label: "Perfil" },
    { id: "invoices", label: "Pagamentos" },
    { id: "account", label: "Segurança" },
    { id: "memories", label: "Memórias" },
    { id: "skills", label: "Habilidades" },
    { id: "connectors", label: "Conectores" },
  ];

  return (
    <div className="flex items-center gap-2 px-4 pb-3">
      <div className="flex-1 overflow-x-auto scrollbar-hide px-1">
        <div className="flex items-center gap-1 p-1 rounded-full bg-[#EAEAEA] w-max">
          {items.map((it) => {
            const Icon = ICONS[it.id];
            const isActive = active === it.id;
            return (
              <button
                key={it.id}
                onClick={() => onSelect?.(it.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-white text-black shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
                {it.label}
              </button>
            );
          })}
        </div>
      </div>
      <button
        onClick={onRecharge}
        className="flex items-center gap-1 px-4 py-2 rounded-full bg-[#7B61FF] text-white text-xs font-medium whitespace-nowrap shrink-0 hover:bg-[#6B51EF] transition-colors"
      >
        Recarregar
      </button>
    </div>
  );
}