import React from "react";
import { X, Printer, Download } from "lucide-react";

const MONTHS_PT = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

function formatTimestamp(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "—";
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${d.getDate()} de ${MONTHS_PT[d.getMonth()]}. de ${d.getFullYear()} • ${hh}:${min}`;
}

function formatPaid(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "—";
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `Pago em ${d.getDate()} de ${MONTHS_PT[d.getMonth()]}. de ${d.getFullYear()} • ${hh}:${min}`;
}

export default function ReceiptModal({ open, onClose, value, date, userEmail, userName }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-800">Comprovante de pagamento</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Card */}
        <div className="p-5">
          <div
            className="rounded-xl border border-gray-200 p-5"
            style={{
              backgroundColor: "#F9FAFB",
              backgroundImage: "radial-gradient(circle, #e5e7eb 1px, transparent 1px)",
              backgroundSize: "14px 14px",
            }}
          >
            {/* Brand */}
            <div className="flex items-center gap-2 mb-4">
              <img
                src="https://media.base44.com/images/public/6aab2e6298f803d865228a5d/114395417_589397f87_ChatGPTImage16desetde202623_41_31.webp"
                alt="Zyntra"
                className="w-7 h-7 rounded-lg object-cover"
              />
              <span className="text-sm font-bold text-gray-800">Zyntra</span>
            </div>
            <p className="text-sm font-semibold text-gray-700">Comprovante de pagamento</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
            <p className="text-xs text-gray-500 mt-1">{formatTimestamp(date)}</p>

            <div className="border-t border-dashed border-gray-300 my-4" />

            {/* Origem */}
            <p className="text-[10px] font-semibold tracking-wider text-gray-400">ORIGEM</p>
            <p className="text-sm font-bold text-gray-800 mt-0.5">{userName || "Cliente"}</p>
            <div className="mt-2 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">E-mail</span>
                <span className="text-xs font-medium text-gray-700 truncate ml-2 max-w-[60%]">{userEmail || "—"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Instituição</span>
                <span className="text-xs font-medium text-gray-700">QUICKWAY</span>
              </div>
            </div>

            <div className="border-t border-dashed border-gray-300 my-4" />

            {/* Destino */}
            <p className="text-[10px] font-semibold tracking-wider text-gray-400">DESTINO</p>
            <p className="text-sm font-bold text-gray-800 mt-0.5">Zyntra Tecnologia LTDA</p>
            <div className="mt-2 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Forma de pagamento</span>
                <span className="text-xs font-medium text-gray-700">QUICKWAY</span>
              </div>
            </div>

            <p className="text-[10px] text-gray-400 mt-4">ID 0E8A8380-12F87f6d6578</p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-700">Zyntra</p>
            <p className="text-[10px] text-gray-400">{formatPaid(date)}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              Imprimir
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Comprovante
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}