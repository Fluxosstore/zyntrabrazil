import React from "react";
import { DollarSign, MoreHorizontal } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { useAuth } from "@/lib/AuthContext";
import { PLAN_NUMERIC_PRICES, formatBRL } from "@/lib/planData";

function formatPtDate(dateStr) {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "—";
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  } catch {
    return "—";
  }
}

export default function InvoicesContent({ plan = "free" }) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const effectivePlan = user?.plan || plan;
  const cycle = user?.plan_cycle || "mensal";
  const isPaid = effectivePlan !== "free";

  const price = PLAN_NUMERIC_PRICES[effectivePlan]?.[cycle] || 0;
  const value = formatBRL(price);
  const date = formatPtDate(user?.plan_subscribed_at);

  if (!isPaid) {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="px-10 py-8 space-y-8">
          <div>
            <p className="text-xs text-gray-400">{t("settings.title")}</p>
            <h1 className="text-2xl font-bold text-black mt-0.5">{t("settings.invoices")}</h1>
            <p className="text-sm text-gray-500 mt-1">{t("settings.invoicesSubtitle")}</p>
          </div>

          <div className="border-t border-gray-200" />

          <div className="rounded-2xl border border-gray-200 bg-[#fafafa] flex flex-col items-center justify-center py-16">
            <div className="w-12 h-12 rounded-xl border border-gray-200 bg-white flex items-center justify-center mb-3">
              <DollarSign className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-base font-bold text-black">{t("settings.noInvoices")}</p>
            <p className="text-sm text-gray-500 mt-1">{t("settings.noInvoicesDesc")}</p>
          </div>
        </div>
      </div>
    );
  }

  const invoices = [
    { id: 1, value, status: "paid", date, method: "Quickway" },
  ];

  const paidCount = invoices.filter((i) => i.status === "paid").length;
  const pendingCount = invoices.filter((i) => i.status === "pending").length;
  const lastDate = invoices[0]?.date || "—";

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-10 py-8 space-y-8">
        {/* Header */}
        <div>
          <p className="text-xs text-gray-400">{t("settings.title")}</p>
          <h1 className="text-2xl font-bold text-black mt-0.5">{t("settings.invoices")}</h1>
          <p className="text-sm text-gray-500 mt-1">{t("settings.invoicesSubtitle")}</p>
        </div>

        <div className="border-t border-gray-200" />

        {/* Summary card */}
        <section>
          <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
            <div className="flex items-center gap-3 p-5">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                <DollarSign className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-semibold tracking-wider text-gray-400">
                  {t("settings.invoicesTotal")}
                </p>
                <p className="text-lg font-bold text-black">{value}</p>
                <p className="text-xs text-gray-500">{t("settings.invoicesSubtitle")}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 border-t border-gray-100">
              <div className="p-4 border-r border-gray-100">
                <p className="text-[10px] font-semibold tracking-wider text-gray-400">
                  {t("settings.invoicesPaid")}
                </p>
                <p className="text-lg font-bold text-black mt-0.5">{paidCount}</p>
              </div>
              <div className="p-4 border-r border-gray-100">
                <p className="text-[10px] font-semibold tracking-wider text-gray-400">
                  {t("settings.invoicesPending")}
                </p>
                <p className="text-lg font-bold text-black mt-0.5">{pendingCount}</p>
              </div>
              <div className="p-4">
                <p className="text-[10px] font-semibold tracking-wider text-gray-400">
                  {t("settings.invoicesDate")}
                </p>
                <p className="text-lg font-bold text-black mt-0.5">{lastDate}</p>
              </div>
            </div>
          </div>
        </section>

        {/* History table */}
        <section>
          <h2 className="text-base font-bold text-black mb-1">{t("settings.invoicesHistory")}</h2>
          <p className="text-xs text-gray-500 mb-3">{t("settings.noInvoicesDesc")}</p>
          <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-[1fr_1fr_1.2fr_1fr_48px] gap-2 px-5 py-3 border-b border-gray-100 bg-gray-50">
              <span className="text-[10px] font-semibold tracking-wider text-gray-400">
                {t("settings.invoicesValue")}
              </span>
              <span className="text-[10px] font-semibold tracking-wider text-gray-400">
                {t("settings.invoicesStatus")}
              </span>
              <span className="text-[10px] font-semibold tracking-wider text-gray-400">
                {t("settings.invoicesDate")}
              </span>
              <span className="text-[10px] font-semibold tracking-wider text-gray-400">
                {t("settings.invoicesMethod")}
              </span>
              <span className="text-[10px] font-semibold tracking-wider text-gray-400 text-right">
                {t("settings.invoicesActions")}
              </span>
            </div>
            {/* Table rows */}
            {invoices.map((inv) => (
              <div
                key={inv.id}
                className="grid grid-cols-[1fr_1fr_1.2fr_1fr_48px] gap-2 items-center px-5 py-4 border-b border-gray-100 last:border-b-0"
              >
                <span className="text-sm font-bold text-black">{inv.value}</span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-xs font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    {t("settings.invoicesPaidStatus")}
                  </span>
                </span>
                <div>
                  <p className="text-[10px] font-semibold tracking-wider text-gray-400">
                    {t("settings.invoicesPaidOn")}
                  </p>
                  <p className="text-sm text-black">{inv.date}</p>
                </div>
                <span className="text-sm text-black">{inv.method}</span>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors justify-self-end">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}