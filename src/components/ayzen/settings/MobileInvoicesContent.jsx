import React, { useState, useEffect, useRef } from "react";
import {
  MoreHorizontal,
  Eye,
  Download,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Plus,
  Clock,
  Check,
  ExternalLink,
  Copy,
  X,
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { PLAN_NUMERIC_PRICES, formatBRL } from "@/lib/planData";
import { base44 } from "@/api/base44Client";
import ReceiptModal from "@/components/ayzen/settings/ReceiptModal";
import PixPaymentModal from "@/components/ayzen/PixPaymentModal";
import CancelRechargeModal from "@/components/ayzen/settings/CancelRechargeModal";
import { useToast } from "@/components/ui/use-toast";

const MONTHS_PT = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const CREDIT_RATE = 4000;

function formatLongDate(dateStr) {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "—";
    return `${d.getDate()} de ${MONTHS_PT[d.getMonth()]} de ${d.getFullYear()}`;
  } catch {
    return "—";
  }
}

function formatShortDate(dateStr) {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "—";
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yy = String(d.getFullYear()).slice(-2);
    return `${dd}/${mm}/${yy}`;
  } catch {
    return "—";
  }
}

function addOneMonth(dateStr) {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "—";
    d.setMonth(d.getMonth() + 1);
    return `${d.getDate()} de ${MONTHS_PT[d.getMonth()]} de ${d.getFullYear()}`;
  } catch {
    return "—";
  }
}

function addOneDay(dateStr) {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "—";
    d.setDate(d.getDate() + 1);
    return `${d.getDate()} de ${MONTHS_PT[d.getMonth()]} de ${d.getFullYear()}`;
  } catch {
    return "—";
  }
}

function formatCredits(n) {
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export default function MobileInvoicesContent({ plan = "free" }) {
  const { user } = useAuth();
  const effectivePlan = user?.plan || plan;
  const cycle = user?.plan_cycle || "mensal";
  const isPaid = effectivePlan !== "free";

  const price = PLAN_NUMERIC_PRICES[effectivePlan]?.[cycle] || 0;
  const subValue = formatBRL(price);
  const subDate = user?.plan_subscribed_at;
  const startDate = formatLongDate(subDate);
  const endDate = addOneMonth(subDate);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [menuPos, setMenuPos] = useState(null);
  const [menuLoading, setMenuLoading] = useState(false);
  const [pixModal, setPixModal] = useState({ open: false, data: null });
  const [cancelModal, setCancelModal] = useState({ open: false, inv: null });
  const menuRef = useRef(null);
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        const list = await base44.entities.Order.filter(
          { created_by_id: user?.id },
          "-created_date",
          50
        );
        setOrders(list || []);
      } catch (e) {
        setOrders([]);
      }
      setLoading(false);
    })();
  }, [user?.id]);

  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpenMenuId(null);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const openMenu = (inv, btn) => {
    if (openMenuId === inv.id) {
      setOpenMenuId(null);
      return;
    }
    const r = btn.getBoundingClientRect();
    setMenuPos({ top: r.bottom + 4, right: window.innerWidth - r.right });
    setOpenMenuId(inv.id);
  };

  const copyToClipboard = (text) => {
    try {
      navigator.clipboard.writeText(text);
    } catch (e) {}
  };

  const fetchPixData = async (inv) => {
    const res = await base44.functions.invoke("mercadopagoGetPayment", {
      paymentId: inv.raw?.payment_id,
      orderId: inv.raw?.id,
    });
    return res.data || res;
  };

  const handleOpenPayment = async (inv) => {
    setOpenMenuId(null);
    setMenuLoading(true);
    try {
      const data = await fetchPixData(inv);
      if (!data.qr_code) {
        toast({ title: "Pagamento não disponível", description: "Não foi possível obter o QR Code do Pix.", variant: "destructive" });
        return;
      }
      setPixModal({
        open: true,
        data: {
          qrCodeBase64: data.qr_code_base64,
          pixCode: data.qr_code,
          amount: inv.value,
          orderId: inv.raw?.id,
        },
      });
    } catch (e) {
      toast({ title: "Erro ao abrir pagamento", description: e.message, variant: "destructive" });
    }
    setMenuLoading(false);
  };

  const handleCopyPix = async (inv) => {
    setOpenMenuId(null);
    setMenuLoading(true);
    try {
      const data = await fetchPixData(inv);
      if (!data.qr_code) {
        toast({ title: "Chave Pix não disponível", description: "Não foi possível obter a chave Pix.", variant: "destructive" });
        return;
      }
      copyToClipboard(data.qr_code);
      toast({ title: "Chave Pix copiada!", description: "Cole no app do seu banco para pagar." });
    } catch (e) {
      toast({ title: "Erro ao copiar Pix", description: e.message, variant: "destructive" });
    }
    setMenuLoading(false);
  };

  const handleCopyId = (inv) => {
    setOpenMenuId(null);
    const id = inv.raw?.payment_id || inv.raw?.id || inv.id;
    copyToClipboard(String(id));
    toast({ title: "ID copiado!", description: `ID ${id} copiado para a área de transferência.` });
  };

  // Build invoice rows from orders + subscription
  const invoices = [];
  for (const o of orders) {
    if (o.status === "cancelled") continue;
    const isRecharge = o.plan === "credits";
    const date = formatLongDate(o.created_date);
    const shortDate = formatShortDate(o.created_date);
    const value = formatBRL(o.amount || 0);
    const status = o.status === "paid" ? "paid" : "pending";
    if (isRecharge) {
      invoices.push({
        id: o.id,
        date,
        shortDate,
        type: "Recarga",
        credits: formatCredits((o.amount || 0) * CREDIT_RATE),
        period: "—",
        due: addOneDay(o.created_date),
        dueShort: formatShortDate(new Date(new Date(o.created_date).getTime() + 86400000).toISOString()),
        status,
        value,
        paymentId: o.payment_id,
        raw: o,
      });
    } else {
      invoices.push({
        id: o.id,
        date,
        shortDate,
        type: "Assinatura",
        credits: "—",
        period: `${startDate} a ${endDate}`,
        due: date,
        dueShort: shortDate,
        status,
        value,
        raw: o,
      });
    }
  }
  if (isPaid && !invoices.some((i) => i.type === "Assinatura")) {
    invoices.push({
      id: "sub-synthetic",
      date: startDate,
      shortDate: formatShortDate(subDate),
      type: "Assinatura",
      credits: "—",
      period: `${startDate} a ${endDate}`,
      due: startDate,
      dueShort: formatShortDate(subDate),
      status: "paid",
      value: subValue,
      synthetic: true,
    });
  }

  const handleCancelRecharge = (inv) => {
    setOpenMenuId(null);
    setCancelModal({ open: true, inv });
  };

  const confirmCancelRecharge = async () => {
    const inv = cancelModal.inv;
    if (!inv) return;
    try {
      await base44.entities.Order.update(inv.raw.id, { status: "cancelled" });
      setOrders((prev) => prev.map((o) => (o.id === inv.raw.id ? { ...o, status: "cancelled" } : o)));
      toast({ title: "Recarga cancelada", description: "A cobrança saiu das pendentes." });
    } catch (e) {
      toast({ title: "Erro ao cancelar", description: e.message, variant: "destructive" });
    }
    setCancelModal({ open: false, inv: null });
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 py-5 space-y-5">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-black">Pagamentos</h1>
          <p className="text-sm text-gray-500 mt-1">Sua assinatura, suas faturas e suas recargas.</p>
        </div>

        {/* Assinatura card */}
        <section>
          <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
            <div className="px-5 pt-5 pb-1">
              <h2 className="text-base font-bold text-black">Assinatura</h2>
              <p className="text-xs text-gray-500 mt-0.5">Renovação, forma de pagamento e cancelamento.</p>
            </div>
            <div className="px-4 pb-4 pt-3">
              <div className="rounded-xl bg-[#F5F5F5] p-4">
                <p className="text-sm font-bold text-black">Renovação por fatura</p>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  A cada ciclo você recebe a fatura e paga por Pix, sem débito automático. Cancele quando quiser e mantenha o acesso até o vencimento.
                </p>
                <button className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#D93F3F] bg-white text-xs font-medium text-[#D93F3F] active:bg-red-50 transition-colors">
                  <X className="w-3.5 h-3.5" />
                  Cancelar renovação
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Faturas card */}
        <section>
          <h2 className="text-base font-bold text-black mb-3">Faturas</h2>
          <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
            {loading ? (
              <div className="px-5 py-12 flex flex-col items-center justify-center">
                <p className="text-sm text-gray-400">Carregando faturas…</p>
              </div>
            ) : invoices.length === 0 ? (
              <div className="px-5 py-12 flex flex-col items-center justify-center">
                <p className="text-sm text-gray-400">Nenhuma fatura ainda.</p>
              </div>
            ) : (
              invoices.map((inv, idx) => {
                const isRecharge = inv.type === "Recarga";
                const isPending = inv.status === "pending";
                return (
                  <div
                    key={inv.id}
                    className={`px-4 py-4 ${idx !== invoices.length - 1 ? "border-b border-gray-100" : ""}`}
                  >
                    {/* Top row: badge + value */}
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[11px] font-medium">
                        {isRecharge ? <Plus className="w-3 h-3" /> : <RefreshCw className="w-3 h-3" />}
                        {inv.type}
                      </span>
                      <span className="text-sm font-semibold text-black">{inv.value}</span>
                    </div>
                    {/* Middle row: date + period */}
                    <p className="text-xs text-gray-500 mt-2">
                      {inv.shortDate} {inv.period !== "—" ? inv.period : ""}
                    </p>
                    {/* Due row */}
                    <p className="text-xs text-gray-500 mt-1">Vence em {inv.dueShort}</p>
                    {/* Footer: status badge + menu */}
                    <div className="flex items-center justify-between mt-3">
                      {isPending ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#FFF5E6] text-[#D35400] text-[11px] font-medium">
                          <Clock className="w-3 h-3" />
                          Pendente
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#E8F8F0] text-[#27AE60] text-[11px] font-medium">
                          <Check className="w-3 h-3" />
                          Paga
                        </span>
                      )}
                      <div className="relative" ref={openMenuId === inv.id ? menuRef : null}>
                        <button
                          onClick={(e) => openMenu(inv, e.currentTarget)}
                          className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
                            openMenuId === inv.id
                              ? "bg-gray-100 text-gray-700"
                              : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                          }`}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                        {openMenuId === inv.id && menuPos && (
                          <div
                            className="fixed w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 px-1.5 z-50"
                            style={{ top: menuPos.top, right: menuPos.right }}
                          >
                            {isRecharge && isPending ? (
                              <>
                                <button
                                  onClick={() => handleOpenPayment(inv)}
                                  disabled={menuLoading}
                                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-[#333333] hover:bg-gray-100 transition-colors text-left disabled:opacity-50"
                                >
                                  <ExternalLink className="w-4 h-4 text-[#333333]" />
                                  Abrir pagamento
                                </button>
                                <button
                                  onClick={() => handleCopyPix(inv)}
                                  disabled={menuLoading}
                                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-[#333333] hover:bg-gray-100 transition-colors text-left disabled:opacity-50"
                                >
                                  <Copy className="w-4 h-4 text-[#333333]" />
                                  Copiar Pix
                                </button>
                                <button
                                  onClick={() => handleCopyId(inv)}
                                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-[#333333] hover:bg-gray-100 transition-colors text-left"
                                >
                                  <Copy className="w-4 h-4 text-[#333333]" />
                                  Copiar ID
                                </button>
                                <div className="my-1 border-t border-gray-100" />
                                <button
                                  onClick={() => handleCancelRecharge(inv)}
                                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-[#D93025] hover:bg-red-50 transition-colors text-left"
                                >
                                  <X className="w-4 h-4 text-[#D93025]" />
                                  Desistir da recarga
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    setModalData({ value: inv.value, date: inv.raw?.created_date || subDate });
                                    setModalOpen(true);
                                  }}
                                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-[#333333] hover:bg-gray-100 transition-colors text-left"
                                >
                                  <Eye className="w-4 h-4 text-[#333333]" />
                                  Visualizar
                                </button>
                                <button
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    window.print();
                                  }}
                                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-[#333333] hover:bg-gray-100 transition-colors text-left"
                                >
                                  <Download className="w-4 h-4 text-[#333333]" />
                                  Comprovante
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            {/* Pagination footer */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Por página</span>
                <button className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-gray-200 bg-white text-xs font-medium text-gray-700">
                  10
                </button>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500">
                  {invoices.length > 0 ? `1–${invoices.length}` : "0"}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 disabled:opacity-40"
                    disabled
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 disabled:opacity-40"
                    disabled
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <ReceiptModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        value={modalData?.value || subValue}
        date={modalData?.date || subDate}
        userEmail={user?.email}
        userName={user?.full_name}
      />

      {pixModal.open && pixModal.data && (
        <PixPaymentModal
          open={true}
          onClose={() => setPixModal({ open: false, data: null })}
          qrCodeBase64={pixModal.data.qrCodeBase64}
          pixCode={pixModal.data.pixCode}
          planName="Créditos avulsos"
          amount={pixModal.data.amount}
          orderId={pixModal.data.orderId}
          onPaid={() => setPixModal({ open: false, data: null })}
        />
      )}

      <CancelRechargeModal
        open={cancelModal.open}
        amount={cancelModal.inv?.value || ""}
        onClose={() => setCancelModal({ open: false, inv: null })}
        onConfirm={confirmCancelRecharge}
      />
    </div>
  );
}