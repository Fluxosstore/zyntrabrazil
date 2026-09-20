import React, { useState, useEffect } from "react";
import { X, Copy, Check, Loader2, Clipboard } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function PixPaymentModal({ open, onClose, qrCodeBase64, pixCode, planName, amount, orderId, onPaid }) {
  const [copied, setCopied] = useState(false);
  const [checking, setChecking] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(15 * 60);
  const [paid, setPaid] = useState(false);
  const [notPaid, setNotPaid] = useState(false);

  useEffect(() => {
    if (!open) return;
    setSecondsLeft(15 * 60);
    setPaid(false);
    setCopied(false);
    setNotPaid(false);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const timer = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [open]);

  useEffect(() => {
    if (!open || paid) return;
    const poll = setInterval(async () => {
      try {
        const order = await base44.entities.Order.get(orderId);
        if (order?.status === "paid") {
          setPaid(true);
          clearInterval(poll);
          setTimeout(() => onPaid(), 1500);
        }
      } catch {}
    }, 5000);
    return () => clearInterval(poll);
  }, [open, paid, orderId, onPaid]);

  if (!open) return null;

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${String(sec).padStart(2, "0")}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(pixCode || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCheckPaid = async () => {
    setChecking(true);
    try {
      const order = await base44.entities.Order.get(orderId);
      if (order?.status === "paid") {
        setPaid(true);
        setTimeout(() => onPaid(), 1500);
      } else {
        setNotPaid(true);
        setTimeout(() => setNotPaid(false), 2000);
      }
    } catch {}
    setChecking(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-black">Repasse via PIX</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-sm text-gray-600">
            Valor: {amount} - {planName}
          </p>

          <div className="flex justify-center">
            {qrCodeBase64 ? (
              <img
                src={qrCodeBase64.startsWith('data:') ? qrCodeBase64 : `data:image/png;base64,${qrCodeBase64}`}
                alt="QR Code PIX"
                className="w-48 h-48 rounded-lg"
              />
            ) : (
              <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            )}
          </div>

          <div className="bg-gray-50 rounded-full px-4 py-2.5 flex items-center gap-2">
            <span className="text-xs text-gray-500 truncate flex-1">{pixCode}</span>
          </div>

          <button
            onClick={handleCopy}
            className="w-full py-2.5 rounded-full border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Clipboard className="w-4 h-4" />}
            {copied ? "Copiado!" : "Copiar Código PIX"}
          </button>

          <button
            onClick={handleCheckPaid}
            disabled={checking || paid}
            className="w-full py-2.5 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] text-white text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            {paid ? (
              <Check className="w-4 h-4" />
            ) : checking ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            {paid ? "Pagamento confirmado!" : "Já paguei, verificar agora"}
          </button>

          {notPaid && (
            <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-red-500">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              Pagamento não efetuado
            </div>
          )}

          <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Aguardando pagamento... {formatTime(secondsLeft)}
          </div>
        </div>
      </div>
    </div>
  );
}