import React from "react";
import { ChevronDown } from "lucide-react";

const WINDOWS = [
  { label: "Últimas 24 horas", value: "0 de 5.999" },
  { label: "Últimos 7 dias", value: "0 de 41.999" },
  { label: "Neste ciclo", value: "0 de 59.999" }
];

export default function FairUseCard() {
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
          {WINDOWS.map((w) => (
            <div key={w.label} className="rounded-xl bg-[#F9F9FB] p-4">
              <p className="text-[11px] font-medium text-gray-500 mb-2">{w.label}</p>
              <p className="text-base font-bold text-black mb-3">{w.value}</p>
              <div className="h-1.5 rounded-full bg-gray-200 overflow-hidden">
                <div className="h-full bg-gray-700 rounded-full" style={{ width: "0%" }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 px-5 py-3.5 flex items-center justify-between">
        <span className="text-xs font-medium text-gray-600">Ler a política de uso justo</span>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </div>
    </div>
  );
}