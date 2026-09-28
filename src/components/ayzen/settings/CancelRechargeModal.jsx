import React from "react";

export default function CancelRechargeModal({ open, onClose, onConfirm, amount }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-bold text-black mb-2">Desistir desta recarga?</h2>
        <p className="text-sm text-gray-500 leading-relaxed mb-6">
          A cobrança de {amount} sai das pendentes e deixa de ocupar uma vaga de recarga. Se ela for paga mesmo assim, o crédito entra normalmente.
        </p>
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-full border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Manter
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2.5 rounded-full bg-[#E11D48] text-white text-sm font-medium hover:bg-[#BE123C] transition-colors"
          >
            Desistir
          </button>
        </div>
      </div>
    </div>
  );
}